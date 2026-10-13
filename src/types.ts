export type LatLng = {
  lat: number;
  lng: number;
  accuracy?: number | null;
};

export type TourPoint = {
  id: string;
  order: number;
  title: string;
  landmarkLat: number;
  landmarkLng: number;
  triggerPoints: LatLng[];
  radiusMeters: number;
  staleAfterMeters: number;
  side: "left" | "right" | "ahead";
  text: string;
  audioSource?: number;
};

export type Route = {
  id: string;
  name: string;
  cooldownMs: number;
  queueGapMs: number;
  points: TourPoint[];
};

export type RuntimeSnapshot = {
  location: LatLng | null;
  lastSpokenTitle?: string;
  queue: string[];
};
