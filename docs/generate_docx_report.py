# -*- coding: utf-8 -*-
"""
Generates the fully styled, editable Microsoft Word (.docx) document
for the Agrostrat Academic Project Report matching the Anna University template.
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

base_dir = r"c:\Users\User\Desktop\fsd proj\docs"
screens_dir = os.path.join(base_dir, "screenshots")
logo_path = os.path.join(screens_dir, "easwari_logo.png")

doc = Document()

# Set standard A4 Page Dimensions & Margins
for section in doc.sections:
    section.page_width = Inches(8.27)   # 210 mm
    section.page_height = Inches(11.69) # 297 mm
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.9)
    section.right_margin = Inches(0.9)
    # Add page number to footer
    footer = section.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    # We will let Word handle footer or write page markers

# Helper functions for styling
def set_para_font(p, name='Times New Roman', size=12, bold=False, italic=False, color=None, space_after=6, line_spacing=1.3):
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    for run in p.runs:
        run.font.name = name
        run.font.size = Pt(size)
        run.bold = bold
        run.italic = italic
        if color:
            run.font.color.rgb = color

def add_styled_para(doc, text="", style='Normal', align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=False, italic=False, size=12, space_after=6):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.35
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    return p

def add_heading_1(doc, text, subtitle=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(16)
    run.bold = True
    
    if subtitle:
        p2 = doc.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.paragraph_format.space_after = Pt(16)
        r2 = p2.add_run(subtitle)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(14)
        r2.bold = True

def add_section_heading(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    run.bold = True

def add_bullet(doc, bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.25
    r1 = p.add_run(bold_prefix + " ")
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(11.5)
    r1.bold = True
    r2 = p.add_run(text)
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(11.5)

def add_image_figure(doc, img_path, caption, width_in=5.8):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        p_img.add_run().add_picture(img_path, width=Inches(width_in))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run(caption)
        r_cap.font.name = 'Times New Roman'
        r_cap.font.size = Pt(10.5)
        r_cap.bold = True
        r_cap.italic = True

# ==========================================
# PAGE 1: COVER
# ==========================================
add_styled_para(doc, "AGROSTRAT: PRECISION AGRICULTURAL FIELD CLASSIFICATION AND HYPERLOCAL FARMING ADVISORY SYSTEM", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=16, space_after=18)
add_styled_para(doc, "A PROJECT REPORT", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=12)
add_styled_para(doc, "Submitted by", align=WD_ALIGN_PARAGRAPH.CENTER, size=12, space_after=6)
add_styled_para(doc, "A SMIRRITHI (310624148101)", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=18)

add_styled_para(doc, "in partial fulfillment for the award of the Degree of", align=WD_ALIGN_PARAGRAPH.CENTER, size=12, space_after=4)
add_styled_para(doc, "BACHELOR OF ENGINEERING", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=4)
add_styled_para(doc, "in", align=WD_ALIGN_PARAGRAPH.CENTER, size=12, space_after=4)
add_styled_para(doc, "COMPUTER SCIENCE AND ENGINEERING (AI & ML)", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=8)
add_styled_para(doc, "2311CSE503R - FULL STACK DEVELOPMENT", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=12, space_after=16)

if os.path.exists(logo_path):
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_after = Pt(12)
    p_logo.add_run().add_picture(logo_path, width=Inches(1.2))

add_styled_para(doc, "EASWARI ENGINEERING COLLEGE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=4)
add_styled_para(doc, "(AN AUTONOMOUS INSTITUTION) – AFFILIATED TO ANNA UNIVERSITY, CHENNAI", align=WD_ALIGN_PARAGRAPH.CENTER, size=11, space_after=4)
add_styled_para(doc, "CHENNAI", align=WD_ALIGN_PARAGRAPH.CENTER, size=11, space_after=6)
add_styled_para(doc, "OCTOBER 2026", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=12, space_after=0)

doc.add_page_break()

# ==========================================
# PAGE 2: BONAFIDE CERTIFICATE
# ==========================================
if os.path.exists(logo_path):
    p_logo2 = doc.add_paragraph()
    p_logo2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo2.paragraph_format.space_after = Pt(6)
    p_logo2.add_run().add_picture(logo_path, width=Inches(0.8))

add_styled_para(doc, "EASWARI ENGINEERING COLLEGE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=18)
add_styled_para(doc, "BONAFIDE CERTIFICATE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=24)

add_styled_para(doc, "Certified that this mini project report titled “AGROSTRAT: PRECISION AGRICULTURAL FIELD CLASSIFICATION AND HYPERLOCAL FARMING ADVISORY SYSTEM” is the Bonafide work of “A SMIRRITHI (310624148101)”, who carried out the project work under my supervision.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=12, space_after=80)

# Signatures Table
tbl_sign = doc.add_table(rows=1, cols=2)
tbl_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_sign.rows[0].cells[0].paragraphs[0].add_run("HEAD OF THE DEPARTMENT").bold = True
tbl_sign.rows[0].cells[1].paragraphs[0].add_run("SUPERVISOR").bold = True
tbl_sign.rows[0].cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT

doc.add_page_break()

# ==========================================
# PAGE 3: VIVA-VOCE CERTIFICATE
# ==========================================
if os.path.exists(logo_path):
    p_logo3 = doc.add_paragraph()
    p_logo3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo3.paragraph_format.space_after = Pt(6)
    p_logo3.add_run().add_picture(logo_path, width=Inches(0.8))

add_styled_para(doc, "EASWARI ENGINEERING COLLEGE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=14, space_after=18)
add_styled_para(doc, "Certificate of Viva-voce-Examination", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=20)

add_styled_para(doc, "This is to certify that the Viva Voce Examination of the Project Work entitled “AGROSTRAT: PRECISION AGRICULTURAL FIELD CLASSIFICATION AND HYPERLOCAL FARMING ADVISORY SYSTEM” submitted by", align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=12, space_after=12)
add_styled_para(doc, "Ms. A Smirrithi (Reg. No. 310624148101)", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=13, space_after=12)
add_styled_para(doc, "in partial fulfillment of the requirements for the award of the degree of Bachelor of Engineering was conducted on ____________ (Date) in the Department of Computer Science and Engineering (AI & ML), Easwari Engineering College, Ramapuram – Chennai.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=12, space_after=24)

add_styled_para(doc, "Date:", align=WD_ALIGN_PARAGRAPH.LEFT, bold=True, size=12, space_after=24)

tbl_viva = doc.add_table(rows=1, cols=2)
tbl_viva.alignment = WD_TABLE_ALIGNMENT.CENTER
c1 = tbl_viva.rows[0].cells[0].paragraphs[0]
c1.add_run("Internal Examiner\n\nName :\n\nDesignation :\n\nAddress :").bold = False
c2 = tbl_viva.rows[0].cells[1].paragraphs[0]
c2.add_run("External Examiner\n\nName :\n\nDesignation :\n\nAddress :").bold = False

doc.add_page_break()

# ==========================================
# PAGE 4: ABSTRACT
# ==========================================
add_heading_1(doc, "ABSTRACT")
add_styled_para(doc, "The modernization of agricultural practices through digital precision technologies represents a cornerstone for global food security, climate resilience, and rural economic sustainability. In agrarian economies like India, smallholder farmers face intensifying operational uncertainties driven by erratic monsoon patterns, rapid peri-urban land conversion, groundwater depletion, and climate volatility.")
add_styled_para(doc, "Farmers require localized weather forecasts, rainfall predictions, drought warnings, irrigation recommendations, and crop advisories to improve agricultural productivity. Conventional agricultural advisory services deliver coarse regional bulletins that lack geospatial specificity, fail to provide immediate operational directives, and cannot verify whether a given coordinate represents a cultivated field or residential terrain.", bold=False)
add_styled_para(doc, "This project designs, engineers, and verifies Agrostrat, an operational full-stack precision agricultural intelligence system developed using the MERN technology stack (MongoDB, Express.js, React.js, and Node.js). Agrostrat integrates automated field-level land verification, real-time satellite reanalysis telemetry ingestion, deterministic FAO-56 Penman-Monteith evapotranspiration water balance modeling, and fungal pathogen infection risk calculation.")
add_styled_para(doc, "The platform's Land Classification Subsystem executes real-time spatial analysis using OpenStreetMap Overpass geometric feature querying and European Space Agency (ESA) Sentinel-2 satellite optical band processing (Normalized Difference Vegetation Index - NDVI, Moisture Index - NDMI, and Normalized Difference Built-up Index - NDBI). When geospatial queries fall within metropolitan boundaries, an integrated sub-kilometer urban mask instantly identifies residential structures, impervious concrete footprints, and municipal parcels with up to 97% confidence.")
add_styled_para(doc, "For validated agricultural crop parcels, the Agrostrat Agronomic Engine synthesizes physical soil sensor measurements (volumetric moisture at 0–7 cm and 7–28 cm root depths, soil temperature) with atmospheric parameters. Today's Field Action Plan delivers three core operational directives: Irrigation Advice (Watering), Plant Protection (Pest Prevention), and Field Bund Work. Every recommendation is accompanied by an explainable Note citing the exact measured physical numbers responsible for the advice without black-box generative hallucinations. System verification was confirmed across Tamil Nadu agricultural districts and Chennai urban coordinates.")
add_styled_para(doc, "Keywords: Precision Agriculture, Land Classification, Sentinel-2 Remote Sensing, NDVI, FAO-56 Penman-Monteith, Hyperlocal Farming Advisory, Full Stack Development, MERN Stack.", bold=True, size=11, space_after=12)

doc.add_page_break()

# ==========================================
# PAGE 5: ACKNOWLEDGEMENT
# ==========================================
add_heading_1(doc, "ACKNOWLEDGEMENT")
add_styled_para(doc, "We express our sincere gratitude to the Principal Dr. P. Deiva Sundari and the Management of our college for providing us with the opportunity to carry out this project work.", space_after=12)
add_styled_para(doc, "We convey our heartfelt thanks to the Head of the Department Dr. Y. Justin Dhas, Department of Computer Science and Engineering (AI & ML), for the continuous encouragement and support.", space_after=12)
add_styled_para(doc, "We are extremely thankful to our Project Guide Ms. Divyanjali, Department of Computer Science and Engineering (AI & ML) for valuable guidance, suggestions, and motivation throughout the completion of this project.", space_after=12)
add_styled_para(doc, "We would also like to extend our gratitude to all the faculty members of the Department of Computer Science and Engineering (AI & ML) for their support.", space_after=12)
add_styled_para(doc, "Finally, we thank our parents and friends for their constant encouragement and help during the course of this project.", space_after=12)

doc.add_page_break()

# ==========================================
# PAGE 6 & 7: TABLE OF CONTENTS
# ==========================================
add_heading_1(doc, "TABLE OF CONTENTS")

toc_items = [
    ("BONAFIDE CERTIFICATE", "", "2"),
    ("CERTIFICATE OF VIVA-VOCE EXAMINATION", "", "3"),
    ("ABSTRACT", "", "4"),
    ("ACKNOWLEDGEMENT", "", "5"),
    ("CHAPTER 1", "INTRODUCTION", "8"),
    ("1.1", "Overview & Global Context of Digital Agriculture", "8"),
    ("1.2", "Problem Definition & Statement in Precision Agriculture", "9"),
    ("1.3", "Project Objectives (Land Classification & Action Plans)", "10"),
    ("1.4", "Scope of the Project (Operational Boundaries & Constraints)", "11"),
    ("1.5", "Motivation & Societal / Agronomic Significance", "12"),
    ("CHAPTER 2", "RELATED WORK", "13"),
    ("2.1", "Literature Review: Satellite Remote Sensing & Agricultural AI", "13"),
    ("2.1.2", "Optical Indices (NDVI, NDMI, NDBI) & Surface Telemetry", "14"),
    ("2.1.3", "FAO-56 Penman-Monteith Evapotranspiration & Water Balance", "15"),
    ("2.1.4", "Agricultural Decision Support Systems & Explainability", "16"),
    ("2.2", "Existing Systems & Their Operational Deficiencies", "17"),
    ("2.3", "Proposed System Architecture & Distinct Innovations", "18"),
    ("CHAPTER 3", "SYSTEM ANALYSIS", "19"),
    ("3.1", "Functional Requirements Analysis", "19"),
    ("3.2", "Non-Functional Requirements Analysis", "20"),
    ("3.3", "Hardware & Software System Specifications", "21"),
    ("3.4", "Feasibility Study, Assumptions & Operational Constraints", "22"),
    ("CHAPTER 4", "SYSTEM DESIGN", "23"),
    ("4.1", "System Architecture Design (Multi-Tier MERN Architecture)", "23"),
    ("4.2", "Detailed Module Descriptions", "24"),
    ("4.3", "Use-Case Diagram & Interaction Analysis", "25"),
    ("4.4", "Entity-Relationship (ER) Diagram & Data Model", "26"),
    ("4.5", "Component & Class Architecture Diagram", "27"),
    ("4.6", "Sequence Diagram: Coordinate Ingestion & Decision Flow", "28"),
    ("4.7", "Database Design & Collection Schema Specifications", "29"),
    ("4.8", "RESTful API Design & Endpoint Contracts", "31"),
    ("4.9", "Land Classification Heuristics & Deterministic Agronomic Logic", "32"),
    ("CHAPTER 5", "IMPLEMENTATION", "33"),
    ("5.1", "Implementation Overview & Full-Stack Integration", "33"),
    ("5.2", "Frontend React Components & State Management", "34"),
    ("5.3", "Backend Express Server, Routes, and Controller Architecture", "35"),
    ("5.4", "Mongoose Schemas & Geospatial Persistence Implementation", "36"),
    ("5.5", "Core Land Classification Engine & Sentinel-2 Logic", "37"),
    ("5.6", "AgroEngine: Evapotranspiration, Soil Depletion & Disease Risk", "38"),
    ("5.7", "Explainable Action Card Dispatcher with Note Badges", "39"),
    ("CHAPTER 6", "CONCLUSION AND FUTURE WORK", "41"),
    ("6.1", "Conclusion (Summary of Achievements & System Value)", "41"),
    ("6.2", "Future Enhancements (Edge IoT, Multispectral UAV, Forecasting)", "42"),
    ("APPENDIX", "SOURCE CODE AND TECHNICAL DETAILS", "43"),
    ("A.1", "Verified Project Structure & Local Execution Instructions", "43"),
    ("A.2", "Database Schema & History Model, Land Classifier Service", "44"),
    ("A.3", "AgroEngine Calculation Service & Action Card Dispatcher", "45"),
    ("A.4", "System Verification & Automated Test Suite Execution", "46"),
    ("CHAPTER 7", "PROJECT SCREENSHOTS", "47"),
    ("7.1", "Verified Agricultural Field Verification (Kanchipuram Paddy)", "47"),
    ("7.2", "Residential House Land Detection (Chennai T. Nagar)", "48"),
    ("7.3", "Today's Field Action Plan with Plain-Language Notes & Data", "49"),
    ("7.4", "7-Day Weather Forecast & Custom Coordinate Analyzer", "50"),
    ("REFERENCES", "BIBLIOGRAPHY & OFFICIAL DOCUMENTATION", "51")
]

tbl_toc = doc.add_table(rows=len(toc_items) + 1, cols=3)
tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr = tbl_toc.rows[0]
hdr.cells[0].paragraphs[0].add_run("Chapter").bold = True
hdr.cells[1].paragraphs[0].add_run("Title").bold = True
hdr.cells[2].paragraphs[0].add_run("Page No.").bold = True
hdr.cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT

for i, (col1, col2, col3) in enumerate(toc_items):
    row = tbl_toc.rows[i + 1]
    r1 = row.cells[0].paragraphs[0].add_run(col1)
    if "CHAPTER" in col1 or col1 in ["BONAFIDE CERTIFICATE", "ABSTRACT", "REFERENCES", "APPENDIX"]:
        r1.bold = True
    r2 = row.cells[1].paragraphs[0].add_run(col2)
    if "CHAPTER" in col1:
        r2.bold = True
    r3 = row.cells[2].paragraphs[0].add_run(col3)
    row.cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT

doc.add_page_break()

# ==========================================
# CHAPTER 1: INTRODUCTION
# ==========================================
add_heading_1(doc, "CHAPTER 1", "INTRODUCTION")
add_section_heading(doc, "1.1 Overview & Global Context of Digital Agriculture")
add_styled_para(doc, "Agriculture represents the foundation of economic livelihoods, food security, and rural stability worldwide. In India, agriculture engages over 45% of the national workforce and contributes significantly to Gross Domestic Product (GDP). However, farming systems in tropical and sub-tropical zones face intensifying operational challenges characterized by extreme climatic fluctuations, unseasonal precipitation events, rising temperature anomalies, depleting groundwater tables, and soil degradation.")
add_styled_para(doc, "Historically, agricultural decision-making relied upon empirical generational wisdom and broad regional forecasts broadcasted over radio or public television. In the modern era of climate volatility, traditional almanacs and district-level weather bulletins prove inadequate. A convective storm or heatwave can vary significantly across a distance of five kilometers. Consequently, precision agriculture—the science of utilizing geospatial sensors, meteorological telemetry, satellite remote sensing, and localized decision-support algorithms—has emerged as a vital paradigm to maximize crop yield, conserve irrigation water, minimize pesticide overuse, and enhance farm resilience.")
add_styled_para(doc, "This project develops an operational, full-stack Precision Agricultural Field Classification and Hyperlocal Advisory System named Agrostrat utilizing the MERN stack. The platform delivers real-time land verification, scientifically validated water balance modeling, and explainable daily action plans to optimize farming productivity.")

add_section_heading(doc, "1.2 Problem Definition & Statement in Precision Agriculture")
add_styled_para(doc, "Core Problem Statement: “Farmers require localized weather forecasts, rainfall predictions, drought warnings, irrigation recommendations, and crop advisories to improve agricultural productivity.”", bold=True, italic=True)
add_styled_para(doc, "Despite the proliferation of digital mobile applications, agricultural advisory services remain severely hindered by disconnected data pipelines, coarse geographic resolution, and a fundamental lack of land-surface verification:")
add_bullet(doc, "• Absence of Land Use Verification:", "Conventional agricultural apps blindly assume that any coordinate submitted by a user represents an active crop field. When a user queries a residential house, concrete roof, or commercial building in an urban center, existing systems erroneously generate fertilizer schedules, ploughing alerts, and flood irrigation guidelines for concrete surfaces.")
add_bullet(doc, "• Coarse Meteorological Resolution & Lack of Root-Zone Data:", "Weather forecasts are typically broadcast at 25-to-50 km grid intervals. Farmers receive generalized rain probabilities that fail to capture localized thunderstorm cells. Furthermore, surface air temperature alone fails to reveal root-zone soil water deficits (0–7 cm and 7–28 cm layers), which dictate actual crop drought stress.")
add_bullet(doc, "• Hallucinatory Generative Chatbots:", "Recent attempts to integrate black-box Large Language Models into farming apps suffer from unpredictable hallucinations—frequently inventing chemical dosages, mixing incompatible pesticides, or offering vague advice detached from real sensor readings.")
add_bullet(doc, "• Lack of Explainable Action Directives:", "Agronomic advice often consists of dense academic text without citing the underlying physical measurements that triggered the recommendation, eroding farmer trust.")

add_section_heading(doc, "1.3 Project Objectives")
add_bullet(doc, "1. Full-Stack MERN Architecture:", "Implement a responsive Single Page Application (SPA) using React.js 18 and Vite, coupled to a modular RESTful backend using Node.js and Express.js, backed by MongoDB Atlas.")
add_bullet(doc, "2. Automated Field vs. Residential Classification:", "Develop a multi-layered geospatial classifier combining OpenStreetMap (OSM) Overpass geometric querying, Sentinel-2 multispectral remote sensing indices (NDVI, NDMI, NDBI), and Chennai urban masks.")
add_bullet(doc, "3. Hyperlocal Telemetry Ingestion:", "Ingest real-time parameters including volumetric soil moisture across multiple strata (0–7 cm and 7–28 cm), soil temperature, air temperature, relative humidity, wind speed, and precipitation.")
add_bullet(doc, "4. Scientific Agronomic Engine (AgroEngine):", "Construct a deterministic calculation engine executing FAO-56 Penman-Monteith daily reference evapotranspiration (ET0) and fungal disease risk modeling.")
add_bullet(doc, "5. Explainable Today's Field Action Plan:", "Synthesize complex telemetry into three core operational directives—Irrigation Advice, Plant Protection, and Field Bund Work—featuring transparent Note citations.")

doc.add_page_break()

# ==========================================
# CHAPTER 4: SYSTEM DESIGN (WITH NAPKIN AI DIAGRAMS)
# ==========================================
add_heading_1(doc, "CHAPTER 4", "SYSTEM DESIGN")
add_section_heading(doc, "4.1 System Architecture Design")
add_styled_para(doc, "The system architecture employs a decoupled, multi-tier web architecture cleanly separating presentation, stateless application business logic, dedicated domain calculation services, and document persistence:")

add_image_figure(doc, os.path.join(screens_dir, "fig4_1_architecture.png"), "Figure 4.1: Multi-Tier System Architecture of Agrostrat (Napkin AI Style)")

add_section_heading(doc, "4.2 Detailed Module Descriptions")
add_bullet(doc, "• Module 1 — Land Classification Engine:", "Evaluates coordinates against Sentinel-2 multispectral indices (NDVI, NDMI, NDBI) and OpenStreetMap Overpass polygons.")
add_bullet(doc, "• Module 2 — Chennai Urban Boundary Mask:", "A specialized sub-kilometer geospatial module containing verified polygon bounds for urban Chennai neighborhoods.")
add_bullet(doc, "• Module 3 — Soil & Weather Gateway:", "An asynchronous gateway interfacing with Open-Meteo reanalysis APIs to fetch multi-depth soil moisture and meteorological telemetry.")
add_bullet(doc, "• Module 4 — AgroEngine (Water Balance & Disease):", "Computes daily reference evapotranspiration via FAO-56 Penman-Monteith and evaluates fungal pathogen incubation.")
add_bullet(doc, "• Module 5 — Action Card Dispatcher:", "Produces three actionable directives accompanied by an explainable Note citing exact physical telemetry values.")

add_section_heading(doc, "4.3 Use-Case Diagram & Interaction Analysis")
add_image_figure(doc, os.path.join(screens_dir, "fig4_2_usecase.png"), "Figure 4.2: Use-Case Diagram of Agrostrat Platform (Napkin AI Style)")

add_section_heading(doc, "4.4 Entity-Relationship (ER) Diagram & Data Model")
add_image_figure(doc, os.path.join(screens_dir, "fig4_3_er_diagram.png"), "Figure 4.3: Entity-Relationship (ER) Diagram & Schema (Napkin AI Style)")

add_section_heading(doc, "4.5 Component & Class Architecture Diagram")
add_image_figure(doc, os.path.join(screens_dir, "fig4_4_component_diagram.png"), "Figure 4.4: Software Component Architecture & Relationships (Napkin AI Style)")

add_section_heading(doc, "4.6 Sequence Diagram: Coordinate Ingestion & Decision Flow")
add_image_figure(doc, os.path.join(screens_dir, "fig4_5_sequence_diagram.png"), "Figure 4.5: Sequence Diagram of Coordinate Ingestion & Decision Flow (Napkin AI Style)")

doc.add_page_break()

# ==========================================
# CHAPTER 7: PROJECT SCREENSHOTS
# ==========================================
add_heading_1(doc, "CHAPTER 7", "PROJECT SCREENSHOTS")
add_section_heading(doc, "7.1 Verified Agricultural Field Verification (Kanchipuram Paddy)")
add_styled_para(doc, "Figure 7.1 illustrates the Land Verification Checker evaluating verified agricultural crop field coordinates in Kanchipuram, Tamil Nadu. The system correctly identifies the parcel as an Active Agricultural Crop Field with 96% confidence, rendering a prominent green verification card, telemetry diagnosis, and live physical sensor readings.")
add_image_figure(doc, os.path.join(screens_dir, "fig7_1_field_verification.png"), "Figure 7.1: Land Verification Engine Validating Active Paddy Crop Land in Kanchipuram with Live Telemetry")

add_section_heading(doc, "7.2 Residential House Land Detection (Chennai T. Nagar)")
add_styled_para(doc, "Figure 7.2 presents the land verification interface evaluating coordinates inside an urban residential neighborhood (T. Nagar, Chennai). The engine triggers the Chennai Urban Mask, correctly classifying the terrain as a Residential House / Concrete Terrain with 97% confidence and suppressing crop farming advisories.")
add_image_figure(doc, os.path.join(screens_dir, "fig7_2_residential_verification.png"), "Figure 7.2: Land Verification Engine Detecting Residential House Terrain in T. Nagar, Chennai")

add_section_heading(doc, "7.3 Today's Field Action Plan with Plain-Language Notes & Data")
add_styled_para(doc, "Figure 7.3 illustrates Today's Field Action Plan (Tab 2). It features the 3 core action cards—Irrigation Advice (Watering), Plant Protection (Pests), and Field Bund Work. Each card displays an actionable directive accompanied by a clean Note section citing the responsible measured numbers (Soil Moisture, Rain, Evaporation, Humidity, Temperature).")
add_image_figure(doc, os.path.join(screens_dir, "fig7_3_field_action_plan.png"), "Figure 7.3: Agrostrat Field Action Plan — 3 Core Action Cards with Plain-Language Notes & Real Measured Telemetry")

add_section_heading(doc, "7.4 7-Day Weather Forecast & Agronomic Operations Calendar")
add_styled_para(doc, "Figure 7.4 illustrates the 7-day weather outlook (Tab 3), featuring Lucide SVG weather condition icons, daily rainfall vs. FAO-56 reference evapotranspiration (ET0) water balance bars, and an operational pesticide spraying window calendar.")
add_image_figure(doc, os.path.join(screens_dir, "fig7_4_weather_outlook.png"), "Figure 7.4: 7-Day Weather Forecast, Evapotranspiration Water Balance & Spraying Window Calendar")

add_section_heading(doc, "7.5 Custom Coordinate Land Analyzer & Live GPS Ingestion")
add_styled_para(doc, "Figure 7.5 illustrates the expandable custom coordinate drawer allowing users to submit arbitrary geographical coordinates or trigger browser GPS location acquisition.")
add_image_figure(doc, os.path.join(screens_dir, "fig7_5_custom_coordinates.png"), "Figure 7.5: Interactive Custom Coordinate Drawer & Crop Selection Interface")

doc.add_page_break()

# ==========================================
# REFERENCES
# ==========================================
add_heading_1(doc, "REFERENCES")
refs = [
    "[1] R. G. Allen, L. S. Pereira, D. Raes, and M. Smith, 'Crop Evapotranspiration — Guidelines for Computing Crop Water Requirements,' FAO Irrigation and Drainage Paper 56, Food and Agriculture Organization of the United Nations, Rome, 1998.",
    "[2] M. Drusch et al., 'Sentinel-2: ESA's Optical High-Resolution Mission for GMES Operational Services,' Remote Sensing of Environment, vol. 120, pp. 25–36, 2012.",
    "[3] Indian Council of Agricultural Research (ICAR), 'Handbook of Agriculture: Facts and Figures for Farmers, Students and All Interested in Farming,' Directorate of Knowledge Management in Agriculture, New Delhi, 2021.",
    "[4] International Rice Research Institute (IRRI), 'Standard Evaluation System for Rice (SES) — Rice Blast (Pyricularia oryzae) Assessment Guidelines,' Los Baños, Philippines, 2014.",
    "[5] J. Vargas-Munoz et al., 'OpenStreetMap: Challenges and Opportunities in Machine Learning and Remote Sensing,' IEEE Geoscience and Remote Sensing Magazine, vol. 9, no. 1, pp. 184–199, 2021.",
    "[6] K. Patil et al., 'IoT and Machine Learning Driven Decision Support Architecture for Precision Irrigation Scheduling,' IEEE Transactions on AgriFood Electronics, vol. 1, no. 2, pp. 112–124, 2023.",
    "[7] European Space Agency (ESA), 'Copernicus Open Access Hub — Sentinel-1 SAR and Sentinel-2 MSI Technical User Handbook,' ESA Communications, Noordwijk, Netherlands, 2023.",
    "[8] Open-Meteo, 'Open-Source Weather Forecast API & Numerical Soil Moisture Models Documentation,' [Online]. Available: https://open-meteo.com/en/docs",
    "[9] Meta Platforms, Inc., 'React — A JavaScript Library for Building User Interfaces, Version 18.x,' 2024. [Online]. Available: https://react.dev/",
    "[10] OpenJS Foundation, 'Node.js — JavaScript Runtime Built on Chrome's V8 Engine, Version 22 LTS,' 2024. [Online]. Available: https://nodejs.org/",
    "[11] OpenJS Foundation, 'Express.js — Fast, Unopinionated, Minimalist Web Framework for Node.js, Version 4.x,' 2024.",
    "[12] MongoDB, Inc., 'MongoDB Documentation — Version 7.0 & 8.0 Cloud Manual,' 2024.",
    "[13] Automattic, Inc., 'Mongoose — Elegant MongoDB Object Modeling for Node.js, Version 8.x,' 2024.",
    "[14] Axios Contributors, 'Axios — Promise-Based HTTP Client for the Browser and Node.js, Version 1.x,' 2024.",
    "[15] Evan You et al., 'Vite — Next Generation Frontend Tooling, Version 5.x / 6.x,' 2024.",
    "[16] Lucide Contributors, 'Lucide Icons — Beautiful & Consistent SVG Icon Toolkit for Modern Web Applications,' 2024.",
    "[17] Department of Agriculture and Farmers Welfare, Ministry of Agriculture, 'National Mission on Sustainable Agriculture (NMSA) Guidelines,' New Delhi, 2022.",
    "[18] Tamil Nadu Agricultural University (TNAU), 'Crop Production Guide: Agriculture 2020,' Directorate of Agriculture, Coimbatore, 2020.",
    "[19] G. Balsamo et al., 'ERA5-Land: A state-of-the-art global reanalysis dataset for land applications,' Earth System Science Data, vol. 13, pp. 4349–4383, 2021.",
    "[20] Securities and Exchange Board of India (SEBI), 'Business Responsibility and Sustainability Reporting (BRSR) Framework,' Mumbai, 2021."
]

for ref in refs:
    add_styled_para(doc, ref, align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=10.5, space_after=6)

docx_path = os.path.join(base_dir, "Agrostrat_Project_Report_310624148101.docx")
doc.save(docx_path)
print(f"Successfully generated DOCX report at: {docx_path}")
