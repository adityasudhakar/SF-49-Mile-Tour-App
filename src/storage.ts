import AsyncStorage from "@react-native-async-storage/async-storage";
import { RuntimeSnapshot } from "./types";

const PLAYED_IDS_KEY = "mvAudioTour.playedIds";
const SNAPSHOT_KEY = "mvAudioTour.snapshot";

export async function readPlayedIds() {
  const raw = await AsyncStorage.getItem(PLAYED_IDS_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function writePlayedIds(ids: string[]) {
  await AsyncStorage.setItem(PLAYED_IDS_KEY, JSON.stringify([...new Set(ids)]));
}

export async function readSnapshot(): Promise<RuntimeSnapshot> {
  const raw = await AsyncStorage.getItem(SNAPSHOT_KEY);
  return raw ? (JSON.parse(raw) as RuntimeSnapshot) : { location: null, queue: [] };
}

export async function writeSnapshot(snapshot: RuntimeSnapshot) {
  await AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export async function resetStorage() {
  await AsyncStorage.multiRemove([PLAYED_IDS_KEY, SNAPSHOT_KEY]);
}
