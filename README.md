# AQUAGUARD AI: AI/ML-Based Detection and Mapping of Floating Marine Plastic Debris

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F24f3003432%2Focean-monitor)

## Problem Overview
Marine plastic pollution is a critical environmental challenge. Plastics released into the ocean disperse widely through winds, currents, and waves. 

### Real-World Case Study: The MSC ELSA 3 Incident
- **Vessel:** MSC ELSA 3 (Liberian-flagged container ship)
- **Distress Date:** 24 May 2025 (Severe starboard list)
- **Sinking Date:** 25 May 2025 (~13 Nautical Miles off Kerala)
- **Cargo Lost:** Containers carrying plastic resin pellets (**nurdles**), polymer raw materials, and manufactured plastics.
- **Corridor of Impact:** Dispersed along Kerala coast (Kochi, Alappuzha, Kollam, Vizhinjam) and southern Tamil Nadu coasts (Kanyakumari, Gulf of Mannar, Dhanushkodi/Rameswaram).
- **Trajectory Integration:** INCOIS SARAT and Oil/Nurdles Spill Trajectory modeling.

---

## Key Features

1. **AI/ML Multi-Sensor Plastic Detection:**
   - **Sentinel-2 MSI (10m Resolution):** Floating Debris Index (FDI), Normalized Difference Plastic Index (NDPI), and Red-Edge/NIR hydrocarbon spectral analysis.
   - **Sentinel-1 C-Band SAR:** Microwave capillary wave roughness suppression (-4.8 dB backscatter damping).
   - Multi-class detection: Plastic Resin Pellets (Nurdles), Macroplastic Shards, Polymer Film, and Synthetic Strapping.

2. **Interactive GIS Ocean Dashboard:**
   - Real-time GIS ocean map with 4 selectable basemaps (ESRI World Imagery Satellite, ESRI Ocean Bathymetry, CartoDB Tactical Dark, OSM).
   - Animated INCOIS SARAT drift vectors and ocean current flow arrows.
   - Day 0 to Day 21 interactive trajectory simulation timeline.

3. **Spot Satellite Imagery Inspector:**
   - Tap any spot or debris marker on the ocean map to inspect the exact classified Sentinel-2 MSI satellite chips.
   - 4 Evidence Modalities: **TrueColor (10m Optical)**, **FDI Heatmap**, **Spectral Curve (B2-B12)**, and **SAR Radar**.

4. **Clean-Up Priority Ranking & Field Action:**
   - Sector hazard ranking (`SEC-A1` Kochi Containment Belt, `SEC-B2` Ashtamudi Defense, `SEC-C1` Kanyakumari Convergence, `SEC-D3` Gulf of Mannar Biosphere).
   - One-click GeoJSON export for Indian Coast Guard (ICG) and INCOIS field vessels.

5. **Live Oceanographic API Integration:**
   - Real-time Arabian Sea wave height, swell period, surface wind, and Ekman drift current velocity via Open-Meteo Marine APIs.

---

## Getting Started

### Local Development
```bash
git clone https://github.com/24f3003432/ocean-monitor.git
cd ocean-monitor
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel
Click the button below or import the repository in [Vercel Dashboard](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F24f3003432%2Focean-monitor)
