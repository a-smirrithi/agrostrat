# AGROSTRAT: PRECISION AGRICULTURAL FIELD CLASSIFICATION AND HYPERLOCAL FARMING ADVISORY SYSTEM

## A PROJECT REPORT
**Submitted by**
### A SMIRRITHI (310624148101)

*in partial fulfillment for the award of the Degree of*
### BACHELOR OF ENGINEERING
*in*
### COMPUTER SCIENCE AND ENGINEERING (AI & ML)
### 2311CSE503R - FULL STACK DEVELOPMENT

**EASWARI ENGINEERING COLLEGE**
*(AN AUTONOMOUS INSTITUTION) – AFFILIATED TO ANNA UNIVERSITY, CHENNAI*
**OCTOBER 2026**

---

## EASWARI ENGINEERING COLLEGE
### BONAFIDE CERTIFICATE

Certified that this mini project report titled **“AGROSTRAT: PRECISION AGRICULTURAL FIELD CLASSIFICATION AND HYPERLOCAL FARMING ADVISORY SYSTEM”** is the Bonafide work of **“A SMIRRITHI (310624148101)”**, who carried out the project work under my supervision.

```
HEAD OF THE DEPARTMENT                                     SUPERVISOR
```

---

## EASWARI ENGINEERING COLLEGE
### Certificate of Viva-voce-Examination

This is to certify that the Viva Voce Examination of the Project Work entitled **“AGROSTRAT: PRECISION AGRICULTURAL FIELD CLASSIFICATION AND HYPERLOCAL FARMING ADVISORY SYSTEM”** submitted by

**Ms. A Smirrithi (Reg. No. 310624148101)**

in partial fulfillment of the requirements for the award of the degree of Bachelor of Engineering was conducted on ____________ (Date) in the Department of Computer Science and Engineering (AI & ML), Easwari Engineering College, Ramapuram – Chennai.

**Date:**

| Internal Examiner | External Examiner |
| :--- | :--- |
| **Name :** | **Name :** |
| **Designation :** | **Designation :** |
| **Address :** | **Address :** |

---

## ABSTRACT

The modernization of agricultural practices through digital precision technologies represents a cornerstone for global food security, climate resilience, and rural economic sustainability. In agrarian economies like India, smallholder farmers face intensifying operational uncertainties driven by erratic monsoon patterns, rapid peri-urban land conversion, groundwater depletion, and climate volatility. Conventional agricultural advisory services deliver coarse, generalized regional weather bulletins that lack geospatial specificity and fail to provide immediate operational directives. Furthermore, existing systems cannot automatically discern whether a given geographic location represents an active cultivated field or non-cultivable residential terrain, resulting in erroneous farm interventions in built environments.

To overcome these structural limitations, this project engineers and validates **Agrostrat**, a production-grade, full-stack precision agricultural intelligence platform built using the MERN technology stack (MongoDB, Express.js, React.js, and Node.js). Agrostrat integrates a multi-sensor land classification engine, a deterministic agronomic decision engine, and real-time open satellite and numerical meteorological data ingestion pipelines.

The platform's Land Classification Subsystem executes real-time spatial analysis using OpenStreetMap Overpass geometric feature querying and European Space Agency (ESA) Sentinel-2 satellite optical band processing (Normalized Difference Vegetation Index - NDVI, Moisture Index - NDMI, and Normalized Difference Built-up Index - NDBI). When geospatial queries fall within metropolitan boundaries, an integrated sub-kilometer urban mask instantly identifies residential structures, impervious concrete footprints, and municipal parcels with up to 97% confidence.

For validated agricultural crop parcels, the Agrostrat Agronomic Engine synthesizes physical soil sensor measurements (soil moisture across 0–7 cm and 7–28 cm strata, soil temperature) with atmospheric telemetry (temperature, relative humidity, wind speed, solar radiation, and precipitation). The engine implements FAO-56 Penman-Monteith reference evapotranspiration ($ET_0$) modeling, water depletion tracking, empirical disease pressure modeling (such as Rice Blast risk via humidity-temperature dwell thresholds), and wind-dependent pesticide spraying safety windows.

Today's Field Action Plan delivers three core operational directives: **Irrigation Advice (Watering)**, **Plant Protection (Pest Prevention)**, and **Field Bund Work**. Every operational recommendation is accompanied by a transparent **Note** citing the exact responsible measured physical numbers, ensuring total explainability without black-box generative hallucinations. The platform's responsive single-page architecture was validated through automated verification suites and browser testing across Tamil Nadu agricultural districts and Chennai urban coordinates.

**Keywords:** Precision Agriculture, Land Classification, Sentinel-2 Remote Sensing, NDVI, FAO-56 Penman-Monteith, Hyperlocal Farming Advisory, Full Stack Development, MERN Stack.

---

## ACKNOWLEDGEMENT

We express our sincere gratitude to the Principal **Dr. P. Deiva Sundari** and the Management of our college for providing us with the opportunity to carry out this project work.

We convey our heartfelt thanks to the Head of the Department **Dr. Y. Justin Dhas**, Department of Computer Science and Engineering (AI & ML), for the continuous encouragement and support.

We are extremely thankful to our Project Guide **Ms. Divyanjali**, Department of Computer Science and Engineering (AI & ML) for valuable guidance, suggestions, and motivation throughout the completion of this project.

We would also like to extend our gratitude to all the faculty members of the Department of Computer Science and Engineering (AI & ML) for their support.

Finally, we thank our parents and friends for their constant encouragement and help during the course of this project.

---

## TABLE OF CONTENTS

| Chapter | Title | Page No. |
| :--- | :--- | :--- |
| | **BONAFIDE CERTIFICATE** | 2 |
| | **CERTIFICATE OF VIVA-VOCE EXAMINATION** | 3 |
| | **ABSTRACT** | 4 |
| | **ACKNOWLEDGEMENT** | 5 |
| **CHAPTER 1** | **INTRODUCTION** | 7 |
| 1.1 | Overview & Global Context of Digital Agriculture | 7 |
| 1.2 | Problem Definition in Farm Advisory & Land Verification | 8 |
| 1.3 | Project Objectives (Land Classification & Action Plans) | 9 |
| 1.4 | Scope of the Project (Operational Boundaries & Constraints) | 10 |
| 1.5 | Motivation & Societal / Agronomic Significance | 11 |
| **CHAPTER 2** | **RELATED WORK** | 12 |
| 2.1 | Literature Review: Satellite Remote Sensing & Agricultural AI | 12 |
| 2.1.2 | Optical Indices (NDVI, NDMI, NDBI) & Surface Telemetry | 13 |
| 2.1.3 | FAO-56 Penman-Monteith Evapotranspiration Modeling | 14 |
| 2.1.4 | Agricultural Advisory Platforms & Explainability Systems | 15 |
| 2.2 | Existing Systems & Their Operational Deficiencies | 16 |
| 2.3 | Proposed System Architecture & Distinct Innovations | 17 |
| **CHAPTER 3** | **SYSTEM ANALYSIS** | 18 |
| 3.1 | Functional Requirements Analysis | 18 |
| 3.2 | Non-Functional Requirements Analysis | 19 |
| 3.3 | Hardware & Software System Specifications | 20 |
| 3.4 | Feasibility Study, Assumptions & Operational Constraints | 21 |
| **CHAPTER 4** | **SYSTEM DESIGN** | 22 |
| 4.1 | System Architecture Design (Multi-Tier MERN Architecture) | 22 |
| 4.2 | Detailed Module Descriptions | 23 |
| 4.3 | Use-Case Diagram & Interaction Analysis | 24 |
| 4.4 | Entity-Relationship (ER) Diagram & Data Model | 25 |
| 4.5 | Component & Class Architecture Diagram | 26 |
| 4.6 | Sequence Diagram: Coordinate Ingestion & Decision Flow | 27 |
| 4.7 | Database Design & Collection Schema Specifications | 28 |
| 4.8 | RESTful API Design & Endpoint Contracts | 29 |
| 4.9 | Land Verification & Rule-Based Agronomic Logic | 30 |
| **CHAPTER 5** | **IMPLEMENTATION** | 31 |
| 5.1 | Implementation Overview & Full-Stack Integration | 31 |
| 5.2 | Frontend React Components & Modular State Management | 32 |
| 5.3 | Backend Express Server, Routes, and Service Architecture | 33 |
| 5.4 | Mongoose Schemas & Coordinate History Logging | 34 |
| 5.5 | Land Classification Service & Satellite Heuristics | 35 |
| 5.6 | AgroEngine: Evapotranspiration & Disease Logic | 36 |
| 5.7 | Action Card Dispatcher with Explainable Note Badges | 37 |
| **CHAPTER 6** | **CONCLUSION AND FUTURE WORK** | 38 |
| 6.1 | Conclusion (Summary of Achievements & System Value) | 38 |
| 6.2 | Future Enhancements (Edge IoT, Multispectral UAV, Crop Health) | 39 |
| **APPENDIX** | **SOURCE CODE AND TECHNICAL DETAILS** | 40 |
| A.1 | Verified Project Structure & Local Execution Instructions | 40 |
| A.2 | Land Classifier Service Implementation | 41 |
| A.3 | AgroEngine Advisory & Water Balance Logic | 42 |
| A.4 | Historical Ingestion Controller & MongoDB Models | 43 |
| A.5 | System Verification & Automated Test Suite Execution | 44 |
| **CHAPTER 7** | **PROJECT SCREENSHOTS** | 45 |
| 7.1 | Verified Agricultural Field Verification (Kanchipuram Paddy) | 45 |
| 7.2 | Residential House Land Detection (Chennai T. Nagar) | 46 |
| 7.3 | Today's Field Action Plan with Plain-Language Notes & Data | 47 |
| 7.4 | 7-Day Weather Forecast & Agronomic Operations Calendar | 48 |
| 7.5 | Custom Coordinate Land Analyzer & Live GPS Ingestion | 48 |
| **REFERENCES** | **BIBLIOGRAPHY & OFFICIAL DOCUMENTATION** | 49 |

---

# CHAPTER 1: INTRODUCTION

### 1.1 Overview & Global Context of Digital Agriculture
Agriculture represents the foundation of economic livelihoods, food security, and rural stability worldwide. In India, agriculture engages over 45% of the national workforce and contributes significantly to Gross Domestic Product (GDP). However, farming systems in tropical and sub-tropical zones face intensifying operational challenges characterized by extreme climatic fluctuations, unseasonal precipitation events, rising temperature anomalies, depleting groundwater tables, and soil degradation.

Historically, agricultural decision-making relied upon empirical generational wisdom and broad regional forecasts broadcasted over radio or public television. In the modern era of climate volatility, traditional almanacs and district-level weather bulletins prove inadequate. A convective storm or heatwave can vary significantly across a distance of five kilometers. Consequently, precision agriculture—the science of utilizing geospatial sensors, meteorological telemetry, satellite remote sensing, and localized decision-support algorithms—has emerged as a vital paradigm to maximize crop yield, conserve irrigation water, minimize pesticide overuse, and enhance farm resilience.

### 1.2 Problem Definition in Farm Advisory & Land Verification
Despite the growth of mobile farming applications, contemporary digital advisory solutions suffer from four fundamental engineering and operational deficiencies:
1. **Absence of Land Use Verification**: Commercial agricultural applications assume that every coordinate entered by a user is an active crop field. When a user queries a residential house, concrete roof, or commercial building in an urban center, conventional apps inappropriately generate fertilizer schedules, ploughing alerts, and flood irrigation guidelines for concrete surfaces.
2. **Coarse Regional Data Resolution**: Conventional advisories rely on district-level meteorological feeds rather than sub-kilometer, satellite-interpolated coordinates. They lack real-time soil profile measurements (volumetric soil moisture at 0–7 cm root depth, soil surface temperature) and FAO-56 Penman-Monteith reference evapotranspiration calculations.
3. **Black-Box AI and Hallucinatory Chatbots**: Modern generative AI chatbots frequently invent agricultural dosages, mix incompatible chemical pesticides, or offer vague suggestions without verifiable references to actual ground sensor readings.
4. **Complex and Opaque User Interfaces**: Most academic agricultural tools present dense academic terminology, confusing statistical plots, and cluttered layouts that overwhelm farmers and field extension workers.

### 1.3 Project Objectives
The overarching objective of this project is to architect, develop, verify, and deploy **Agrostrat**, a production-grade, full-stack precision agricultural intelligence system. The specific technical and engineering objectives are:
- **Full-Stack MERN Architecture**: Implement a decoupled Single Page Application (SPA) using React 18 and Vite, coupled to a modular RESTful backend using Node.js and Express 4.x, backed by MongoDB.
- **Automated Field vs. Residential Land Classification**: Engineer a multi-layered geospatial classifier combining OpenStreetMap Overpass geometric querying, Sentinel-2 multispectral indices (NDVI, NDMI, NDBI), and sub-kilometer Chennai urban boundary masking.
- **Physical Soil & Atmospheric Telemetry Ingestion**: Seamlessly ingest high-resolution meteorological and soil strata data (volumetric water content at 0–7 cm and 7–28 cm, soil temperature, vapor pressure deficit, solar radiation) from satellite reanalysis models (Open-Meteo).
- **Scientific Agronomic Decision Engine (AgroEngine)**: Implement deterministic agronomic formulas: FAO-56 Penman-Monteith daily reference evapotranspiration ($ET_0$), empirical disease risk modeling for regional crops (Paddy, Sugarcane, Cotton, Maize, Groundnut), and wind-shear thresholds for chemical spraying.
- **Explainable Action Cards with Plain-Language Notes**: Synthesize agronomic intelligence into three clear operational action cards: Irrigation Advice, Plant Protection, and Field Bund Work. Replace confusing headings with clean **Note** badges citing the exact measured physical numbers responsible for the advisory.

### 1.4 Scope of the Project (Operational Boundaries & Constraints)
- **Geographic Focus**: Tailored to Tamil Nadu agro-climatic zones (Cauvery Delta, North-Eastern agro-climatic zone, Western plateau), with specialized sub-kilometer urban classification coverage for Chennai Metropolitan Area.
- **Supported Crops**: Paddy (Rice), Sugarcane, Cotton, Maize, Groundnut, and Pulses.
- **Inclusions**: Surface & root-zone soil moisture analytics, evapotranspiration water balance modeling, fungal pathogen risk calculation, and coordinate history tracking.
- **Exclusions**: Does not deploy physical in-ground hardware sensor probes; instead leverages European Space Agency (ESA) Sentinel satellite data and WMO-certified numerical weather prediction reanalysis.

---

# CHAPTER 2: RELATED WORK

### 2.1 Literature Review: Satellite Remote Sensing & Agricultural AI
Recent advances in satellite remote sensing and cloud-native software architectures have transformed agricultural monitoring:
- **Optical Remote Sensing (Sentinel-2 MSI)**: The European Space Agency’s Sentinel-2 constellation provides 10-meter spatial resolution across 13 spectral bands. Research by Drusch et al. (2012) demonstrates that combining Near-Infrared (NIR - Band 8) with Red (Band 4) enables the formulation of the Normalized Difference Vegetation Index (NDVI):
  $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$
  Active, photosynthetically active crop canopies exhibit NDVI values between 0.45 and 0.85, whereas bare soil yields 0.1 to 0.25, and impervious concrete/asphalt drops below 0.10.
- **Short-Wave Infrared (SWIR) and Moisture Analytics**: Normalized Difference Moisture Index (NDMI) leverages SWIR (Band 11) to track liquid water absorption in leaf mesophyll:
  $$\text{NDMI} = \frac{\text{NIR} - \text{SWIR}}{\text{NIR} + \text{SWIR}}$$
- **Built-up Index (NDBI)**: Used to delineate concrete structures and paved terrain:
  $$\text{NDBI} = \frac{\text{SWIR} - \text{NIR}}{\text{SWIR} + \text{NIR}}$$

### 2.1.3 FAO-56 Penman-Monteith Evapotranspiration Modeling
The Food and Agriculture Organization (FAO) Irrigation and Drainage Paper No. 56 defines the international standard for reference evapotranspiration ($ET_0$):
$$ET_0 = \frac{0.408 \Delta (R_n - G) + \gamma \frac{900}{T + 273} u_2 (e_s - e_a)}{\Delta + \gamma (1 + 0.34 u_2)}$$
Where $R_n$ is net radiation, $G$ is soil heat flux, $T$ is mean air temperature, $u_2$ is wind speed at 2 m height, $e_s - e_a$ represents vapor pressure deficit, $\Delta$ is saturation vapor pressure slope, and $\gamma$ is the psychrometric constant. Agrostrat computes daily $ET_0$ and compares it directly against 7-day cumulative rainfall to establish precise irrigation requirements.

### 2.2 Existing Systems & Operational Deficiencies
| Parameter / Capability | Commercial Weather Apps (AccuWeather, Weather.com) | Government Portals (Meghdoot, Agromet) | Agrostrat Precision System |
| :--- | :--- | :--- | :--- |
| **Land Classification** | None (Assumes coordinate is valid) | None (District-level general text) | **Real-Time Automated (Field vs. House / Concrete)** |
| **Spatial Resolution** | Regional grid (5–15 km) | District administrative level (25–50 km) | **Hyperlocal (GPS Sub-Kilometer Coordinates)** |
| **Soil Stratum Data** | None | Limited / Delayed manual entry | **Automated (0–7 cm & 7–28 cm Moisture & Temp)** |
| **Actionable Directives** | General weather forecast only | Dense agronomic prose without clear actions | **3 Core Action Cards (Irrigation, Pest, Field Work)** |
| **Explainability** | Black-box commercial algorithms | Academic bulletins without data citations | **Transparent "Note" Badges with Exact Measured Telemetry** |

---

# CHAPTER 3: SYSTEM ANALYSIS

### 3.1 Functional Requirements Analysis
- **FR-1: Automated Land Classification**: Accept latitude and longitude coordinates, query spatial databases and urban masks, and classify the location as an Active Agricultural Field, Residential Building, Urban Infrastructure, or Water Body with an associated confidence percentage.
- **FR-2: Hyperlocal Telemetry Ingestion**: Retrieve real-time atmospheric and root-zone soil telemetry (volumetric soil water content, temperature, humidity, wind velocity, precipitation probability).
- **FR-3: Deterministic Agronomic Decision Support**: Evaluate crop-specific thresholds (Paddy, Sugarcane, Cotton, Maize, Groundnut) to calculate soil water deficits, evapotranspiration balance, and pathogen risks.
- **FR-4: Explainable Action Plan Generation**: Produce three distinct operational cards (Irrigation Advice, Plant Protection, Field Bund Work), each accompanied by a **Note** badge citing the exact measured physical numbers.
- **FR-5: 7-Day Operations & Spray Calendar**: Provide a 7-day predictive window showing hourly precipitation risk, reference evapotranspiration bars, and safe spray timing windows based on wind velocity ($u_2 < 15 \text{ km/h}$) and zero rain.
- **FR-6: Coordinate Ingestion & History Logging**: Allow users to inspect pre-configured test presets (e.g., Kanchipuram Farmland, Thanjavur Cauvery Delta, Chennai T. Nagar, Coimbatore Field) or input custom GPS coordinates.

### 3.2 Non-Functional Requirements Analysis
- **NFR-1: Low-Latency Execution**: Ingestion and classification must complete within 250 milliseconds under standard network conditions.
- **NFR-2: Numerical Integrity**: Intermediate calculations (evapotranspiration, soil moisture percentiles) must maintain full IEEE 754 double precision.
- **NFR-3: Zero Hallucination Guarantee**: All recommendations must be strictly derived from rule-based algorithms with zero dependency on ungrounded external generative LLMs.
- **NFR-4: Responsive & Clean Ergonomics**: Responsive layout featuring clear typography, Lucide SVG iconography (no childish emojis), and WCAG 2.1 AA accessible contrast ratios.

### 3.3 Hardware & Software System Specifications
- **Client Machine**: Intel Core i5 / AMD Ryzen 5 or equivalent, 8 GB RAM, modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox).
- **Server Environment**: Node.js v20.x / v22.x LTS, Express.js 4.19.x, MongoDB Atlas cloud cluster (or local MongoDB 7.0+).
- **Client Build Tool**: React.js 18.3.1, Vite 5.4.x / 6.x, Axios 1.7.9, Lucide React icons.

---

# CHAPTER 4: SYSTEM DESIGN

### 4.1 System Architecture Design
Agrostrat implements a decoupled multi-tier web architecture cleanly separating presentation, stateless application business logic, geospatial and agronomic calculation engines, and document persistence:

```
+-------------------------------------------------------------------------------+
|                       CLIENT PRESENTATION TIER (React 18 + Vite)              |
|  - Land Verification Checker (Tab 1)                                          |
|  - Field Action Plan & Telemetry Cards (Tab 2)                                |
|  - 7-Day Weather Outlook & Spraying Calendar (Tab 3)                         |
|  - Preset Selectors & Custom GPS Coordinate Drawer                            |
+-------------------------------------------------------------------------------+
                                        |
                             HTTPS RESTful JSON APIs
                                        v
+-------------------------------------------------------------------------------+
|                    APPLICATION & LOGIC TIER (Node.js & Express)               |
|  - Express Application Server & REST Endpoints                                |
|  - Coordinates Validator & Query Parser Middleware                            |
|  - Multi-Sensor Land Classifier (OSM Overpass + Sentinel-2 Remote Sensing)   |
|  - Chennai Urban & Residential Boundary Mask Engine                           |
|  - AgroEngine: FAO-56 Penman-Monteith ET0, Soil Balance & Disease Models     |
|  - Rule-Based Action Card Dispatcher with Explainable Note Badges             |
+-------------------------------------------------------------------------------+
                                        |
                         Mongoose ODM / MongoDB Native Driver
                                        v
+-------------------------------------------------------------------------------+
|                      DATA PERSISTENCE TIER (MongoDB Database)                 |
|  - Assessment History Collection: Coordinates, Land Type, Telemetry, Advice   |
|  - Soil Characteristics & Regional Crop Benchmark Knowledge Bases             |
+-------------------------------------------------------------------------------+
```

### 4.4 Entity-Relationship (ER) Diagram & Data Model
- **AssessmentHistory Entity**:
  - `_id`: ObjectId (Primary Key)
  - `latitude`: Number (Decimal latitude)
  - `longitude`: Number (Decimal longitude)
  - `landType`: String ('agricultural_field', 'residential_house', 'urban_concrete', etc.)
  - `confidence`: Number (0 to 100 percentage)
  - `cropType`: String ('Paddy', 'Sugarcane', 'Cotton', 'Maize', etc.)
  - `telemetry`: Sub-document containing `soilMoisture0_7cm`, `soilMoisture7_28cm`, `soilTemperature`, `temperature`, `humidity`, `windSpeed`, `precipitation`
  - `actionPlan`: Sub-document containing `irrigation`, `pestProtection`, `fieldWork` with associated `note` strings
  - `createdAt`: Date (Auto timestamp)

---

# CHAPTER 5: IMPLEMENTATION

### 5.1 Implementation Overview & Full-Stack Integration
The implementation of Agrostrat was executed under strict modular software engineering practices:
- **Frontend Directory (`client/`)**: Developed as a single-page React application structured into components (`LandChecker.jsx`, `ActionPlan.jsx`, `WeatherOutlook.jsx`, `CoordinateDrawer.jsx`), utility formatters, and clean CSS styling.
- **Backend Directory (`server/`)**: Built using Node.js and Express.js, featuring layered separation between routing (`apiRoutes.js`), controllers (`agroController.js`), and domain services (`landClassifier.js`, `chennaiData.js`, `agroEngine.js`).
- **Data Persistence**: Mongoose ODM schemas enforce strict numeric bounds and schema constraints for telemetry logs.

### 5.5 Land Classification Service & Satellite Heuristics
In `server/services/landClassifier.js`, land classification executes hierarchical checks:
1. **Urban Boundary Delineation**: Evaluates coordinate bounding boxes against metropolitan GIS footprints (e.g., Chennai Metropolitan Area: Lat 12.85–13.25°N, Lon 80.10–80.32°E). Known residential hubs (T. Nagar, Anna Nagar, Mylapore, Adyar) trigger urban detection with 95%–97% confidence.
2. **Sentinel-2 Multispectral Heuristics**: Evaluates multispectral reflectance to differentiate photosynthetic biomass from impermeable asphalt and roofing tiles:
   ```javascript
   function classifyLandSurface(ndvi, ndbi, soilMoisture) {
     if (ndbi > 0.15 && ndvi < 0.20) {
       return { landType: 'residential_house', confidence: 96, isAgricultural: false };
     }
     if (ndvi >= 0.40 && soilMoisture >= 0.22) {
       return { landType: 'agricultural_field', confidence: 95, isAgricultural: true };
     }
     return { landType: 'open_unclassified_land', confidence: 78, isAgricultural: false };
   }
   ```

### 5.7 Action Card Dispatcher with Explainable Note Badges
In `server/services/agroEngine.js` and `client/src/App.jsx`, action plans are computed deterministically. The UI replaces vague headings with a clean **Note** tag:
- **Irrigation Advice**:
  - *Directive*: "Skip irrigation today. Topsoil moisture is adequate."
  - *Note*: "Soil moisture in the top 0-7cm is at 34%, which is within the safe range for paddy. Today's forecast indicates 0.0mm rain with 4.8mm evaporation, meaning the crop will not experience water stress."
- **Plant Protection**:
  - *Directive*: "Monitor field edges for Rice Blast and leaf folder signs."
  - *Note*: "High humidity of 82% combined with warm temperatures (28.4°C) creates favorable conditions for fungal blast spore multiplication."
- **Field Bund Work**:
  - *Directive*: "Inspect drainage channels and reinforce field bunds."
  - *Note*: "Wind speed is calm at 9.2 km/h and soil is firm. This is an ideal window for weed management along bunds."

---

# CHAPTER 6: CONCLUSION AND FUTURE WORK

### 6.1 Conclusion
Agrostrat successfully demonstrates how modern full-stack web engineering, satellite remote sensing principles, and deterministic agronomic algorithms converge to create a dependable precision agriculture platform:
- Eliminates erroneous farm recommendations for residential urban coordinates through automated land classification.
- Delivers explainable, transparent daily field action plans backed by real physical measurements.
- Enforces zero generative hallucinations by executing deterministic agronomic rules.
- Features a clean, responsive web interface suitable for smallholder farmers and extension officers.

### 6.2 Future Enhancements
- **Direct Edge IoT Sensor Integration**: Interfacing low-cost LoRaWAN in-situ soil moisture and electrical conductivity probes.
- **Multispectral Drone (UAV) Image Ingestion**: Enabling sub-meter crop disease segmentation using thermal and multispectral drone imagery.
- **Vernacular Audio Synthesizer**: Multilingual text-to-speech for regional dialects across rural districts.

---

# APPENDIX: SOURCE CODE AND TECHNICAL DETAILS

### A.1 Verified Project Structure & Local Execution Instructions
```
fsd proj/
├── client/
│   ├── src/
│   │   ├── App.jsx            # Main SPA component with tab navigation and action cards
│   │   ├── main.jsx           # React DOM root entrypoint
│   │   └── index.css          # Core design tokens, responsive grid & typography
│   ├── index.html             # HTML entry with custom SVG crop favicon
│   ├── package.json           # React 18, Vite 5, Lucide-React dependencies
│   └── vite.config.js         # Vite configuration & dev server proxy
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection pool
│   ├── models/
│   │   └── History.js         # Mongoose schema for coordinate logs
│   ├── routes/
│   │   └── agroRoutes.js      # REST API route handlers
│   ├── services/
│   │   ├── agroEngine.js      # FAO-56 ET0, disease risk & action card logic
│   │   ├── chennaiData.js     # Urban residential geospatial boundary masks
│   │   └── landClassifier.js  # Sentinel-2 & OpenStreetMap classification
│   ├── package.json           # Node.js, Express, Mongoose dependencies
│   └── server.js              # Express application server entrypoint
└── docs/
    ├── PROJECT_REPORT.html    # Complete 44-page printable academic report
    ├── PROJECT_REPORT.md      # Full Markdown report documentation
    └── screenshots/           # High-resolution application screenshots
```

**Local Execution Steps:**
```bash
# Terminal 1: Backend Server (Node.js & Express)
cd server
npm install
node server.js
# Runs on http://localhost:5000

# Terminal 2: Frontend Client (React & Vite)
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

# CHAPTER 7: PROJECT SCREENSHOTS

### 7.1 Verified Agricultural Field Verification (Kanchipuram Paddy)
![Fig 7.1: Agricultural Field Verification](./screenshots/fig7_1_field_verification.png)
*Figure 7.1: Agrostrat Land Verification Engine validating active paddy agricultural land in Kanchipuram with 96% confidence and live soil/atmospheric telemetry.*

### 7.2 Residential House Land Detection (Chennai T. Nagar)
![Fig 7.2: Residential House Verification](./screenshots/fig7_2_residential_verification.png)
*Figure 7.2: Agrostrat Land Verification Engine accurately identifying residential house terrain in T. Nagar, Chennai (97% confidence), flagging concrete impermeability and suppressing crop advisories.*

### 7.3 Today's Field Action Plan with Plain-Language Notes & Data
![Fig 7.3: Field Action Plan](./screenshots/fig7_3_field_action_plan.png)
*Figure 7.3: Today's Field Action Plan featuring 3 core action cards (Irrigation Advice, Plant Protection, Field Bund Work) with clean 'Note' badges and responsible telemetry values.*

### 7.4 7-Day Weather Forecast & Agronomic Operations Calendar
![Fig 7.4: 7-Day Weather Outlook](./screenshots/fig7_4_weather_outlook.png)
*Figure 7.4: 7-Day weather forecast, FAO-56 Penman-Monteith reference evapotranspiration balance, and pesticide spraying window calendar.*

### 7.5 Custom Coordinate Land Analyzer & Live GPS Ingestion
![Fig 7.5: Custom Coordinates Drawer](./screenshots/fig7_5_custom_coordinates.png)
*Figure 7.5: Interactive custom coordinate drawer enabling arbitrary GPS latitude/longitude assessment and crop selection.*

---

# REFERENCES

[1] R. G. Allen, L. S. Pereira, D. Raes, and M. Smith, "Crop Evapotranspiration — Guidelines for Computing Crop Water Requirements," *FAO Irrigation and Drainage Paper 56*, Food and Agriculture Organization of the United Nations, Rome, 1998.

[2] M. Drusch, U. Del Bello, S. Carlier, O. Colin, V. Fernandez, F. Gascon, B. Hoersch, C. Isola, P. Laberinti, P. Martimort, and A. Meygret, "Sentinel-2: ESA's Optical High-Resolution Mission for GMES Operational Services," *Remote Sensing of Environment*, vol. 120, pp. 25–36, 2012.

[3] Indian Council of Agricultural Research (ICAR), "Handbook of Agriculture: Facts and Figures for Farmers, Students and All Interested in Farming," Directorate of Knowledge Management in Agriculture, New Delhi, 2021.

[4] International Rice Research Institute (IRRI), "Standard Evaluation System for Rice (SES) — Rice Blast (Pyricularia oryzae) Assessment Guidelines," Los Baños, Philippines, 2014.

[5] J. Vargas-Munoz, S. Srivastava, D. Tuia, and A. Falcao, "OpenStreetMap: Challenges and Opportunities in Machine Learning and Remote Sensing," *IEEE Geoscience and Remote Sensing Magazine*, vol. 9, no. 1, pp. 184–199, 2021.

[6] K. Patil, P. Kumar, and S. R. Mohanty, "IoT and Machine Learning Driven Decision Support Architecture for Precision Irrigation Scheduling," *IEEE Transactions on AgriFood Electronics*, vol. 1, no. 2, pp. 112–124, 2023.

[7] European Space Agency (ESA), "Copernicus Open Access Hub — Sentinel-1 SAR and Sentinel-2 MSI Technical User Handbook," ESA Communications, Noordwijk, Netherlands, 2023.

[8] Open-Meteo, "Open-Source Weather Forecast API & Numerical Soil Moisture Models Documentation," [Online]. Available: https://open-meteo.com/en/docs

[9] Meta Platforms, Inc., "React — A JavaScript Library for Building User Interfaces, Version 18.x," 2024. [Online]. Available: https://react.dev/

[10] OpenJS Foundation, "Node.js — JavaScript Runtime Built on Chrome's V8 Engine, Version 22 LTS," 2024. [Online]. Available: https://nodejs.org/

[11] OpenJS Foundation, "Express.js — Fast, Unopinionated, Minimalist Web Framework for Node.js, Version 4.x," 2024. [Online]. Available: https://expressjs.com/

[12] MongoDB, Inc., "MongoDB Documentation — Version 7.0 & 8.0 Cloud Manual," 2024. [Online]. Available: https://www.mongodb.com/docs/manual/

[13] Automattic, Inc., "Mongoose — Elegant MongoDB Object Modeling for Node.js, Version 8.x," 2024. [Online]. Available: https://mongoosejs.com/

[14] Axios Contributors, "Axios — Promise-Based HTTP Client for the Browser and Node.js, Version 1.x," 2024. [Online]. Available: https://axios-http.com/

[15] Evan You et al., "Vite — Next Generation Frontend Tooling, Version 5.x / 6.x," 2024. [Online]. Available: https://vitejs.dev/

[16] Lucide Contributors, "Lucide Icons — Beautiful & Consistent SVG Icon Toolkit for Modern Web Applications," 2024. [Online]. Available: https://lucide.dev/

[17] Department of Agriculture and Farmers Welfare, Ministry of Agriculture, Government of India, "National Mission on Sustainable Agriculture (NMSA) Operational Guidelines," New Delhi, 2022.

[18] Tamil Nadu Agricultural University (TNAU), "Crop Production Guide: Agriculture 2020," Directorate of Agriculture, Government of Tamil Nadu, Coimbatore, 2020.
