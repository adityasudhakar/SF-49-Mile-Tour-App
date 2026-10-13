const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const roadsPath = process.argv[2] || "/private/tmp/sf-map-osm.json";
const boundaryPath = process.argv[3] || "/private/tmp/sf-boundary.geojson";
const outputPath = path.join(root, "docs", "route-map.svg");

if (!fs.existsSync(roadsPath) || !fs.existsSync(boundaryPath)) {
  console.error("Usage: node scripts/generate-route-map.js <overpass-roads.json> <sf-boundary.geojson>");
  process.exit(1);
}

const routeSource = fs.readFileSync(path.join(root, "src", "route.ts"), "utf8");
const pointPattern = /    \{\n      id: "([^"]+)",\n      order: (\d+),\n      title: "([^"]+)",\n      landmarkLat: ([\d.-]+),\n      landmarkLng: ([\d.-]+)/g;
const points = [...routeSource.matchAll(pointPattern)].map((match) => ({
  id: match[1],
  order: Number(match[2]),
  title: match[3],
  lat: Number(match[4]),
  lng: Number(match[5])
}));

if (points.length !== 33) {
  throw new Error(`Expected 33 route points, found ${points.length}`);
}

const roads = JSON.parse(fs.readFileSync(roadsPath, "utf8")).elements;
const boundary = JSON.parse(fs.readFileSync(boundaryPath, "utf8")).features[0].geometry;

const width = 1600;
const height = 1000;
const map = { x: 56, y: 146, width: 1050, height: 790 };
const bounds = { minLng: -122.53, maxLng: -122.35, minLat: 37.70, maxLat: 37.84 };

function project(lng, lat) {
  const x = map.x + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * map.width;
  const y = map.y + (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * map.height;
  return [x, y];
}

function pathFromCoordinates(coordinates, close = false) {
  const visible = coordinates.filter(([lng, lat]) =>
    lng >= bounds.minLng - 0.05 && lng <= bounds.maxLng + 0.05 &&
    lat >= bounds.minLat - 0.05 && lat <= bounds.maxLat + 0.05
  );
  if (visible.length < 2) return "";
  return visible.map(([lng, lat], index) => {
    const [x, y] = project(lng, lat);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + (close ? " Z" : "");
}

function polygonPaths(geometry) {
  const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  return polygons.flatMap((polygon) => polygon.map((ring) => pathFromCoordinates(ring, true))).filter(Boolean).join(" ");
}

const roadGroups = { motorway: [], trunk: [], primary: [], secondary: [], tertiary: [] };
for (const way of roads) {
  if (!way.geometry || !way.tags?.highway) continue;
  const kind = way.tags.highway;
  if (!roadGroups[kind]) continue;
  const coordinates = way.geometry.map(({ lon, lat }) => [lon, lat]);
  const roadPath = pathFromCoordinates(coordinates);
  if (roadPath) roadGroups[kind].push(roadPath);
}

const landPath = polygonPaths(boundary);
const routePath = points.map((point, index) => {
  const [x, y] = project(point.lng, point.lat);
  return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
}).join(" ");

const markerSvg = points.map((point) => {
  const [x, y] = project(point.lng, point.lat);
  return `<g class="marker"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}">${point.order}</text></g>`;
}).join("\n");

const legendSvg = points.map((point, index) => {
  const column = index < 17 ? 0 : 1;
  const row = column === 0 ? index : index - 17;
  const x = 1140 + column * 222;
  const y = 190 + row * 40;
  return `<g class="legend-item"><circle cx="${x}" cy="${y - 5}" r="11"/><text class="legend-number" x="${x}" y="${y - 1}">${point.order}</text><text x="${x + 18}" y="${y}">${escapeXml(point.title)}</text></g>`;
}).join("\n");

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">San Francisco 49-Mile GPS Audio Tour map</title>
  <desc id="desc">A map of San Francisco showing 33 narrated points of interest in tour order.</desc>
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#16383f" flood-opacity="0.18"/></filter>
    <clipPath id="map-clip"><rect x="${map.x}" y="${map.y}" width="${map.width}" height="${map.height}" rx="20"/></clipPath>
    <clipPath id="land-clip"><path d="${landPath}" fill-rule="evenodd"/></clipPath>
    <style>
      .road { fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .marker circle, .legend-item circle { fill: #e45d36; stroke: #fffaf0; stroke-width: 2; }
      .marker text, .legend-number { fill: white; font: 700 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-anchor: middle; }
      .legend-item > text:last-child { fill: #253638; font: 500 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .stat { fill: #244e58; font: 700 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    </style>
  </defs>
  <rect width="1600" height="1000" fill="#f6f0e4"/>
  <text x="56" y="61" fill="#173b44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="37" font-weight="800">San Francisco 49-Mile GPS Audio Tour</text>
  <text x="57" y="101" fill="#5c6c6d" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="19">33 location-aware stories · designed to run behind turn-by-turn navigation</text>
  <g transform="translate(1120 48)"><rect width="112" height="46" rx="23" fill="#d9e9e5"/><text class="stat" x="56" y="29" text-anchor="middle">33 STOPS</text></g>
  <g transform="translate(1244 48)"><rect width="139" height="46" rx="23" fill="#f1d9c9"/><text class="stat" x="69.5" y="29" text-anchor="middle">OFFLINE AUDIO</text></g>
  <g transform="translate(1395 48)"><rect width="149" height="46" rx="23" fill="#dbe7ef"/><text class="stat" x="74.5" y="29" text-anchor="middle">BACKGROUND GPS</text></g>
  <g filter="url(#shadow)"><rect x="${map.x}" y="${map.y}" width="${map.width}" height="${map.height}" rx="20" fill="#bcdde2"/></g>
  <g clip-path="url(#map-clip)">
    <g clip-path="url(#land-clip)">
      <path d="${landPath}" fill="#fbf8ef" fill-rule="evenodd"/>
      <path class="road" d="${roadGroups.tertiary.join(" ")}" stroke="#ddd8cd" stroke-width="1.4"/>
      <path class="road" d="${roadGroups.secondary.join(" ")}" stroke="#cec8bc" stroke-width="2"/>
      <path class="road" d="${roadGroups.primary.join(" ")}" stroke="#b8aea0" stroke-width="2.7"/>
      <path class="road" d="${roadGroups.trunk.join(" ")}" stroke="#89a5a4" stroke-width="3.5"/>
      <path class="road" d="${roadGroups.motorway.join(" ")}" stroke="#5f8586" stroke-width="4.2"/>
      <path d="${routePath}" fill="none" stroke="#e45d36" stroke-width="4" stroke-dasharray="8 8" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"/>
      ${markerSvg}
    </g>
  </g>
  <rect x="${map.x}" y="${map.y}" width="${map.width}" height="${map.height}" rx="20" fill="none" stroke="#a9cbc9" stroke-width="2"/>
  <text x="1140" y="151" fill="#173b44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" font-weight="800">NARRATED STOPS</text>
  ${legendSvg}
  <text x="57" y="970" fill="#5c6c6d" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13">Illustrative POI sequence; navigation remains route-independent. Map data © OpenStreetMap contributors, ODbL.</text>
</svg>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, svg);
console.log(`Wrote ${outputPath} (${Math.round(Buffer.byteLength(svg) / 1024)} KB)`);
