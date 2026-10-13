import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import * as TaskManager from "expo-task-manager";
import { route } from "./route";
import { readPlayedIds, readSnapshot, resetStorage, writePlayedIds, writeSnapshot } from "./storage";
import { LatLng, TourPoint } from "./types";
import { filterRelevantQueue, getTriggeredPoints } from "./triggerEngine";

export const LOCATION_TASK_NAME = "mv-audio-tour-location";

let speaking = false;
let lastSpeechEndedAt = 0;
let queue: TourPoint[] = [];
let currentPoint: TourPoint | null = null;
let speechToken = 0;
let currentSound: Audio.Sound | null = null;

async function stopCurrentSound() {
  if (!currentSound) return;
  const sound = currentSound;
  currentSound = null;
  await sound.stopAsync().catch(() => undefined);
  await sound.unloadAsync().catch(() => undefined);
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) return;

  const locations = (data as { locations?: Location.LocationObject[] } | undefined)?.locations ?? [];
  for (const location of locations) {
    await handleLocationUpdate({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      accuracy: location.coords.accuracy
    });
  }
});

export async function handleLocationUpdate(location: LatLng) {
  const playedIds = new Set(await readPlayedIds());
  queue = filterRelevantQueue(location, queue);

  const triggered = getTriggeredPoints(location, route.points, playedIds);
  for (const point of triggered) {
    if (currentPoint?.id !== point.id && !queue.some((queued) => queued.id === point.id)) {
      queue.push(point);
    }
  }

  queue.sort((a, b) => a.order - b.order);
  await writePlayedIds([...playedIds]);
  await writeSnapshot({
    location,
    lastSpokenTitle: (await readSnapshot()).lastSpokenTitle,
    queue: currentPoint ? [currentPoint.id, ...queue.map((point) => point.id)] : queue.map((point) => point.id)
  });

  void drainQueue();
}

export async function simulatePoint(point: TourPoint) {
  const playedIds = await readPlayedIds();
  await writePlayedIds(playedIds.filter((id) => id !== point.id));
  queue = [];
  if (currentPoint?.id === point.id) return;
  queue.push(point);
  await writeSnapshot({
    ...(await readSnapshot()),
    queue: [point.id]
  });
  void drainQueue();
}

export async function simulateSequence(points: TourPoint[]) {
  const pointIds = new Set(points.map((point) => point.id));
  const playedIds = await readPlayedIds();
  await writePlayedIds(playedIds.filter((id) => !pointIds.has(id)));
  queue = points.filter((point) => currentPoint?.id !== point.id).sort((a, b) => a.order - b.order);
  await writeSnapshot({
    ...(await readSnapshot()),
    queue: currentPoint ? [currentPoint.id, ...queue.map((point) => point.id)] : queue.map((point) => point.id)
  });
  void drainQueue();
}

export async function getPlayedIds() {
  return readPlayedIds();
}

export async function seedPlayedIds(ids: string[]) {
  await writePlayedIds(ids);
}

export async function getRuntimeSnapshot() {
  return readSnapshot();
}

export async function resetTourState() {
  queue = [];
  currentPoint = null;
  speaking = false;
  speechToken += 1;
  lastSpeechEndedAt = 0;
  await Speech.stop();
  await stopCurrentSound();
  await resetStorage();
}

async function drainQueue() {
  if (speaking || queue.length === 0) return;

  const now = Date.now();
  const waitMs = Math.max(0, route.queueGapMs - (now - lastSpeechEndedAt));
  if (waitMs > 0) {
    setTimeout(() => void drainQueue(), waitMs);
    return;
  }

  const point = queue.shift();
  if (!point) return;

  speaking = true;
  currentPoint = point;
  const token = ++speechToken;
  await writeSnapshot({
    ...(await readSnapshot()),
    lastSpokenTitle: point.title,
    queue: [point, ...queue].map((queued) => queued.id)
  });

  if (point.audioSource) {
    void playLocalNarration(point, token);
    return;
  }

  Speech.speak(buildSpeechText(point), {
    rate: 0.94,
    onDone: () => {
      void markSpeechDone(point, token);
    },
    onStopped: () => {
      void markSpeechInterrupted(point, token);
    },
    onError: () => {
      void markSpeechInterrupted(point, token);
    }
  });
}

async function playLocalNarration(point: TourPoint, token: number) {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false
    });
    const { sound } = await Audio.Sound.createAsync(point.audioSource!, { shouldPlay: true });
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) {
        if (status.error) void markSpeechInterrupted(point, token);
        return;
      }
      if (status.didJustFinish) {
        void sound.unloadAsync();
        if (currentSound === sound) currentSound = null;
        void markSpeechDone(point, token);
      }
    });
  } catch {
    await markSpeechInterrupted(point, token);
  }
}

async function markSpeechDone(point: TourPoint, token: number) {
  if (token !== speechToken) return;

  const playedIds = await readPlayedIds();
  await writePlayedIds([...playedIds, point.id]);

  if (currentPoint?.id === point.id) {
    currentPoint = null;
  }

  speaking = false;
  lastSpeechEndedAt = Date.now();
  await writeSnapshot({
    ...(await readSnapshot()),
    lastSpokenTitle: point.title,
    queue: queue.map((queued) => queued.id)
  });
  void drainQueue();
}

async function markSpeechInterrupted(point: TourPoint, token: number) {
  if (token !== speechToken) return;

  if (currentPoint?.id === point.id) {
    currentPoint = null;
  }

  speaking = false;
  lastSpeechEndedAt = Date.now();
  await writeSnapshot({
    ...(await readSnapshot()),
    queue: queue.map((queued) => queued.id)
  });
  void drainQueue();
}

function buildSpeechText(point: TourPoint) {
  const sideText = point.side === "ahead" ? "" : `Look ${point.side}. `;
  return `${point.title}. ${sideText}${point.text}`;
}
