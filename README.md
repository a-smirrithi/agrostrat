# AGROSTRAT: Precision Agricultural Field Classification & Hyperlocal Farming Advisory System

## 📌 Problem Statement
> **“Farmers require localized weather forecasts, rainfall predictions, drought warnings, irrigation recommendations, and crop advisories to improve agricultural productivity.”**

Conventional agricultural mobile apps suffer from a critical blindspot: they assume every queried coordinate is an active farm. When tested on urban residential houses (such as T. Nagar, Chennai), existing apps issue ploughing alerts and irrigation schedules for concrete rooftops. Furthermore, they rely on coarse 25–50 km regional weather forecasts and ungrounded generative AI chatbots that invent chemical dosages.

**Agrostrat** solves this by uniting **automated land classification (Field vs. House)**, **multi-depth soil moisture telemetry (0–7 cm & 7–28 cm)**, and **deterministic FAO-56 Penman-Monteith evapotranspiration water balance modeling** into a clean, explainable MERN stack web platform.

---

## 🚀 Key Innovations & Features

1. **Automated Land Classification (Field vs. Residential House - 96% to 97% Confidence)**
   - **Sub-Kilometer Urban Mask**: Evaluates coordinates against Greater Chennai Corporation GIS boundaries to detect residential zones (T. Nagar, Anna Nagar, Mylapore) and concrete impermeability.
   - **Sentinel-2 Remote Sensing Indices**: Evaluates Normalized Difference Vegetation Index (NDVI), Normalized Difference Built-up Index (NDBI), and canopy moisture (NDMI) to differentiate active crop foliage from asphalt and roof tiles.
   - **Smart Suppression**: Automatically suppresses agricultural farming advisories on residential coordinates to prevent erroneous farm directives.

2. **Multi-Strata Soil & Atmospheric Telemetry Ingestion**
   - Ingests surface topsoil moisture (0–7 cm depth) and active root-zone reserve (7–28 cm depth).
   - Retrieves calibrated soil temperature, ambient dry-bulb temperature, relative humidity, wind velocity at 2 m height, and precipitation via Open-Meteo reanalysis models.

3. **Scientific Agronomic Decision Engine (AgroEngine)**
   - **FAO-56 Penman-Monteith Evapotranspiration ($ET_0$)**: Calculates true daily atmospheric crop water demand.
   - **Root-Zone Water Depletion**: Compares rainfall against evapotranspiration ($\Delta W = P_{\text{effective}} - ET_c$).
   - **Microclimatic Disease Model**: Flags **High Rice Blast Risk** when relative humidity $\ge 80\%$ and temperatures dwell between 25°C and 30°C.
   - **Spray Window Calendar**: Identifies safe chemical spraying hours based on calm winds ($u_2 < 15 \text{ km/h}$) and zero rain probability.

4. **Explainable Action Cards with "Note" Badges**
   - Delivers three daily operational directives: **Irrigation Advice**, **Plant Protection**, and **Field Bund Work**.
   - Replaces vague instructions with a dedicated **Note** badge citing exact measured physical telemetry numbers (soil moisture %, evaporation mm, humidity %, wind km/h).

---

## 🏗️ Multi-Tier System Architecture

```
[ Client Tier: React 18 + Vite SPA ]
        │  (Axios REST Client / Lucide SVG Icons / Responsive CSS)
        ▼  HTTPS RESTful JSON Payloads
[ Application & API Tier: Node.js & Express 4.x ]
        │  (Defensive coordinate validation, CORS, REST Controllers)
        ├──► [ Land Classifier Service ] ──► Sentinel-2 NDVI/NDBI & OSM Overpass
        ├──► [ Chennai Urban Mask Service ] ──► Sub-km residential polygon bounds
        ├──► [ Open-Meteo Gateway ] ──► Multi-depth soil moisture & weather
        └──► [ AgroEngine Service ] ──► FAO-56 ET0, Disease Risk & Action Cards
        │
        ▼  Mongoose ODM Connection Pool
[ Persistence Tier: MongoDB Atlas Cloud Database ]
        └── Collection: histories (Auditable assessment records)
```

---

## 📁 Repository Structure

```
fsd proj/
├── client/                                    # Frontend React 18 + Vite SPA
│   ├── src/
│   │   ├── App.jsx                            # Main unified dashboard & tab switcher
│   │   ├── main.jsx                           # React DOM root entry
│   │   ├── index.css                          # Modern light theme CSS tokens
│   │   └── utils/formatters.js                # Display-layer decimal sanitizers
│   ├── public/favicon.svg                     # Custom SVG crop icon
│   ├── index.html                             # HTML5 shell
│   ├── package.json                           # React, Vite, Lucide-React, Axios
│   └── vite.config.js                         # Vite dev proxy configuration
├── server/                                    # Backend Node.js & Express REST API
│   ├── config/db.js                           # MongoDB Atlas connection pool
│   ├── models/History.js                      # Mongoose schema for audit logging
│   ├── routes/agroRoutes.js                   # RESTful API route definitions
│   ├── services/
│   │   ├── landClassifier.js                  # Sentinel-2 & OpenStreetMap classifier
│   │   ├── chennaiData.js                     # Chennai sub-km residential boundary masks
│   │   └── agroEngine.js                      # FAO-56 ET0, disease risk & Note dispatcher
│   ├── .env.example                           # Sanitized environment template
│   ├── package.json                           # Express, Mongoose, Axios, Dotenv
│   └── server.js                              # Express application entrypoint
├── docs/                                      # Complete Academic Project Documentation
│   ├── Agrostrat_Project_Report_310624148101.pdf   # 52-page printable academic report
│   ├── Agrostrat_Project_Report_310624148101.docx  # Fully editable Word document
│   ├── PROJECT_OVERVIEW_VIVA_GUIDE.md         # 2-min pitch, architecture & 25 viva Q&As
│   ├── PROJECT_REPORT.html                    # A4 print-ready HTML report
│   ├── PROJECT_REPORT.md                      # Complete markdown project report
│   └── screenshots/                           # High-resolution application captures & diagrams
├── .gitignore                                 # Ignores .env, node_modules, build artifacts
└── README.md                                  # Project overview and deployment guide
```

---

## 💻 Local Setup & Execution Instructions

### Prerequisites
- **Node.js**: v18.x, v20.x, or v22.x LTS installed
- **npm**: v9.x or later
- **MongoDB Atlas**: Free M0 Sandbox cluster (or local MongoDB)

### Step 1: Clone the Repository
```bash
git clone https://github.com/a-smirrithi/<your-repo-name>.git
cd <your-repo-name>
```

### Step 2: Configure Environment Variables
Inside `server/`, create a `.env` file based on `.env.example`:
```bash
cp server/.env.example server/.env
```
Add your MongoDB connection URI:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agro-dashboard
```

### Step 3: Run Backend Server
```bash
cd server
npm install
node server.js
```
*Backend runs on `http://localhost:5000` with active MongoDB Atlas connection.*

### Step 4: Run Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`. Open in your browser to view the application.*

---

## 🌐 Full Stack Deployment Guide

Deploying Agrostrat to the cloud is completely free using **Vercel** (Frontend) and **Render** (Backend):

### Part 1: Deploy MongoDB Database (MongoDB Atlas)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox** cluster in `AWS / Mumbai (ap-south-1)`.
3. Under **Database Access**, create a user with Read/Write privileges.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** → **Drivers** (Node.js) and copy your connection string (`mongodb+srv://...`).

### Part 2: Deploy Backend REST API (Render)
1. Push your repository to your GitHub account (`a-smirrithi`).
2. Sign in to [Render](https://render.com) using GitHub.
3. Click **New +** → **Web Service**.
4. Select your Agrostrat repository.
5. Set the deployment parameters:
   - **Name**: `agrostrat-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
6. Under **Environment Variables**, add:
   - `PORT` = `5000`
   - `MONGO_URI` = `<Your MongoDB connection string from Part 1>`
7. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://agrostrat-api.onrender.com`).

### Part 3: Deploy Frontend SPA (Vercel)
1. Sign in to [Vercel](https://vercel.com) using GitHub.
2. Click **Add New...** → **Project**.
3. Import your Agrostrat repository.
4. Set the deployment parameters:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your frontend is live on `https://agrostrat.vercel.app`!
*(Optional: In `client/vite.config.js` or `client/src/App.jsx`, configure Axios base URL to point to your Render backend URL).*

---

