import { Route } from "./types";

// Trigger coordinates are snapped to the nearest drivable OSM/OSRM road point.
const narrationAudio: Record<string, number> = {
  "san-francisco-49-mile-drive": require("../assets/narration/san-francisco-49-mile-drive.mp3"),
  "ferry-building": require("../assets/narration/ferry-building.mp3"),
  "cable-cars": require("../assets/narration/cable-cars.mp3"),
  "moscone-center": require("../assets/narration/moscone-center.mp3"),
  "painted-ladies-homes": require("../assets/narration/painted-ladies-homes.mp3"),
  "union-square": require("../assets/narration/union-square.mp3"),
  "steep-hills": require("../assets/narration/steep-hills.mp3"),
  "chinatown-gate": require("../assets/narration/chinatown-gate.mp3"),
  "chinatown": require("../assets/narration/chinatown.mp3"),
  "transamerica-pyramid": require("../assets/narration/transamerica-pyramid.mp3"),
  "coit-tower": require("../assets/narration/coit-tower.mp3"),
  "filbert-steps": require("../assets/narration/filbert-steps.mp3"),
  "crooked-street": require("../assets/narration/crooked-street.mp3"),
  "alcatraz": require("../assets/narration/alcatraz.mp3"),
  "pier-39-sea-lions": require("../assets/narration/pier-39-sea-lions.mp3"),
  "ghirardelli-square": require("../assets/narration/ghirardelli-square.mp3"),
  "maritime-museum": require("../assets/narration/maritime-museum.mp3"),
  "golden-gate-bridge": require("../assets/narration/golden-gate-bridge.mp3"),
  "fort-mason": require("../assets/narration/fort-mason.mp3"),
  "palace-of-fine-arts": require("../assets/narration/palace-of-fine-arts.mp3"),
  "presidio-gate": require("../assets/narration/presidio-gate.mp3"),
  "old-post-hospital": require("../assets/narration/old-post-hospital.mp3"),
  "san-francisco-national-cemetery": require("../assets/narration/san-francisco-national-cemetery.mp3"),
  "crissy-field": require("../assets/narration/crissy-field.mp3"),
  "fort-point": require("../assets/narration/fort-point.mp3"),
  "baker-beach": require("../assets/narration/baker-beach.mp3"),
  "lands-end": require("../assets/narration/lands-end.mp3"),
  "lincoln-park-golf-club": require("../assets/narration/lincoln-park-golf-club.mp3"),
  "ocean-beach": require("../assets/narration/ocean-beach.mp3"),
  "twin-peaks": require("../assets/narration/twin-peaks.mp3"),
  "att-baseball-park": require("../assets/narration/att-baseball-park.mp3"),
  "oakland-bay-bridge": require("../assets/narration/oakland-bay-bridge.mp3"),
  "treasure-island": require("../assets/narration/treasure-island.mp3")
};

export const route: Route = {
  id: "san-francisco-49-mile-drive",
  name: "San Francisco 49 Mile Scenic Drive",
  cooldownMs: 4000,
  queueGapMs: 1200,
  points: [
    {
      id: "embarcadero-street",
      order: 1,
      title: "Embarcadero Street",
      landmarkLat: 37.782731,
      landmarkLng: -122.40034,
      triggerPoints: [
        { lat: 37.7827285, lng: -122.4003376 },
        { lat: 37.7824448, lng: -122.4001226 },
        { lat: 37.7822308, lng: -122.399811 },
        { lat: 37.78201, lng: -122.4011571 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "The Embarcadero follows San Francisco's eastern waterfront. This stretch grew from a working port into a broad boulevard lined with piers, parks, and views across the Bay."
    },
    {
      id: "ferry-building",
      order: 2,
      title: "Ferry Building",
      landmarkLat: 37.795549,
      landmarkLng: -122.393475,
      triggerPoints: [
        { lat: 37.7952638, lng: -122.393925 },
        { lat: 37.7946954, lng: -122.3927318 },
        { lat: 37.7958212, lng: -122.3947449 },
        { lat: 37.7944415, lng: -122.3935149 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "The Ferry Building opened in 1898 and was once the arrival point for most travelers coming into San Francisco by water. Its clock tower remains one of the city's signature waterfront landmarks."
    },
    {
      id: "cable-cars",
      order: 3,
      title: "Cable Cars",
      landmarkLat: 37.792325,
      landmarkLng: -122.40922,
      triggerPoints: [
        { lat: 37.7923032, lng: -122.4092024 },
        { lat: 37.7923803, lng: -122.4093425 },
        { lat: 37.7920496, lng: -122.4091888 },
        { lat: 37.793082, lng: -122.4085503 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "San Francisco's cable cars began running in 1873. Their underground cables still pull cars up and down the city's steep streets, making this one of the world's most recognizable transit systems."
    },
    {
      id: "moscone-center",
      order: 4,
      title: "Moscone Center",
      landmarkLat: 37.784712,
      landmarkLng: -122.400311,
      triggerPoints: [
        { lat: 37.7847644, lng: -122.400165 },
        { lat: 37.7849779, lng: -122.4005313 },
        { lat: 37.7844941, lng: -122.3991324 },
        { lat: 37.784966, lng: -122.3990255 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Moscone Center is San Francisco's largest convention complex. Its halls host technology conferences, cultural events, trade shows, and major gatherings throughout the year.",
      audioSource: require("../assets/narration/moscone-center.mp3")
    },
    {
      id: "painted-ladies-homes",
      order: 5,
      title: "Painted Ladies Homes",
      landmarkLat: 37.776224,
      landmarkLng: -122.432786,
      triggerPoints: [
        { lat: 37.7763097, lng: -122.4313096 },
        { lat: 37.7767854, lng: -122.4313327 },
        { lat: 37.7758429, lng: -122.4312182 },
        { lat: 37.7776024, lng: -122.4324155 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "These Victorian homes near Alamo Square are known as the Painted Ladies. Their colorful facades show the ornate residential style that survived the 1906 earthquake and fire.",
      audioSource: require("../assets/narration/painted-ladies-homes.mp3")
    },
    {
      id: "union-square",
      order: 6,
      title: "Union Square",
      landmarkLat: 37.787936,
      landmarkLng: -122.407517,
      triggerPoints: [
        { lat: 37.7876034, lng: -122.4073674 },
        { lat: 37.7875823, lng: -122.4075352 },
        { lat: 37.7874709, lng: -122.4074988 },
        { lat: 37.7883876, lng: -122.4076871 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "Union Square is the city's central shopping and hotel district. The plaza was named for pro-Union demonstrations held here during the Civil War."
    },
    {
      id: "steep-hills",
      order: 7,
      title: "Steep Hills",
      landmarkLat: 37.791128,
      landmarkLng: -122.417515,
      triggerPoints: [
        { lat: 37.7907559, lng: -122.4174072 },
        { lat: 37.7906615, lng: -122.4175787 },
        { lat: 37.790896, lng: -122.418234 },
        { lat: 37.7905237, lng: -122.4173157 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "San Francisco's hills are part of the city's character and its engineering challenge. Streets here climb sharply from the waterfront toward Nob Hill and Russian Hill."
    },
    {
      id: "chinatown-gate",
      order: 8,
      title: "Chinatown Gate",
      landmarkLat: 37.790688,
      landmarkLng: -122.405594,
      triggerPoints: [
        { lat: 37.790813, lng: -122.4056291 },
        { lat: 37.7905244, lng: -122.4059561 },
        { lat: 37.7915238, lng: -122.4056097 },
        { lat: 37.7896708, lng: -122.4051535 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "The Dragon Gate on Grant Avenue marks the southern entrance to San Francisco's Chinatown. It was dedicated in 1970 and has become one of the neighborhood's best-known symbols."
    },
    {
      id: "chinatown",
      order: 9,
      title: "Chinatown",
      landmarkLat: 37.794301,
      landmarkLng: -122.406376,
      triggerPoints: [
        { lat: 37.7940934, lng: -122.4062825 },
        { lat: 37.7943151, lng: -122.4059332 },
        { lat: 37.7942015, lng: -122.4068411 },
        { lat: 37.7947862, lng: -122.4057808 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "San Francisco's Chinatown was established in the 1850s and became the oldest Chinatown in North America. Grant Avenue is its most recognizable commercial street, filled with shops, restaurants, and historic buildings."
    },
    {
      id: "transamerica-pyramid",
      order: 10,
      title: "Transamerica Pyramid",
      landmarkLat: 37.795188,
      landmarkLng: -122.40279,
      triggerPoints: [
        { lat: 37.7952997, lng: -122.4032802 },
        { lat: 37.7956116, lng: -122.4026854 },
        { lat: 37.7947378, lng: -122.4027018 },
        { lat: 37.7956461, lng: -122.4034725 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "The Transamerica Pyramid was completed in 1972 and quickly became a defining part of San Francisco's skyline. Its tapered form was designed to let light reach the streets below."
    },
    {
      id: "coit-tower",
      order: 11,
      title: "Coit Tower",
      landmarkLat: 37.802379,
      landmarkLng: -122.405834,
      triggerPoints: [
        { lat: 37.8026914, lng: -122.4057931 },
        { lat: 37.8026617, lng: -122.4068225 },
        { lat: 37.8028465, lng: -122.404858 },
        { lat: 37.8012655, lng: -122.4064523 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Coit Tower was completed in 1933 on Telegraph Hill. It was funded by Lillie Hitchcock Coit, a patron of the city's firefighters, and its interior contains murals from the New Deal era."
    },
    {
      id: "filbert-steps",
      order: 12,
      title: "Filbert Steps",
      landmarkLat: 37.802357,
      landmarkLng: -122.40292,
      triggerPoints: [
        { lat: 37.8021671, lng: -122.4031562 },
        { lat: 37.803079, lng: -122.4033767 },
        { lat: 37.8031888, lng: -122.4031918 },
        { lat: 37.8029473, lng: -122.4019287 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "The Filbert Steps climb Telegraph Hill through gardens and narrow lanes. They are a reminder that some of San Francisco's most direct routes are stairways rather than streets."
    },
    {
      id: "crooked-street",
      order: 13,
      title: "Crooked Street",
      landmarkLat: 37.80197,
      landmarkLng: -122.419601,
      triggerPoints: [
        { lat: 37.8019628, lng: -122.419924 },
        { lat: 37.802024, lng: -122.4188755 },
        { lat: 37.8024715, lng: -122.4189818 },
        { lat: 37.8010653, lng: -122.4194828 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "The famous Lombard Street block between Hyde and Leavenworth has eight sharp hairpin turns. The curves were added in the 1920s to make the steep grade safer for cars."
    },
    {
      id: "alcatraz",
      order: 14,
      title: "Alcatraz",
      landmarkLat: 37.807901,
      landmarkLng: -122.404588,
      triggerPoints: [
        { lat: 37.8067603, lng: -122.4057765 },
        { lat: 37.8066581, lng: -122.4057955 },
        { lat: 37.8074419, lng: -122.4073801 },
        { lat: 37.8071159, lng: -122.4072949 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Alcatraz Island served as a military fort, a military prison, and a federal penitentiary. Its most famous prison closed in 1963, and the island is now managed as a national historic landmark."
    },
    {
      id: "pier-39-sea-lions",
      order: 15,
      title: "Pier 39 Sea Lions",
      landmarkLat: 37.809846,
      landmarkLng: -122.410349,
      triggerPoints: [
        { lat: 37.8083353, lng: -122.4100112 },
        { lat: 37.808382, lng: -122.4112132 },
        { lat: 37.8080956, lng: -122.4096862 },
        { lat: 37.8085936, lng: -122.4125774 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "California sea lions began gathering at Pier 39 in large numbers after the 1989 Loma Prieta earthquake. They now occupy the docks as one of the waterfront's most popular sights."
    },
    {
      id: "ghirardelli-square",
      order: 16,
      title: "Ghirardelli Square",
      landmarkLat: 37.805871,
      landmarkLng: -122.422949,
      triggerPoints: [
        { lat: 37.8063046, lng: -122.4229568 },
        { lat: 37.8063789, lng: -122.4227534 },
        { lat: 37.8054394, lng: -122.4225171 },
        { lat: 37.8059784, lng: -122.4221321 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Ghirardelli Square occupies the former site of the Ghirardelli chocolate factory. The industrial complex was preserved and transformed into shops, restaurants, and public space in the 1960s."
    },
    {
      id: "maritime-museum",
      order: 17,
      title: "Maritime Museum",
      landmarkLat: 37.810468,
      landmarkLng: -122.42477,
      triggerPoints: [
        { lat: 37.8080856, lng: -122.4267247 },
        { lat: 37.8081107, lng: -122.4269686 },
        { lat: 37.8077884, lng: -122.4265314 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "The San Francisco Maritime Museum preserves the city's waterfront history through historic ships, exhibits, and stories of Pacific trade. Aquatic Park sits directly beside it."
    },
    {
      id: "golden-gate-bridge",
      order: 18,
      title: "Golden Gate Bridge",
      landmarkLat: 37.817616,
      landmarkLng: -122.478312,
      triggerPoints: [
        { lat: 37.8200892, lng: -122.4786133 },
        { lat: 37.81762, lng: -122.478263 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "The Golden Gate Bridge opened in 1937 after four years of construction. Its suspension span connected San Francisco with Marin County and became an enduring symbol of the Bay Area."
    },
    {
      id: "fort-mason",
      order: 19,
      title: "Fort Mason",
      landmarkLat: 37.806281,
      landmarkLng: -122.428988,
      triggerPoints: [
        { lat: 37.8056155, lng: -122.428631 },
        { lat: 37.8057326, lng: -122.4282387 },
        { lat: 37.8071155, lng: -122.4285447 },
        { lat: 37.8062659, lng: -122.4277403 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Fort Mason was a military harbor post and a major embarkation point during the twentieth century. Today its former buildings host arts organizations, events, and public waterfront spaces."
    },
    {
      id: "palace-of-fine-arts",
      order: 20,
      title: "Palace of Fine Arts",
      landmarkLat: 37.802919,
      landmarkLng: -122.448403,
      triggerPoints: [
        { lat: 37.8021881, lng: -122.4490106 },
        { lat: 37.8028653, lng: -122.4497887 },
        { lat: 37.8023869, lng: -122.4497673 },
        { lat: 37.8025454, lng: -122.4467794 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "The Palace of Fine Arts was built for the 1915 Panama-Pacific International Exposition. Its classical rotunda and lagoon were preserved after the fair and remain among San Francisco's most photographed places."
    },
    {
      id: "presidio-gate",
      order: 21,
      title: "Presidio Gate",
      landmarkLat: 37.798781,
      landmarkLng: -122.447074,
      triggerPoints: [
        { lat: 37.7989302, lng: -122.4474177 },
        { lat: 37.7984792, lng: -122.4467681 },
        { lat: 37.7985946, lng: -122.4463065 },
        { lat: 37.7994639, lng: -122.4469313 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "The Presidio began as a Spanish military post in 1776 and later became a United States Army base. It is now part of the Golden Gate National Recreation Area."
    },
    {
      id: "old-post-hospital",
      order: 22,
      title: "Old Post Hospital",
      landmarkLat: 37.7991,
      landmarkLng: -122.447,
      triggerPoints: [
        { lat: 37.7994639, lng: -122.4469313 },
        { lat: 37.7989302, lng: -122.4474177 },
        { lat: 37.7994302, lng: -122.4461697 },
        { lat: 37.7985946, lng: -122.4463065 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "The Old Post Hospital represents the Presidio's long military history. The post's medical buildings served soldiers and families before the former base became a national park."
    },
    {
      id: "san-francisco-national-cemetery",
      order: 23,
      title: "San Francisco National Cemetery",
      landmarkLat: 37.7987,
      landmarkLng: -122.4541,
      triggerPoints: [
        { lat: 37.7986323, lng: -122.4545122 },
        { lat: 37.7990177, lng: -122.4547502 },
        { lat: 37.7993858, lng: -122.452714 },
        { lat: 37.7974999, lng: -122.4529041 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "The San Francisco National Cemetery occupies a quiet ridge within the Presidio. It contains the graves of service members and veterans from conflicts reaching back to the nineteenth century."
    },
    {
      id: "crissy-field",
      order: 24,
      title: "Crissy Field",
      landmarkLat: 37.8038,
      landmarkLng: -122.465,
      triggerPoints: [
        { lat: 37.8032625, lng: -122.4651853 },
        { lat: 37.8032874, lng: -122.4646207 },
        { lat: 37.8024171, lng: -122.4661422 },
        { lat: 37.8029384, lng: -122.4672966 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Crissy Field was once a military airfield and later a polluted industrial site. It was restored as a shoreline park with wetlands, trails, and broad views of the Golden Gate Bridge."
    },
    {
      id: "fort-point",
      order: 25,
      title: "Fort Point",
      landmarkLat: 37.8108,
      landmarkLng: -122.476,
      triggerPoints: [
        { lat: 37.8105883, lng: -122.4765805 },
        { lat: 37.8102808, lng: -122.476489 },
        { lat: 37.8102808, lng: -122.476581 },
        { lat: 37.8093946, lng: -122.4741908 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Fort Point is a Civil War-era masonry fort built to defend the Golden Gate. It sits beneath the bridge and is one of the few surviving structures of its type on the Pacific coast."
    },
    {
      id: "baker-beach",
      order: 26,
      title: "Baker Beach",
      landmarkLat: 37.7936,
      landmarkLng: -122.483,
      triggerPoints: [
        { lat: 37.7931478, lng: -122.4830296 },
        { lat: 37.7927171, lng: -122.4831137 },
        { lat: 37.7928789, lng: -122.4808632 },
        { lat: 37.792047, lng: -122.481412 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Baker Beach stretches along the Pacific side of the Presidio. On clear days it offers one of the most dramatic ground-level views back toward the Golden Gate Bridge."
    },
    {
      id: "lands-end",
      order: 27,
      title: "Lands End",
      landmarkLat: 37.7804,
      landmarkLng: -122.511,
      triggerPoints: [
        { lat: 37.780395, lng: -122.5111378 },
        { lat: 37.7802679, lng: -122.5111589 },
        { lat: 37.7797581, lng: -122.5106466 },
        { lat: 37.7806997, lng: -122.5099179 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Lands End is the rocky western edge of San Francisco, where coastal trails overlook the Pacific and the Golden Gate. The shoreline is also known for shipwrecks hidden below the surf."
    },
    {
      id: "lincoln-park-golf-club",
      order: 28,
      title: "Lincoln Park Golf Club",
      landmarkLat: 37.7862,
      landmarkLng: -122.4995,
      triggerPoints: [
        { lat: 37.7860394, lng: -122.4985816 },
        { lat: 37.7853628, lng: -122.4995799 },
        { lat: 37.7855556, lng: -122.5002204 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Lincoln Park Golf Club sits on the western edge of the city above the Pacific. The surrounding parkland was once part of the larger Lincoln Park cemetery and now connects to coastal overlooks."
    },
    {
      id: "ocean-beach",
      order: 29,
      title: "Ocean Beach",
      landmarkLat: 37.7695,
      landmarkLng: -122.5108,
      triggerPoints: [
        { lat: 37.7694707, lng: -122.5108897 },
        { lat: 37.7694041, lng: -122.5104483 },
        { lat: 37.7698913, lng: -122.5108865 },
        { lat: 37.769957, lng: -122.5106796 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "Ocean Beach is San Francisco's long open shoreline on the Pacific. Strong surf, fog, and wind give the beach a very different character from the protected waters of the Bay."
    },
    {
      id: "twin-peaks",
      order: 30,
      title: "Twin Peaks",
      landmarkLat: 37.7544,
      landmarkLng: -122.4477,
      triggerPoints: [
        { lat: 37.7541106, lng: -122.4472171 },
        { lat: 37.7543261, lng: -122.4469615 },
        { lat: 37.755068, lng: -122.4490859 },
        { lat: 37.7525099, lng: -122.4480214 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "Twin Peaks rises near the geographic center of San Francisco. From the summit, the city unfolds between the Pacific Ocean, the Bay, downtown, and the surrounding hills."
    },
    {
      id: "att-baseball-park",
      order: 31,
      title: "AT&T Baseball Park",
      landmarkLat: 37.7786,
      landmarkLng: -122.3893,
      triggerPoints: [
        { lat: 37.7794887, lng: -122.3886876 },
        { lat: 37.7795649, lng: -122.3897301 },
        { lat: 37.7773068, lng: -122.3907827 },
        { lat: 37.7773739, lng: -122.3913348 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "right",
      text: "AT&T Baseball Park, now known as Oracle Park, opened in 2000 on the San Francisco waterfront. Its right-field wall and views across McCovey Cove make it one of baseball's distinctive stadiums."
    },
    {
      id: "oakland-bay-bridge",
      order: 32,
      title: "Oakland Bay Bridge",
      landmarkLat: 37.795,
      landmarkLng: -122.387,
      triggerPoints: [
        { lat: 37.792778, lng: -122.383677 },
        { lat: 37.7971409, lng: -122.379011 },
        { lat: 37.7972681, lng: -122.378816 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "The San Francisco-Oakland Bay Bridge opened in 1936, one year before the Golden Gate Bridge. Its eastern span was rebuilt after the 1989 earthquake and now carries traffic between the two cities."
    },
    {
      id: "treasure-island",
      order: 33,
      title: "Treasure Island",
      landmarkLat: 37.823,
      landmarkLng: -122.37,
      triggerPoints: [
        { lat: 37.8233957, lng: -122.3690656 },
        { lat: 37.8235719, lng: -122.3688612 },
        { lat: 37.8225635, lng: -122.3685646 },
        { lat: 37.8235231, lng: -122.372255 }
      ],
      radiusMeters: 400,
      staleAfterMeters: 800,
      side: "ahead",
      text: "Treasure Island was created for the 1939 Golden Gate International Exposition. The island's planned streets and Art Deco buildings remain between San Francisco and the eastern span of the Bay Bridge."
    }
  ]
};

route.points.forEach((point) => {
  point.audioSource = narrationAudio[point.id];
});
