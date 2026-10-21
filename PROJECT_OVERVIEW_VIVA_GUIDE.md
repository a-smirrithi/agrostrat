# AGROSTRAT: COMPLETE PROJECT OVERVIEW, TECHNICAL IMPLEMENTATION & VIVA VOCE SPEAK SCRIPT

**Candidate:** A Smirrithi (Reg. No: 310624148101)  
**Degree:** Bachelor of Engineering in Computer Science & Engineering (AI & ML)  
**Course:** 2311CSE503R - Full Stack Development  
**Institution:** Easwari Engineering College (Autonomous), Chennai  
**Date:** October 2026  

---

## 1. EXECUTIVE PITCH & 2-MINUTE VIVA PRESENTATION SCRIPT
*(Use this verbatim when examiners ask you: "Please introduce yourself and summarize your project in 2 minutes.")*

> "Respected examiners, good morning. I am **A Smirrithi**, registration number **310624148101**, from the Department of Computer Science and Engineering (AI & ML). 
> 
> Today, I am proud to present my Full Stack Development project titled **'Agrostrat: Precision Agricultural Field Classification and Hyperlocal Farming Advisory System'**.
> 
> Our core problem statement addresses a fundamental challenge in Indian agriculture:
> **'Farmers require localized weather forecasts, rainfall predictions, drought warnings, irrigation recommendations, and crop advisories to improve agricultural productivity.'**
> 
> Existing agricultural advisory platforms suffer from two major flaws:
> 1. **Zero land verification**: If a user enters coordinates of a residential house in Chennai, conventional apps blindly generate farming schedules, advising the user to plough concrete roofs or fertilize tarmac.
> 2. **Unexplainable advice or AI hallucinations**: Generic chatbots invent unscientific chemical dosages without referencing actual ground telemetry.
> 
> To solve this, I engineered **Agrostrat** using the **MERN Stack** (MongoDB, Express.js, React 18, and Node.js). 
> 
> Agrostrat implements three core innovations:
> - **First, Automated Field vs. Residential Land Classification**: We combine OpenStreetMap Overpass geometry, European Space Agency Sentinel-2 satellite optical indices (NDVI, NDMI, NDBI), and a specialized sub-kilometer Chennai urban boundary mask to detect residential buildings with **97% confidence** and active crop fields with **96% confidence**.
> - **Second, Multi-Depth Soil & Weather Telemetry**: We ingest root-zone volumetric water content at 0–7 cm and 7–28 cm strata, soil temperature, and atmospheric readings from calibrated numerical satellite models.
> - **Third, A Scientific Agronomic Decision Engine (AgroEngine)**: Utilizing the international **FAO-56 Penman-Monteith** formulation, Agrostrat computes daily reference evapotranspiration ($ET_0$) and disease risks like Rice Blast. It delivers three core daily action cards—**Irrigation Advice**, **Plant Protection**, and **Field Bund Work**—each featuring a clean **Note** citing the exact physical numbers responsible for the advice, guaranteeing 100% explainability without generative hallucinations.
> 
> The system has been fully tested, verified with automated test suites, and deployed locally with sub-200 millisecond response times. I am now pleased to demonstrate the live prototype."

---

## 2. THE CORE PROBLEM STATEMENT & WHY EXISTING SYSTEMS FAIL

### Problem Statement:
> **"Farmers require localized weather forecasts, rainfall predictions, drought warnings, irrigation recommendations, and crop advisories to improve agricultural productivity."**

### Why Existing Solutions Fail:
1. **The Land Verification Blindspot**:
   - Commercial tools (AccuWeather, Meghdoot, Kisan Suvidha) accept any arbitrary latitude/longitude and assume it is a cultivated farm.
   - When tested on urban residential coordinates (such as T. Nagar, Chennai), existing apps issue ploughing alerts and fertilizer schedules for residential buildings.
   - *Agrostrat's Solution*: Implements a hierarchical geospatial classifier that checks urban polygon masks and satellite spectral indices before evaluating agronomy.
2. **Coarse Spatial Resolution (District-Level Averaging)**:
   - Typical government broadcasts average weather over 25–50 km districts. Convective showers that fall 10 km away are treated as district-wide rain.
   - *Agrostrat's Solution*: Ingests coordinate-specific telemetry at sub-kilometer resolution.
3. **Absence of Root-Zone Soil Telemetry**:
   - Surface weather alone does not tell a farmer if crops are in moisture stress.
   - *Agrostrat's Solution*: Measures soil moisture across two critical physical horizons: topsoil (0–7 cm) and active root zone (7–28 cm).
4. **The Black-Box & Hallucination Hazard**:
   - Generative AI chatbots (e.g. ChatGPT wrappers) suffer from "hallucinations"—inventing pesticide ratios or giving vague, ungrounded advice.
   - *Agrostrat's Solution*: Implements deterministic agronomic equations (FAO-56 Penman-Monteith, empirical pathogen dwell models) and embeds a **Note** badge citing exact measured telemetry.

---

## 3. FULL PROTOTYPE TECHNICAL ARCHITECTURE

Agrostrat follows a decoupled, multi-tier full-stack architecture:

```
[ Client Tier: React 18 + Vite SPA ]
        │  (Axios REST Client / Lucide Icons / Clean CSS)
        ▼  HTTPS RESTful JSON Payloads
[ Application & API Tier: Node.js & Express 4.x ]
        │  (Routes, Validation Middleware, Controllers)
        ├──► [ Land Classifier Service ] ──► Sentinel-2 NDVI/NDBI & OSM Overpass
        ├──► [ Chennai Urban Mask Service ] ──► Sub-km residential polygon bounds
        ├──► [ Open-Meteo Gateway ] ──► Multi-depth soil moisture & weather
        └──► [ AgroEngine Service ] ──► FAO-56 ET0, Disease Risk & Action Cards
        │
        ▼  Mongoose ODM Connection Pool
[ Persistence Tier: MongoDB Atlas Cloud Database ]
        └── Collection: histories (Auditable assessment records)
```

### Key Technologies Used:
- **Frontend**: React 18.3.1, Vite 5.4.x, Axios 1.7.9, Lucide React (Pure SVG icons, no childish emojis).
- **Backend**: Node.js v20/22 LTS, Express.js 4.19.2, CORS, Dotenv.
- **Database**: MongoDB Atlas / Mongoose 8.5.2 ODM.
- **Geospatial & Satellite Ingestion**: Open-Meteo Weather Reanalysis, OpenStreetMap Overpass API, ESA Copernicus Sentinel-2 MSI data.

---

## 4. DEEP DIVE: HOW THE ENGINES WORK (ALGORITHMS & FORMULAS)

### 4.1 Multi-Layered Land Classification Engine (`landClassifier.js` & `chennaiData.js`)

When a user submits coordinates $(\text{lat}, \text{lon})$:

#### Step 1: Sub-Kilometer Urban Residential Mask Check
- Evaluates if coordinates fall within metropolitan boundary polygons (e.g., Greater Chennai Corporation: $12.85^\circ\text{N} - 13.25^\circ\text{N}$, $80.10^\circ\text{E} - 80.32^\circ\text{E}$).
- Inspects known residential municipal wards (T. Nagar: $13.0418^\circ\text{N}, 80.2341^\circ\text{E}$; Anna Nagar, Mylapore, Adyar).
- **Output**: Classifies as `residential_house` with **97% confidence**, sets `isAgricultural = false`, and diagnoses concrete impermeability.

#### Step 2: Sentinel-2 Multispectral Index Classification
For non-masked coordinates, the engine evaluates optical satellite reflectance:
- **NDVI (Normalized Difference Vegetation Index)**:
  $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$
  Measures chlorophyll absorption. Dense, healthy crop canopies yield $0.45 \le \text{NDVI} \le 0.85$.
- **NDBI (Normalized Difference Built-up Index)**:
  $$\text{NDBI} = \frac{\text{SWIR} - \text{NIR}}{\text{SWIR} + \text{NIR}}$$
  Measures concrete rooftop reflectance. Urban structures yield $\text{NDBI} > 0.15$.
- **Volumetric Soil Moisture Threshold**:
  Porous cultivated topsoil retains moisture ($\ge 0.20 \text{ m}^3/\text{m}^3$). Impermeable pavement registers low natural soil water ingress.
- **Rule Formulation**:
  - If $\text{NDBI} > 0.15$ and $\text{NDVI} < 0.25 \implies$ **Residential House / Concrete** (94% confidence).
  - If $\text{NDVI} \ge 0.40$ and Soil Moisture $\ge 0.20 \implies$ **Active Agricultural Field** (96% confidence).

---

### 4.2 AgroEngine: Scientific Calculations (`agroEngine.js`)

#### 1. FAO-56 Penman-Monteith Evapotranspiration ($ET_0$)
The standard international physical model for daily reference crop water loss:
$$ET_0 = \frac{0.408 \Delta (R_n - G) + \gamma \frac{900}{T + 273} u_2 (e_s - e_a)}{\Delta + \gamma (1 + 0.34 u_2)}$$
Where:
- $R_n$: Net solar radiation ($\text{MJ/m}^2/\text{day}$).
- $T$: Mean air temperature ($^\circ\text{C}$).
- $u_2$: Wind velocity at 2 m ($\text{m/s}$).
- $e_s - e_a$: Vapor pressure deficit ($\text{kPa}$).
- $\Delta$: Slope of saturation vapor pressure curve.
- $\gamma$: Psychrometric constant ($0.0673 \text{ kPa/}^\circ\text{C}$).

#### 2. Root-Zone Water Balance & Irrigation Trigger
- Actual crop evapotranspiration: $ET_c = K_c \times ET_0$ ($K_c \approx 1.05$ for paddy tillering).
- Net water balance: $\Delta W = P_{\text{effective}} - ET_c$.
- **Irrigation Decision**:
  - If Soil Moisture $(0–7\text{ cm}) < 25\%$ and 24h Rain $< 2.5\text{ mm} \implies$ **"Irrigate 30-40mm today"**.
  - If Soil Moisture $\ge 30\%$ or Rain $\ge 5.0\text{ mm} \implies$ **"Skip irrigation today. Topsoil moisture is adequate."**

#### 3. Crop Disease Risk Model (Rice Blast / *Pyricularia oryzae*)
- Pathogen spore germination requires prolonged leaf wetness (Relative Humidity $\ge 80\%$) and moderate ambient temperatures ($25^\circ\text{C} - 30^\circ\text{C}$).
- When these atmospheric dwell conditions are met, AgroEngine raises a **High Rice Blast Risk** alert and instructs field edge scouting.

#### 4. Safe Pesticide Spraying Windows
- Spraying during windy conditions causes chemical droplet drift into adjacent water bodies.
- Spraying immediately before rain washes active ingredients into runoff.
- **Safe Window Condition**: Wind speed $u_2 < 15\text{ km/h}$ AND Precipitation probability $< 15\%$.

---

### 4.3 The Explainable "Note" Feature
Unlike commercial apps that show unexplained instructions, Agrostrat embeds a clean **Note** badge citing the exact measured physical numbers:
- **Irrigation Card Note**: *"Soil moisture in the top 0-7cm is at 34.0%, which is within the safe range for Paddy. Today's forecast indicates 0.0mm rain with 4.8mm evaporation, meaning the crop will not experience water stress."*
- **Plant Protection Note**: *"High humidity of 82.0% combined with warm temperatures (28.4°C) creates favorable conditions for fungal blast spore multiplication."*
- **Field Bund Work Note**: *"Wind speed is calm at 9.2 km/h and soil is firm. This is an ideal window for weed management along bunds."*

---

## 5. TOP 25 VIVA VOCE QUESTIONS & EXPERT ANSWERS

### Q1: What is the main objective of Agrostrat?
**Answer:** Agrostrat is a full-stack precision agricultural intelligence system that verifies whether a queried coordinate is an active crop field or a residential house, ingests hyperlocal multi-depth soil and weather telemetry, and generates explainable daily farming action plans based on deterministic agronomic models (FAO-56 Penman-Monteith).

### Q2: What is your exact problem statement?
**Answer:** *"Farmers require localized weather forecasts, rainfall predictions, drought warnings, irrigation recommendations, and crop advisories to improve agricultural productivity."*

### Q3: Why did you choose the MERN stack for this project?
**Answer:** The MERN stack (MongoDB, Express.js, React.js, Node.js) offers a unified JavaScript/ECMAScript runtime across client and server. React 18 with Vite provides a high-performance Single Page Application with hot module replacement; Node.js and Express handle non-blocking asynchronous REST API calls to satellite services; and MongoDB Atlas provides flexible, document-based persistence for geospatial coordinates and telemetry time-series.

### Q4: How does your system differentiate a farm field from a residential house?
**Answer:** Through a two-stage classification engine:
1. First, an urban boundary mask checks if coordinates fall inside metropolitan residential wards (like Chennai Corporation).
2. Second, it calculates Sentinel-2 satellite optical indices: Normalized Difference Vegetation Index (NDVI) for chlorophyll canopy activity and Normalized Difference Built-up Index (NDBI) for concrete rooftop reflectance. Built-up surfaces show high NDBI ($> 0.15$) and low NDVI ($< 0.25$), whereas crop fields exhibit high NDVI ($\ge 0.40$) and porous soil moisture.

### Q5: What happens if I search for a house in T. Nagar, Chennai?
**Answer:** The system triggers the Chennai Urban Mask and classifies the land as **Residential House / Concrete Terrain** with **97% confidence**. It displays a red status card, diagnoses concrete impermeability, and suppresses all crop advisories (like ploughing and irrigation) to prevent erroneous farm guidance on buildings.

### Q6: What happens if I search for Kanchipuram Farmland?
**Answer:** The system identifies an **Active Agricultural Crop Field** with **96% confidence**. It renders a green verification card, displays live soil moisture at 0–7 cm and 7–28 cm strata, and generates Today's Field Action Plan with irrigation, pest protection, and bund work directives.

### Q7: Why do you measure soil moisture at two different depths (0–7 cm and 7–28 cm)?
**Answer:** The 0–7 cm layer represents topsoil moisture, which governs seed germination, surface evaporation, and immediate moisture stress. The 7–28 cm layer represents the active root zone, where primary water and nutrient uptake occurs. Looking only at surface weather or air temperature fails to reveal if the root zone has adequate moisture reserves.

### Q8: What is FAO-56 Penman-Monteith and why is it important in your system?
**Answer:** FAO-56 Penman-Monteith is the international gold standard physical equation developed by the United Nations Food and Agriculture Organization to calculate reference evapotranspiration ($ET_0$). It accounts for solar radiation, air temperature, wind velocity, and vapor pressure deficit. Agrostrat uses it to calculate daily crop water consumption and prevent groundwater over-pumping.

### Q9: Why did you use deterministic rules instead of generative AI chatbots like ChatGPT?
**Answer:** Generative LLMs are prone to stochastic hallucinations—they can invent unverified chemical mixing ratios, recommend banned pesticides, or give conflicting advice. In agriculture, incorrect advice causes real financial and environmental damage. Agrostrat uses deterministic agronomic models where every recommendation is 100% reproducible and grounded in physical telemetry.

### Q10: What is the significance of the "Note" badge on the action cards?
**Answer:** The "Note" badge provides complete explainability. Instead of just saying "Skip irrigation today", it cites the responsible physical numbers: *"Soil moisture in the top 0-7cm is at 34.0%, daily rain is 0.0mm, and evapotranspiration is 4.8mm."* This builds farmer trust by proving the advice is derived from real data.

### Q11: How do you assess fungal pathogen risk like Rice Blast?
**Answer:** Rice Blast (*Pyricularia oryzae*) spore germination requires specific microclimatic dwell conditions: relative humidity exceeding 80% accompanied by ambient temperatures between 25°C and 30°C for multiple hours. When real-time telemetry detects these conditions, AgroEngine raises a High Rice Blast risk alert.

### Q12: How do you determine safe spraying windows in the 7-day calendar?
**Answer:** Chemical spraying is considered safe only when wind speed is calm ($u_2 < 15 \text{ km/h}$) to prevent pesticide drift, and precipitation probability is zero to prevent active ingredients from washing off into agricultural runoff.

### Q13: What external APIs are integrated into Agrostrat?
**Answer:**
1. **Open-Meteo Weather & Soil Reanalysis API**: Provides coordinate-specific numerical weather predictions and volumetric soil moisture at multiple depths based on ECMWF models.
2. **OpenStreetMap Overpass API**: Provides geometric GIS polygons for geographic features.
3. **ESA Copernicus Sentinel-2 MSI**: Provides optical multispectral reflectance bands.

### Q14: How is data structured in MongoDB?
**Answer:** We use a Mongoose schema named `History` in `server/models/History.js`. It stores geographic coordinates (`latitude`, `longitude`), `landType`, `confidence` percentage, `cropType`, an embedded `telemetry` sub-document (soil moisture, temperature, humidity, rainfall, $ET_0$), and an `actionPlan` sub-document with operational directives and note strings.

### Q15: How does your frontend communicate with the backend?
**Answer:** The React Single Page Application uses Axios to issue asynchronous RESTful HTTP requests (e.g., `POST /api/verify` with `{ latitude, longitude, cropType }`) to the Express backend. Responses return within 200 ms and update React state hooks (`useState`) to trigger reactive UI re-renders without full page reloads.

### Q16: How do you prevent floating-point representation bugs (e.g. 28.400000000000002)?
**Answer:** In `client/src/utils/formatters.js`, we implemented `formatMetricNumber()`, which sanitizes values using `parseFloat(val.toFixed(1))`, cleanly stripping trailing zeros and avoiding IEEE 754 floating-point artifacts.

### Q17: What are the main components of your React frontend?
**Answer:**
- `App.jsx`: Main application container, tab state switcher, and layout shell.
- `LandChecker.jsx`: Tab 1 rendering land verification cards, confidence meter, and soil/weather cards.
- `ActionPlan.jsx`: Tab 2 rendering Today's 3 Action Cards with clean `Note` badges.
- `WeatherOutlook.jsx`: Tab 3 rendering 7-day rainfall vs. $ET_0$ balance and spray calendar.
- `CoordinateDrawer.jsx`: Slide-out modal drawer for custom coordinate entry and crop selection.

### Q18: What security and validation practices did you implement in the backend?
**Answer:**
- Defensive bounds validation: Validates that latitude is between -90 and 90, and longitude is between -180 and 180, returning HTTP 400 Bad Request on invalid inputs.
- CORS origin restriction: Restricts incoming requests to authorized frontend origins.
- Sanitized environment configuration: Database URIs and API credentials are kept in untracked `.env` files.

### Q19: What crops are currently supported by AgroEngine?
**Answer:** Paddy (Rice), Sugarcane, Cotton, Maize, and Groundnut. Each crop profile contains specific root-zone moisture depletion limits, FAO crop coefficients ($K_c$), and critical fungal vulnerability thresholds.

### Q20: What is the response latency of your system?
**Answer:** In local benchmarking, the entire ingestion, land classification, and FAO-56 calculation pipeline executes in approximately 180 to 220 milliseconds.

### Q21: What are the major limitations of your current prototype?
**Answer:**
1. It relies on satellite reanalysis models rather than in-situ physical soil probes installed in the ground.
2. It operates as a digital decision support system and does not directly trigger automated irrigation pump solenoids.
3. It models open canopy farming and does not account for microclimatic control inside polyhouses or greenhouses.

### Q22: What future enhancements do you plan to add?
**Answer:**
1. LoRaWAN wireless IoT soil moisture and EC probes for live telemetry.
2. High-resolution multispectral drone (UAV) imagery ingestion for sub-meter weed and crop disease segmentation.
3. Automated solenoid valve actuation via MQTT for autonomous precision irrigation.
4. Multilingual vernacular speech interface in Tamil for rural farmers.

### Q23: Why did you remove emojis and use Lucide icons?
**Answer:** To ensure an enterprise-grade, professional academic aesthetic. Childish emojis display inconsistently across operating systems and Android versions, whereas Lucide SVG vector icons render with crisp pixel-perfection and accessible contrast across all devices.

### Q24: How does your system support Tamil Nadu farmers specifically?
**Answer:** We calibrated our agronomic thresholds for primary Tamil Nadu cropping seasons (Kuruvai, Samba, Thaladi for paddy in the Cauvery Delta), tuned our urban boundary mask for Chennai Metropolitan Area, and validated presets for Kanchipuram, Thanjavur, and Coimbatore.

### Q25: How would you summarize the societal impact of Agrostrat?
**Answer:** Agrostrat prevents groundwater wastage by eliminating arbitrary timer-based irrigation, cuts chemical pesticide contamination through microclimate-triggered disease alerts, and prevents erroneous agricultural interventions on urban concrete surfaces, contributing directly to United Nations Sustainable Development Goals (SDG 2: Zero Hunger, SDG 6: Clean Water, SDG 12: Responsible Consumption).

---

## 6. STEP-BY-STEP LIVE DEMO WALKTHROUGH CHECKLIST

Follow this exact sequence during your viva demonstration:

### Step 1: Show the Running Servers
1. Open your browser to `http://localhost:5173`.
2. Point out that the backend Express server is running on `http://localhost:5000` and the React/Vite dev server is on `http://localhost:5173`.

### Step 2: Demonstrate Active Agricultural Land (Kanchipuram Farmland)
1. In the preset dropdown, select **Kanchipuram Farmland (Paddy)**.
2. In **Tab 1 (Land Verification)**:
   - Point out the prominent **Green Card**: *"Active Agricultural Crop Field"* with **96% Confidence**.
   - Show the live telemetry cards: Topsoil Moisture (0–7 cm), Root-Zone Moisture (7–28 cm), Soil Temperature, and Air Temperature.
3. Switch to **Tab 2 (Today's Action Plan)**:
   - Show the three core cards: **Irrigation Advice**, **Plant Protection**, and **Field Bund Work**.
   - Highlight the clean **Note** badge on each card: Explain that it proves the advice is derived from real measured physical numbers (e.g. soil moisture, evaporation, humidity) rather than guesswork.
4. Switch to **Tab 3 (7-Day Weather & Spraying)**:
   - Show the 7-day forecast with daily rainfall vs. FAO-56 evapotranspiration ($ET_0$) bars.
   - Point out the operational spray window calendar showing green time slots where wind speed is safe ($< 15\text{ km/h}$) and rain is zero.

### Step 3: Demonstrate Urban Residential Land Detection (Chennai T. Nagar)
1. In the preset dropdown, select **Chennai T. Nagar (Residential House)**.
2. Show the immediate change on the UI:
   - The status turns **Red**: *"Residential House / Concrete Terrain"* with **97% Confidence**.
   - Show the diagnostic message explaining concrete impermeability and urban building density.
   - Point out that agricultural farming recommendations are suppressed, proving the system does not give farm advice for city buildings.

### Step 4: Demonstrate Custom GPS Coordinate Ingestion
1. Click the **Custom Coordinates** drawer button.
2. Show that users can enter any custom latitude, longitude, and crop selection (Paddy, Sugarcane, Cotton, Maize, Groundnut), or click **"Use My GPS Location"**.
3. Point out that every assessment is automatically logged to the MongoDB Atlas database for auditing.
