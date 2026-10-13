import { LatLng, TourPoint } from "./types";

export function getTriggeredPoints(location: LatLng, points: TourPoint[], playedIds: Set<string>) {
  return points
    .filter((point) => !playedIds.has(point.id))
    .map((point) => ({ point, distance: distanceToNearestTrigger(location, point) }))
    .filter(({ point, distance }) => distance <= point.radiusMeters)
    .sort((a, b) => a.point.order - b.point.order || a.distance - b.distance)
    .map(({ point }) => point);
}

export function filterRelevantQueue(location: LatLng, queue: TourPoint[]) {
  return queue.filter((point) => distanceToNearestTrigger(location, point) <= point.staleAfterMeters);
}

export function findNextPoint(points: TourPoint[], playedIds: Set<string>) {
  return points.find((point) => !playedIds.has(point.id)) ?? null;
}

export function findNearestPoint(location: LatLng, points: TourPoint[], playedIds: Set<string>) {
  return (
    points
      .filter((point) => !playedIds.has(point.id))
      .map((point) => ({ point, distance: distanceToNearestTrigger(location, point) }))
      .sort((a, b) => a.distance - b.distance)[0] ?? null
  );
}

export function distanceToNearestTrigger(location: LatLng, point: TourPoint) {
  return Math.min(...point.triggerPoints.map((trigger) => distanceMeters(location, trigger)));
}

export function distanceMeters(a: LatLng, b: LatLng) {
  const targetLat = b.lat;
  const targetLng = b.lng;
  const earthRadiusMeters = 6371000;
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(targetLat);
  const dLat = toRadians(targetLat - a.lat);
  const dLng = toRadians(targetLng - a.lng);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}
