import os
import requests

RAW_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "rag_sources", "raw")
os.makedirs(RAW_DIR, exist_ok=True)

# Direct mirrors / URLs for WHO 2021 Guidelines & EPA AQI Guide
URLS = {
    "epa_aqi_guide.pdf": "https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf",
    "who_aqg_2021.pdf": "https://iris.who.int/rest/bitstreams/1374526/retrieve"
}

def download_pdf(filename: str, url: str):
    target_path = os.path.join(RAW_DIR, filename)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 100000:
        print(f"[EXISTS] {filename} already downloaded ({os.path.getsize(target_path) / (1024*1024):.2f} MB)")
        return True

    if os.path.exists(target_path):
        os.remove(target_path)

    print(f"[DOWNLOADING] {filename} from {url}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/pdf,application/octet-stream,*/*"
    }
    try:
        response = requests.get(url, headers=headers, timeout=60, stream=True, allow_redirects=True)
        response.raise_for_status()
        with open(target_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=16384):
                f.write(chunk)
        size_mb = os.path.getsize(target_path) / (1024 * 1024)
        print(f"[SUCCESS] Saved {filename} ({size_mb:.2f} MB)")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to download {filename}: {e}")
        return False

def main():
    for name, url in URLS.items():
        download_pdf(name, url)

if __name__ == "__main__":
    main()
