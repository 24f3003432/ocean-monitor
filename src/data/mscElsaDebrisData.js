// MSC ELSA 3 Incident Dataset & AI/ML Marine Plastic Debris Detections
// Case Study: Liberian-flagged container ship listed on 24 May 2025, sank on 25 May 2025, ~13 NM off Kochi/Kerala
// Nurdles & plastic debris dispersion corridor: Kochi -> Alappuzha -> Kollam -> Vizhinjam -> Kanyakumari -> Dhanushkodi/Rameswaram

export const INCIDENT_METADATA = {
  vesselName: "MSC ELSA 3",
  flag: "Liberian",
  dateOfDistress: "2025-05-24",
  dateOfSinking: "2025-05-25",
  incidentLocation: {
    lat: 9.8724,
    lng: 76.0152,
    description: "Arabian Sea, ~13 Nautical Miles off Kochi Port, Kerala",
  },
  cargoLost: "Containers carrying plastic resin pellets (nurdles), polymer raw materials & manufactured plastics",
  impactZones: ["Kerala Coast (Ernakulam, Alappuzha, Kollam, Thiruvananthapuram)", "Kanyakumari (Tamil Nadu)", "Gulf of Mannar", "Dhanushkodi / Rameswaram"],
  coordinatingAgencies: ["INCOIS (Indian National Centre for Ocean Information Services)", "Indian Coast Guard (ICG)", "Kerala State Pollution Control Board", "State Disaster Management Authority"]
};

// Debris classifications
export const DEBRIS_TYPES = {
  NURDLE: {
    id: "nurdle",
    label: "Plastic Resin Pellets (Nurdles)",
    color: "#f59e0b",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    description: "Raw lentil-sized pre-production plastic granules, buoyant and easily ingested by marine life."
  },
  CONTAINER_MACRO: {
    id: "container",
    label: "Macroplastic / Container Shards",
    color: "#ef4444",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
    description: "Fractured high-density polymer packaging and large buoyant structural container contents."
  },
  SHEET_FILM: {
    id: "sheet",
    label: "Polymer Sheeting & Wrapping",
    color: "#ec4899",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    description: "Low-density polyethylene (LDPE) packaging films forming floating surface slicks."
  },
  NETS_ROPES: {
    id: "gear",
    label: "Synthetic Strapping & Ghost Gear",
    color: "#a855f7",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    description: "Polypropylene cargo securing straps, synthetic netting and bundling lines."
  }
};

// AI/ML Detections across the Kerala-Tamil Nadu drift corridor
export const DEBRIS_DETECTIONS = [
  {
    id: "DET-2025-001",
    name: "Primary Sinking Slick - MSC ELSA 3 Epicenter",
    coordinates: [9.8724, 76.0152],
    debrisType: "container",
    confidence: 0.96,
    area_sqm: 142000,
    estimatedWeightTons: 64.5,
    densityIndex: "Extremely High (850 pellets/m²)",
    priority: "CRITICAL",
    cleanUpFeasibility: "Immediate Offshore Booming (Calm Window)",
    detectedBy: "Sentinel-2 MSI + Sentinel-1 SAR Dual-Pol (AI Ensemble CNN)",
    spectralIndices: {
      fdi: 0.048,      // Floating Debris Index (Biermann et al.)
      ndpi: 0.38,     // Normalised Difference Plastic Index
      ndvi_offset: -0.15,
      sar_backscatter_anomaly: "+4.8 dB"
    },
    detectionDate: "2025-05-25 06:14 UTC",
    driftSpeedKnots: 1.4,
    driftBearingDeg: 165,
    distanceOffshoreNm: 13.0,
    shorelineRisk: "High within 48h to Chellanam/Alappuzha beaches",
    notes: "Active dispersion zone from submerged hull. Dense cluster of buoyant packaging and bursting container sacks."
  },
  {
    id: "DET-2025-002",
    name: "Chellanam-Mararikulam Nearshore Pellet Slick",
    coordinates: [9.6840, 76.2210],
    debrisType: "nurdle",
    confidence: 0.93,
    area_sqm: 98000,
    estimatedWeightTons: 28.2,
    densityIndex: "High (520 pellets/m²)",
    priority: "HIGH",
    cleanUpFeasibility: "Surf-Zone Skimmers & Beach Mesh Sieves",
    detectedBy: "Sentinel-2 Multi-Spectral (NIR/SWIR Plastic ResNet)",
    spectralIndices: {
      fdi: 0.042,
      ndpi: 0.34,
      ndvi_offset: -0.12,
      sar_backscatter_anomaly: "+3.2 dB"
    },
    detectionDate: "2025-05-27 10:45 UTC",
    driftSpeedKnots: 1.1,
    driftBearingDeg: 155,
    distanceOffshoreNm: 4.8,
    shorelineRisk: "Imminent landfall on Mararikulam beach",
    notes: "South-south-eastward drift caused by West India Coastal Current (WICC). Significant nurdle wash-up reported by local fishermen."
  },
  {
    id: "DET-2025-003",
    name: "Alappuzha Offshore Swarm",
    coordinates: [9.4520, 76.2580],
    debrisType: "nurdle",
    confidence: 0.89,
    area_sqm: 115000,
    estimatedWeightTons: 34.0,
    densityIndex: "High (430 pellets/m²)",
    priority: "HIGH",
    cleanUpFeasibility: "Towed High-Speed Neuston Sweeps",
    detectedBy: "PlanetScope SuperDove + Sentinel-2 Fusion",
    spectralIndices: {
      fdi: 0.038,
      ndpi: 0.31,
      ndvi_offset: -0.09,
      sar_backscatter_anomaly: "+2.9 dB"
    },
    detectionDate: "2025-05-29 07:20 UTC",
    driftSpeedKnots: 1.2,
    driftBearingDeg: 150,
    distanceOffshoreNm: 6.2,
    shorelineRisk: "Moderate to Alappuzha Port & Thottappally Spillway",
    notes: "Spreading elongated plume 4.2 km along current shear line."
  },
  {
    id: "DET-2025-004",
    name: "Kollam / Neendakara Estuarine Front",
    coordinates: [8.9350, 76.4820],
    debrisType: "sheet",
    confidence: 0.87,
    area_sqm: 67000,
    estimatedWeightTons: 14.8,
    densityIndex: "Moderate (280 pellets/m² + polymer film)",
    priority: "HIGH",
    cleanUpFeasibility: "Estuary Entrance Boom Barrier",
    detectedBy: "Sentinel-2 MSI",
    spectralIndices: {
      fdi: 0.035,
      ndpi: 0.29,
      ndvi_offset: -0.08,
      sar_backscatter_anomaly: "+2.1 dB"
    },
    detectionDate: "2025-05-31 11:15 UTC",
    driftSpeedKnots: 0.9,
    driftBearingDeg: 145,
    distanceOffshoreNm: 3.5,
    shorelineRisk: "High risk of entering Ashtamudi Lake Ramsar site",
    notes: "High environmental sensitivity zone. Deployment of floating booms urged at Neendakara fishing harbor inlet."
  },
  {
    id: "DET-2025-005",
    name: "Vizhinjam Transshipment Approach Slick",
    coordinates: [8.3620, 76.9240],
    debrisType: "container",
    confidence: 0.91,
    area_sqm: 82000,
    estimatedWeightTons: 39.5,
    densityIndex: "Very High (Polymer sheets & damaged containers)",
    priority: "CRITICAL",
    cleanUpFeasibility: "Vessel-assisted crane recovery + surface skimming",
    detectedBy: "Sentinel-1 SAR C-Band + Sentinel-2",
    spectralIndices: {
      fdi: 0.046,
      ndpi: 0.36,
      ndvi_offset: -0.14,
      sar_backscatter_anomaly: "+5.1 dB"
    },
    detectionDate: "2025-06-02 08:30 UTC",
    driftSpeedKnots: 1.3,
    driftBearingDeg: 140,
    distanceOffshoreNm: 5.8,
    shorelineRisk: "Threat to shipping channels & Vizhinjam international port berths",
    notes: "Submerged container fragments creating navigational hazard in port approaches."
  },
  {
    id: "DET-2025-006",
    name: "Kanyakumari / Cape Comorin Convergence Zone",
    coordinates: [8.0410, 77.5840],
    debrisType: "nurdle",
    confidence: 0.94,
    area_sqm: 210000,
    estimatedWeightTons: 52.0,
    densityIndex: "Extremely Dense Accumulation (920 pellets/m²)",
    priority: "CRITICAL",
    cleanUpFeasibility: "Coastal Volunteer Sweepers & Mechanical Beach Vacuum",
    detectedBy: "Sentinel-2 MSI + Landsat 9 OLI-2 Hybrid",
    spectralIndices: {
      fdi: 0.052,
      ndpi: 0.41,
      ndvi_offset: -0.18,
      sar_backscatter_anomaly: "+3.9 dB"
    },
    detectionDate: "2025-06-06 06:50 UTC",
    driftSpeedKnots: 1.6,
    driftBearingDeg: 85,
    distanceOffshoreNm: 2.1,
    shorelineRisk: "Critical shoreline contamination along Sunset Point & Vivekanand Rock",
    notes: "Tri-sea hydrodynamic convergence (Arabian Sea, Bay of Bengal, Indian Ocean) concentrating buoyant debris into thick windrows."
  },
  {
    id: "DET-2025-007",
    name: "Gulf of Mannar Biosphere Reserve Boundary",
    coordinates: [8.8120, 78.4350],
    debrisType: "nurdle",
    confidence: 0.84,
    area_sqm: 88000,
    estimatedWeightTons: 19.4,
    densityIndex: "Moderate to High (340 pellets/m²)",
    priority: "CRITICAL",
    cleanUpFeasibility: "Eco-sensitive manual shoreline sieving (prevent coral damage)",
    detectedBy: "Sentinel-2 MSI Water Quality Processing",
    spectralIndices: {
      fdi: 0.033,
      ndpi: 0.27,
      ndvi_offset: -0.06,
      sar_backscatter_anomaly: "+2.0 dB"
    },
    detectionDate: "2025-06-11 12:10 UTC",
    driftSpeedKnots: 1.0,
    driftBearingDeg: 60,
    distanceOffshoreNm: 7.4,
    shorelineRisk: "Direct hazard to dugong habitats and coral reef colonies",
    notes: "Debris rounding Cape Comorin driven by Southwest Monsoon currents heading into Palk Strait."
  },
  {
    id: "DET-2025-008",
    name: "Dhanushkodi / Rameswaram Coast Accumulation Zone",
    coordinates: [9.1760, 79.4180],
    debrisType: "nurdle",
    confidence: 0.95,
    area_sqm: 165000,
    estimatedWeightTons: 38.6,
    densityIndex: "Very High (780 pellets/m²)",
    priority: "CRITICAL",
    cleanUpFeasibility: "Beach Trommel Cleaners & Rapid Response Teams",
    detectedBy: "Sentinel-2 FDI + UAV Aerial Drone Orthomosaic",
    spectralIndices: {
      fdi: 0.049,
      ndpi: 0.39,
      ndvi_offset: -0.16,
      sar_backscatter_anomaly: "+3.6 dB"
    },
    detectionDate: "2025-06-15 09:00 UTC",
    driftSpeedKnots: 0.7,
    driftBearingDeg: 45,
    distanceOffshoreNm: 1.2,
    shorelineRisk: "Severe shoreline deposition across Dhanushkodi sandspit",
    notes: "Nurdles washed ashore over 18 km stretch of sand spit as predicted by INCOIS SARAT trajectory model."
  },
  {
    id: "DET-2025-009",
    name: "Offshore Kochi Container Rigging Cluster",
    coordinates: [9.9620, 75.8920],
    debrisType: "gear",
    confidence: 0.81,
    area_sqm: 45000,
    estimatedWeightTons: 11.2,
    densityIndex: "Medium (Nets, ropes, tarpaulins)",
    priority: "MEDIUM",
    cleanUpFeasibility: "Coast Guard Cutter Grapple Retrieval",
    detectedBy: "Sentinel-1 SAR C-Band",
    spectralIndices: {
      fdi: 0.026,
      ndpi: 0.21,
      ndvi_offset: -0.04,
      sar_backscatter_anomaly: "+4.1 dB"
    },
    detectionDate: "2025-05-26 14:00 UTC",
    driftSpeedKnots: 1.2,
    driftBearingDeg: 170,
    distanceOffshoreNm: 18.5,
    shorelineRisk: "Low (remaining in deep shipping lane)",
    notes: "Submerged rigging hazards to deep-sea trawlers."
  },
  {
    id: "DET-2025-010",
    name: "Varkala Cliff Outer Drift Patch",
    coordinates: [8.7180, 76.6210],
    debrisType: "sheet",
    confidence: 0.79,
    area_sqm: 38000,
    estimatedWeightTons: 8.5,
    densityIndex: "Medium (Film slicks)",
    priority: "MEDIUM",
    cleanUpFeasibility: "Towed skimmers",
    detectedBy: "Sentinel-2 MSI",
    spectralIndices: {
      fdi: 0.028,
      ndpi: 0.23,
      ndvi_offset: -0.05,
      sar_backscatter_anomaly: "+1.9 dB"
    },
    detectionDate: "2025-06-01 10:15 UTC",
    driftSpeedKnots: 1.0,
    driftBearingDeg: 145,
    distanceOffshoreNm: 6.8,
    shorelineRisk: "Low-Medium for tourist beaches",
    notes: "Dispersed packaging films mixed with natural flotsam and Sargassum patches."
  }
];

// INCOIS SARAT Drift Trajectory Simulation Milestones (Day 0 to Day 21)
export const INCOIS_DRIFT_TIMELINE = [
  {
    day: 0,
    date: "2025-05-25",
    label: "Day 0: Sinking Event",
    description: "MSC ELSA 3 sinks 13 NM off Kochi. Initial release of 28 containers carrying nurdles and polymers.",
    center: [9.8724, 76.0152],
    plumeSpreadRadiusM: 3500,
    currentSpeedMps: 0.75,
    windKnots: 18,
    activeDetections: ["DET-2025-001", "DET-2025-009"]
  },
  {
    day: 3,
    date: "2025-05-28",
    label: "Day 3: Chellanam & Mararikulam Impact",
    description: "Monsoon coastal current pushes buoyant pellets southward toward Alappuzha coastline.",
    center: [9.5840, 76.2210],
    plumeSpreadRadiusM: 12000,
    currentSpeedMps: 0.68,
    windKnots: 22,
    activeDetections: ["DET-2025-001", "DET-2025-002", "DET-2025-003"]
  },
  {
    day: 7,
    date: "2025-06-01",
    label: "Day 7: Kollam to Vizhinjam Corridor",
    description: "Plume elongates along 120 km of southwest Indian shelf. High alert at Ashtamudi estuary and Vizhinjam port.",
    center: [8.9350, 76.4820],
    plumeSpreadRadiusM: 28000,
    currentSpeedMps: 0.82,
    windKnots: 19,
    activeDetections: ["DET-2025-001", "DET-2025-002", "DET-2025-003", "DET-2025-004", "DET-2025-005", "DET-2025-010"]
  },
  {
    day: 12,
    date: "2025-06-06",
    label: "Day 12: Kanyakumari Convergence",
    description: "Debris reaches southern tip of Indian subcontinent. High turbulence traps nurdles in nearshore surf zone.",
    center: [8.0410, 77.5840],
    plumeSpreadRadiusM: 45000,
    currentSpeedMps: 0.95,
    windKnots: 24,
    activeDetections: ["DET-2025-004", "DET-2025-005", "DET-2025-006"]
  },
  {
    day: 21,
    date: "2025-06-15",
    label: "Day 21: Gulf of Mannar & Dhanushkodi Landfall",
    description: "Pellets enter eastern seaboard via Gulf of Mannar, causing major accumulation along Dhanushkodi sandbar.",
    center: [9.1760, 79.4180],
    plumeSpreadRadiusM: 65000,
    currentSpeedMps: 0.60,
    windKnots: 16,
    activeDetections: ["DET-2025-006", "DET-2025-007", "DET-2025-008"]
  }
];

// INCOIS Drift Trajectory Polyline (Vector coordinates along current pathway)
export const DRIFT_TRAJECTORY_COORDS = [
  [9.8724, 76.0152], // Sinking origin
  [9.6840, 76.1200],
  [9.4520, 76.2100], // Alappuzha
  [9.1500, 76.3500], // Kayamkulam
  [8.9350, 76.4820], // Kollam
  [8.7180, 76.6210], // Varkala
  [8.3620, 76.9240], // Vizhinjam
  [8.1800, 77.2000], // Poovar/Colachel
  [8.0410, 77.5840], // Kanyakumari
  [8.2500, 77.9500],
  [8.5500, 78.2000], // Tiruchendur
  [8.8120, 78.4350], // Gulf of Mannar Biosphere
  [9.0500, 78.9500], // Mandapam
  [9.1760, 79.4180]  // Dhanushkodi / Rameswaram
];

// Priority Clean-up Sectors
export const CLEANUP_SECTORS = [
  {
    sectorId: "SEC-A1",
    name: "Kochi-Alappuzha Containment Belt",
    priority: "CRITICAL",
    recommendedAction: "Deploy offshore containment booms & absorbent sweeps",
    vesselAssigned: "ICGS Samar (Indian Coast Guard)",
    estDebrisTons: 92.7,
    coordinates: [9.72, 76.10],
    radiusKm: 18
  },
  {
    sectorId: "SEC-B2",
    name: "Ashtamudi Estuary Defense Line (Neendakara)",
    priority: "HIGH",
    recommendedAction: "Tidal barrier nets at harbor mouth to shield inland backwaters",
    vesselAssigned: "Kerala Fisheries Patrol Fast Crafts",
    estDebrisTons: 14.8,
    coordinates: [8.94, 76.51],
    radiusKm: 10
  },
  {
    sectorId: "SEC-C1",
    name: "Kanyakumari Point Multi-Beach Collection",
    priority: "CRITICAL",
    recommendedAction: "Mechanical beach sand trommels + community nurdle patrols",
    vesselAssigned: "District Disaster Response Team (Tamil Nadu)",
    estDebrisTons: 52.0,
    coordinates: [8.06, 77.56],
    radiusKm: 14
  },
  {
    sectorId: "SEC-D3",
    name: "Gulf of Mannar Marine National Park Protection",
    priority: "CRITICAL",
    recommendedAction: "Low-impact non-invasive floating barriers around coral cays",
    vesselAssigned: "Forest Department Marine Patrol & ICGS Rani Abbakka",
    estDebrisTons: 38.6,
    coordinates: [9.15, 79.35],
    radiusKm: 22
  }
];
