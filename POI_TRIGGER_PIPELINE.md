# POI Trigger Pipeline

This is the reusable procedure for creating reliable drive-by POI triggers for a GPS audio tour.

## Core rule

The landmark coordinate is descriptive only. A trigger coordinate must be on a drivable street or a real road intersection. Never hand-offset a landmark coordinate, and never use a pedestrian path, plaza, park trail, parking aisle, or building center as a trigger.

The app uses a 400 meter activation radius. Keep candidate trigger points materially closer to the POI, normally within 150-250 meters, so coverage does not become unnecessarily broad.

## Candidate generation

1. Start with the authoritative ordered POI list and exact display names.
2. Resolve one approximate landmark coordinate per POI using OpenStreetMap geocoding or another documented source.
3. Query OpenStreetMap Overpass for nearby highway ways and their geometry, normally within 250-400 meters.
4. Keep car-capable roads: \`motorway\`, \`trunk\`, \`primary\`, \`secondary\`, \`tertiary\`, \`unclassified\`, \`residential\`, \`living_street\`, and appropriate \`service\` roads.
5. Exclude \`footway\`, \`path\`, \`pedestrian\`, \`steps\`, \`cycleway\`, \`bridleway\`, platforms, elevators, private roads, and other non-driving features.
6. Use OSM way geometry, not only way centers. An intersection is a candidate when drivable ways share an OSM node or meet at the same road junction.
7. Include roads bordering the landmark and major legitimate approaches. Do not select a distant road just because it maximizes distance.
8. Send each candidate through OSRM \`nearest\` using the \`driving\` profile. Retain the snapped coordinate only when OSRM accepts it as drivable.

## Selecting 3-4 triggers

Do not select the four nearest results; they often cluster on one road. Use constrained farthest-point selection:

1. Seed with the closest relevant drivable candidate or the most important bordering intersection.
2. Prefer candidates in different approach sectors around the POI.
3. Repeatedly select the candidate whose minimum distance from all selected candidates is greatest.
4. Require 75-100 meters minimum pairwise separation.
5. Keep candidates within 150-250 meters of the POI when possible.
6. Reject unrelated roads, motorway ramps, private/service access, and pedestrian access.
7. Stop at four candidates. If fewer than three meaningful candidates survive, use fewer and flag the POI for human review.

\`\`\`
candidates = osm_drivable_roads_and_intersections(poi)
candidates = osrm_nearest_driving(candidates)
candidates = filter(distance_to_poi <= max_candidate_distance)
candidates = filter(relevant_road_or_intersection)

selected = [closest_relevant_candidate(candidates)]
while selected.length < 4:
    next = candidate maximizing minimum_distance_to(selected)
    while also improving approach_sector_coverage
    if next.minimum_distance < minimum_separation:
        break
    selected.push(next)
\`\`\`

## Validation

Record the POI, stable ID, OSM way/node or intersection, road name, highway type, original candidate, OSRM snapped coordinate, distance from the landmark, bearing, and pairwise trigger spacing.

Reject a batch if any point is pedestrian-only, private, an unrelated ramp, clustered on one segment, or reachable only through an unrelated road. Review bridges, parks, waterfront piers, ramps, and historical features especially carefully.

Each app POI is one \`TourPoint\` with the exact source-list title, multiple roadway \`triggerPoints\`, \`radiusMeters: 400\`, and one stable ID shared by all alternate approaches. Entering any valid trigger announces the POI once.

The Union Square case is the reference example: surrounding street approaches are useful; four nearby samples from one road are not.
