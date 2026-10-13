import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AppState,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { StatusBar } from "expo-status-bar";
import {
  LOCATION_TASK_NAME,
  getPlayedIds,
  getRuntimeSnapshot,
  resetTourState,
  simulatePoint,
  simulateSequence
} from "./src/backgroundTask";
import { route } from "./src/route";
import { TourPoint } from "./src/types";
import { findNearestPoint, findNextPoint } from "./src/triggerEngine";

type Coords = {
  lat: number;
  lng: number;
  accuracy?: number | null;
};

const DEMO_POINT_IDS = ["ferry-building", "golden-gate-bridge", "twin-peaks"];

export default function App() {
  const [active, setActive] = useState(false);
  const [pendingAction, setPendingAction] = useState<"start" | "stop" | "reset" | null>(null);
  const [playedIds, setPlayedIds] = useState<string[]>([]);
  const [location, setLocation] = useState<Coords | null>(null);
  const [status, setStatus] = useState("Stopped");
  const [lastSpoken, setLastSpoken] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [played, snapshot] = await Promise.all([getPlayedIds(), getRuntimeSnapshot()]);
    setPlayedIds(played);
    setLocation(snapshot.location);
    setLastSpoken(snapshot.lastSpokenTitle ?? null);
    setActive(await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME));
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 1500);
    const subscription = AppState.addEventListener("change", refresh);
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [refresh]);

  const playedSet = useMemo(() => new Set(playedIds), [playedIds]);
  const nextPoint = useMemo(() => findNextPoint(route.points, playedSet), [playedSet]);
  const nearestPoint = useMemo(
    () => (location ? findNearestPoint(location, route.points, playedSet) : null),
    [location, playedSet]
  );
  const isBusy = pendingAction !== null;
  const startTitle = pendingAction === "start" ? "Starting..." : active ? "Live" : "Start";
  const stopTitle = pendingAction === "stop" ? "Stopping..." : active ? "Stop" : "Stopped";
  const resetTitle = pendingAction === "reset" ? "Resetting..." : status === "Reset Done" ? "Reset Done" : "Reset";

  async function requestPermissions() {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.status !== "granted") {
      Alert.alert("Location denied", "Allow location while using the app first.");
      return false;
    }

    const background = await Location.requestBackgroundPermissionsAsync();
    if (background.status !== "granted") {
      Alert.alert(
        "Background location denied",
        "Choose Always Allow so the tour can keep triggering while Google Maps is open."
      );
      return false;
    }

    return true;
  }

  async function startTour() {
    if (active || isBusy) return;
    setPendingAction("start");
    setStatus("Starting...");

    try {
      const ok = await requestPermissions();
      if (!ok) {
        setStatus("Stopped");
        return;
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        activityType: Location.ActivityType.AutomotiveNavigation,
        distanceInterval: 15,
        deferredUpdatesDistance: 0,
        deferredUpdatesInterval: 0,
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true
      });

      setActive(true);
      setStatus("Live");
      await refresh();
    } finally {
      setPendingAction(null);
    }
  }

  async function stopTour() {
    if (isBusy) return;
    setPendingAction("stop");
    setStatus("Stopping...");

    try {
      const started = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (started) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
      await Speech.stop();
      setActive(false);
      setStatus("Stopped");
      await refresh();
    } finally {
      setPendingAction(null);
    }
  }

  async function resetTour() {
    if (isBusy) return;
    setPendingAction("reset");
    setStatus("Resetting...");

    try {
      await resetTourState();
      await refresh();
      setStatus("Reset Done");
    } finally {
      setPendingAction(null);
    }
  }

  async function simulate(point: TourPoint) {
    await simulatePoint(point);
    setStatus(`Simulated ${point.title}`);
    await refresh();
  }

  async function runDemo() {
    setStatus("Preparing three-stop demo...");
    await resetTourState();
    const demoPoints = DEMO_POINT_IDS.map((id) => route.points.find((point) => point.id === id)).filter(
      (point): point is TourPoint => Boolean(point)
    );
    await simulateSequence(demoPoints);
    setStatus("Demo playing");
    await refresh();
  }

  async function testVoice() {
    setStatus("Preparing voice test");

    try {
      await Speech.stop();
      const voices = await Speech.getAvailableVoicesAsync();
      const voice =
        voices.find((candidate) => candidate.language.toLowerCase().startsWith("en-us")) ??
        voices.find((candidate) => candidate.language.toLowerCase().startsWith("en")) ??
        voices[0];
      const voiceCount = `${voices.length} voice${voices.length === 1 ? "" : "s"}`;

      Speech.speak("Voice test. Mountain View audio tour is ready.", {
        language: "en-US",
        pitch: 1,
        rate: 0.94,
        voice: voice?.identifier,
        onStart: () => setStatus(`Speaking test (${voiceCount})`),
        onDone: () => setStatus("Voice test done"),
        onStopped: () => setStatus("Voice test stopped"),
        onError: (error) => setStatus(`Speech error: ${error.message || "unknown"}`)
      });
      setStatus(`Queued voice test (${voiceCount})`);
    } catch (error) {
      setStatus(`Speech setup error: ${error instanceof Error ? error.message : "unknown"}`);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Native GPS Audio Tour</Text>
            <Text style={styles.title}>{route.name}</Text>
          </View>
          <Text style={[styles.badge, active ? styles.badgeLive : styles.badgeIdle]}>{active ? "Live" : status}</Text>
        </View>

        <View style={styles.controls}>
          <PrimaryButton title={startTitle} onPress={startTour} disabled={active || isBusy} active={active} />
          <SecondaryButton title={stopTitle} onPress={stopTour} disabled={!active || isBusy} />
          <SecondaryButton title={resetTitle} onPress={resetTour} disabled={isBusy} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.label}>Nearest Unplayed</Text>
          <Text style={styles.nextTitle}>{nearestPoint?.point.title ?? nextPoint?.title ?? "Tour complete"}</Text>
          <Text style={styles.muted}>
            {nearestPoint
              ? `${Math.round(nearestPoint.distance)} m from trigger. Nearby route points can play before scripted order.`
              : "Waiting for location"}
          </Text>
        </View>

        <View style={styles.telemetry}>
          <Metric label="GPS" value={location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "No fix"} />
          <Metric label="Accuracy" value={location?.accuracy ? `+/- ${Math.round(location.accuracy)} m` : "-"} />
          <Metric label="Played" value={`${playedIds.length} / ${route.points.length}`} />
          <Metric label="Last Spoken" value={lastSpoken ?? "-"} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.label}>Audio</Text>
          <Text style={styles.muted}>Use this before driving to confirm output is routed to the car.</Text>
          <View style={styles.audioControls}>
            <SecondaryButton title="Test Voice" onPress={testVoice} />
            <SecondaryButton title="Play 3-Stop Demo" onPress={runDemo} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Route Points</Text>
        {route.points.map((point) => (
          <View key={point.id} style={styles.pointRow}>
            <View style={[styles.orderBubble, playedSet.has(point.id) && styles.orderBubbleDone]}>
              <Text style={styles.orderText}>{point.order}</Text>
            </View>
            <View style={styles.pointText}>
              <Text style={styles.pointTitle}>{point.title}</Text>
              <Text style={styles.muted}>
                {point.side === "ahead" ? "Ahead" : `Look ${point.side}`} · {point.radiusMeters} m trigger · {point.triggerPoints.length} anchors
              </Text>
            </View>
            <TouchableOpacity style={styles.smallButton} onPress={() => simulate(point)}>
              <Text style={styles.smallButtonText}>Sim</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function PrimaryButton({
  title,
  onPress,
  disabled = false,
  active = false
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, styles.primaryButton, active && styles.activeButton, disabled && !active && styles.disabledButton]}
      onPress={onPress}
    >
      <Text style={[styles.primaryButtonText, disabled && !active && styles.disabledButtonText]}>{title}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity disabled={disabled} style={[styles.button, disabled && styles.disabledButton]} onPress={onPress}>
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>{title}</Text>
    </TouchableOpacity>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f5ef"
  },
  container: {
    padding: 16,
    paddingBottom: 40
  },
  header: {
    backgroundColor: "#fff",
    borderColor: "#ddd7ca",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 14,
    padding: 16
  },
  eyebrow: {
    color: "#68645f",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase"
  },
  title: {
    color: "#202124",
    fontSize: 26,
    fontWeight: "800"
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  badgeLive: {
    backgroundColor: "#dff0e5",
    color: "#2f6f45"
  },
  badgeIdle: {
    backgroundColor: "#ece6d8",
    color: "#68645f"
  },
  controls: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14
  },
  audioControls: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd7ca",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  primaryButton: {
    backgroundColor: "#176b87",
    borderColor: "#176b87"
  },
  activeButton: {
    backgroundColor: "#2f6f45",
    borderColor: "#2f6f45"
  },
  disabledButton: {
    backgroundColor: "#eeeae0",
    borderColor: "#ddd7ca"
  },
  buttonText: {
    color: "#202124",
    fontWeight: "800"
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800"
  },
  disabledButtonText: {
    color: "#8a8378"
  },
  panel: {
    backgroundColor: "#fff",
    borderColor: "#ddd7ca",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16
  },
  label: {
    color: "#68645f",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
    textTransform: "uppercase"
  },
  nextTitle: {
    color: "#202124",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 6
  },
  muted: {
    color: "#68645f",
    fontSize: 13
  },
  telemetry: {
    backgroundColor: "#fff",
    borderColor: "#ddd7ca",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
    padding: 16
  },
  metric: {
    minWidth: "46%"
  },
  metricValue: {
    color: "#202124",
    fontSize: 15,
    fontWeight: "800"
  },
  sectionTitle: {
    color: "#202124",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 10
  },
  pointRow: {
    alignItems: "center",
    borderColor: "#ddd7ca",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 62,
    paddingVertical: 10
  },
  orderBubble: {
    alignItems: "center",
    backgroundColor: "#e9eef0",
    borderRadius: 15,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  orderBubbleDone: {
    backgroundColor: "#dff0e5"
  },
  orderText: {
    color: "#0f4f66",
    fontWeight: "900"
  },
  pointText: {
    flex: 1
  },
  pointTitle: {
    color: "#202124",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2
  },
  smallButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd7ca",
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 52
  },
  smallButtonText: {
    color: "#202124",
    fontWeight: "800"
  }
});
