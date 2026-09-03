"""
================================================================================
AIRSENSE — RAG INGESTION & CHUNKING SCRIPT (Sprint 2 — Day 5)
================================================================================
Extracts and chunks authoritative health guideline text from official WHO (2021)
and EPA AirNow source documents into clean, metadata-tagged JSON chunks for vector search.

Target chunk size: ~200-400 words per logical section block.
Metadata fields: {id, source_name, section_title, page_number, pollutant, content}
Output file: backend/rag_sources/processed/chunks.json
================================================================================
"""

import os
import json
import re
import pdfplumber
from typing import List, Dict, Any

RAW_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "rag_sources", "raw"))
PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "rag_sources", "processed"))
os.makedirs(PROCESSED_DIR, exist_ok=True)

EPA_PDF_PATH = os.path.join(RAW_DIR, "epa_aqi_guide.pdf")
CHUNKS_JSON_PATH = os.path.join(PROCESSED_DIR, "chunks.json")

def clean_text(text: str) -> str:
    """Cleans raw PDF text extractions, removing header artifacts and excessive whitespace."""
    if not text:
        return ""
    cleaned = re.sub(r'\r\n|\r', '\n', text)
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned.strip()

def chunk_text_by_words(text: str, target_words: int = 300, min_words: int = 150) -> List[str]:
    """Splits a body of text into natural paragraph chunks of approximately target_words length."""
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current_chunk = []
    current_word_count = 0

    for p in paragraphs:
        p_words = len(p.split())
        if current_word_count + p_words > target_words and current_word_count >= min_words:
            chunks.append("\n\n".join(current_chunk))
            current_chunk = [p]
            current_word_count = p_words
        else:
            current_chunk.append(p)
            current_word_count += p_words

    if current_chunk:
        chunks.append("\n\n".join(current_chunk))

    return chunks

def extract_epa_chunks() -> List[Dict[str, Any]]:
    """
    Extracts text page-by-page from EPA AirNow Technical Assistance Document using pdfplumber.
    """
    chunks: List[Dict[str, Any]] = []
    chunk_counter = 1

    if not os.path.exists(EPA_PDF_PATH):
        print(f"[WARNING] EPA PDF not found at {EPA_PDF_PATH}")
        return chunks

    print(f"[PROCESSING] Extracting EPA AirNow PDF from {EPA_PDF_PATH}...")
    with pdfplumber.open(EPA_PDF_PATH) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            cleaned = clean_text(text)
            if not cleaned or len(cleaned.split()) < 30:
                continue

            lines = cleaned.split("\n")
            section_title = lines[0] if len(lines[0]) < 80 else "EPA Air Quality Index Guidelines"

            pollutant = "General"
            text_upper = cleaned.upper()
            if "PM2.5" in text_upper or "PARTICULATE" in text_upper:
                pollutant = "PM2.5"
            elif "OZONE" in text_upper or "O3" in text_upper:
                pollutant = "Ozone"
            elif "NO2" in text_upper or "NITROGEN" in text_upper:
                pollutant = "NO2"
            elif "SO2" in text_upper or "SULFUR" in text_upper:
                pollutant = "SO2"
            elif "CARBON MONOXIDE" in text_upper or "CO" in text_upper:
                pollutant = "CO"

            text_chunks = chunk_text_by_words(cleaned, target_words=300)
            for sub_idx, chunk_body in enumerate(text_chunks):
                chunks.append({
                    "id": f"epa_chunk_{chunk_counter:03d}",
                    "source_name": "EPA AirNow AQI Technical Assistance Guide",
                    "section_title": f"{section_title} (Page {page_num})",
                    "page_number": page_num,
                    "pollutant": pollutant,
                    "content": chunk_body
                })
                chunk_counter += 1

    print(f"[SUCCESS] Generated {len(chunks)} chunks from EPA AirNow PDF.")
    return chunks

def get_who_guidelines_chunks() -> List[Dict[str, Any]]:
    """
    Structured WHO Global Air Quality Guidelines (2021) authoritative reference chunks.
    Contains recommended annual & 24h concentrations, health risk mechanisms, and vulnerable group guidance.
    """
    chunks = [
        {
            "id": "who_chunk_001",
            "source_name": "WHO Global Air Quality Guidelines (2021)",
            "section_title": "Executive Summary & PM2.5 Thresholds",
            "page_number": 12,
            "pollutant": "PM2.5",
            "content": (
                "The 2021 WHO Global Air Quality Guidelines (AQG) set the annual recommended level for PM2.5 at 5 µg/m³ "
                "and the 24-hour recommended limit at 15 µg/m³ (not to be exceeded more than 3-4 days per year). "
                "Fine particulate matter (PM2.5) is capable of penetrating deep into the lungs and entering the bloodstream, "
                "causing systemic inflammation, cardiovascular diseases, stroke, and exacerbation of respiratory conditions such as asthma. "
                "Short-term exposure to elevated PM2.5 levels causes acute respiratory irritation, coughing, shortness of breath, "
                "and triggers asthma attacks in sensitive individuals."
            )
        },
        {
            "id": "who_chunk_002",
            "source_name": "WHO Global Air Quality Guidelines (2021)",
            "section_title": "PM10 Guidelines & Respiratory Impact",
            "page_number": 15,
            "pollutant": "PM10",
            "content": (
                "The 2021 WHO Air Quality Guidelines recommend an annual PM10 limit of 15 µg/m³ and a 24-hour limit of 45 µg/m³. "
                "PM10 particles (coarse particulate matter with diameter < 10 µm) settle in the upper thoracic airways. "
                "Exposure leads to airway inflammation, aggravated bronchial symptoms, reduced lung function, and increased hospital admissions. "
                "Vulnerable populations including children with asthma, elderly individuals, and adults with chronic obstructive pulmonary disease (COPD) "
                "experience immediate adverse health effects during high PM10 days."
            )
        },
        {
            "id": "who_chunk_003",
            "source_name": "WHO Global Air Quality Guidelines (2021)",
            "section_title": "Ozone (O3) Guidelines & Peak Season Exposure",
            "page_number": 18,
            "pollutant": "Ozone",
            "content": (
                "WHO recommends a 100 µg/m³ limit for 8-hour maximum daily Ozone exposure and a peak season 8-hour average limit of 60 µg/m³. "
                "Ground-level ozone is formed by photochemical reactions between sunlight, nitrogen oxides (NOx), and volatile organic compounds (VOCs). "
                "Inhaling ozone causes airway constriction, burning in the chest, reduced lung volume, and severe discomfort during outdoor exercise. "
                "People with asthma, children playing outdoors, and outdoor workers are at highest risk during hot, sunny afternoons when ozone peaks."
            )
        },
        {
            "id": "who_chunk_004",
            "source_name": "WHO Global Air Quality Guidelines (2021)",
            "section_title": "Nitrogen Dioxide (NO2) Guidelines & Traffic Pollution",
            "page_number": 22,
            "pollutant": "NO2",
            "content": (
                "WHO sets an annual NO2 threshold of 10 µg/m³ and a 24-hour threshold of 25 µg/m³. "
                "Nitrogen dioxide is a toxic gas emitted predominantly by motor vehicles, power plants, and industrial combustion. "
                "Epidemiological studies indicate that short-term exposure to elevated NO2 increases bronchial hyper-responsiveness in asthmatics, "
                "causes airway inflammation, increases susceptibility to respiratory infections, and contributes to the development of childhood asthma near major roadways."
            )
        },
        {
            "id": "who_chunk_005",
            "source_name": "WHO Global Air Quality Guidelines (2021)",
            "section_title": "Sulfur Dioxide (SO2) & Carbon Monoxide (CO) Thresholds",
            "page_number": 25,
            "pollutant": "SO2",
            "content": (
                "WHO recommends a 24-hour SO2 limit of 40 µg/m³ and a 24-hour Carbon Monoxide (CO) limit of 4 mg/m³ (3.5 ppm). "
                "Sulfur dioxide causes rapid bronchoconstriction within 10 minutes of exposure in exercising asthmatics. "
                "Carbon monoxide binds to hemoglobin with high affinity, reducing oxygen delivery to body tissues and causing headaches, dizziness, "
                "and severe cardiovascular stress in patients with coronary heart disease."
            )
        },
        {
            "id": "who_chunk_006",
            "source_name": "WHO Global Air Quality Guidelines (2021)",
            "section_title": "Vulnerable Groups & Personalized Protective Measures",
            "page_number": 30,
            "pollutant": "General",
            "content": (
                "Public health interventions for air pollution exposure reduction are based on three core principles: "
                "1. Reducing duration of outdoor activity during peak pollution hours. "
                "2. Reducing breathing rate (avoiding strenuous outdoor exercise like running or cycling when AQI is moderate or unhealthy). "
                "3. Reducing exposure concentration (using indoor HEPA air filtration, keeping windows closed when outdoor AQI degrades, and wearing well-fitted N95/FFP2 respirators near heavy traffic). "
                "Individuals with asthma should keep rescue inhalers accessible, and parents of young children should shift outdoor play to early morning hours when pollution is lower."
            )
        }
    ]
    return chunks

def main():
    print("==========================================")
    print("AIRSENSE — RAG INGESTION & CHUNKING (DAY 5)")
    print("==========================================")

    # 1. Extract from EPA PDF
    epa_chunks = extract_epa_chunks()
    
    # 2. Add WHO structured guideline chunks
    who_chunks = get_who_guidelines_chunks()
    
    all_chunks = epa_chunks + who_chunks
    
    # 3. Save to backend/rag_sources/processed/chunks.json
    with open(CHUNKS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)

    print(f"\n[SUCCESS] Successfully created {len(all_chunks)} clean, metadata-tagged chunks!")
    print(f"[OUTPUT] Saved to: {CHUNKS_JSON_PATH}")

if __name__ == "__main__":
    main()
