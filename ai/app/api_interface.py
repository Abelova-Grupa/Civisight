# api_server.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model_interface import GeminiClassifier as Classifier
import uvicorn
import base64
from data_processing import InfrastructureReport

# --- Pydantic modeli za striktnu validaciju ulaza ---
# Koristimo Pydantic za validaciju inputa preko API-ja
class ReportInput(BaseModel):
    image_base64: str
    description: str

# --- INICIJALIZACIJA ---
app = FastAPI(title="Infrastructure Classifier API")

# Učitavanje modela se vrši pri pokretanju servera (jednokratno)
try:
    classifier = Classifier()
except Exception as e:
    # Ako model ne uspe da se učita, server neće moći da radi
    print(f"Server se gasi zbog greške pri učitavanju modela: {e}")
    exit(1)

# --- RUTIRANJE ---

@app.get("/")
def read_root():
    return {"status": "OK", "model": "gemini-2.5-flash", "message": "Spreman za klasifikaciju."}

@app.post("/classify_report")
async def classify_report(report: ReportInput):
    """
    Prima Base64 sliku i opis, dekodira je i prosleđuje klasifikatoru.
    """

    try:
        # 1. Base64 Dekodiranje
        # Dekodirajte Base64 string u sirove bajtove
        image_bytes = base64.b64decode(report.image_base64)
    except Exception as e:
        # Vraćanje HTTP 400 (Bad Request) ako Base64 nije validan
        raise HTTPException(
            status_code=400,
            detail={"message": "image_base64 polje nije validan Base64 string.", "details": str(e)}
        )

    # 2. Kreiranje internog modela (InfrastructureReport)
    # Ovaj model ima polje 'image_bytes' koje klasifikator očekuje
    report_data_internal = InfrastructureReport(
        image_bytes=image_bytes,
        description=report.description
    )

    # 3. Prosleđivanje internog modela klasifikatoru
    report_data = classifier.run_classification(report_data_internal)

    # Provera da li je došlo do greške (ovo je vaš originalni kod)
    if "error" in report_data:
        print(f"Greška u klasifikaciji: {report_data}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Greška u obradi modela",
                "details": report_data.get("details", "Nema detalja.")
            }
        )

    return report_data

# --- POKRETANJE SERVERA ---
if __name__ == "__main__":
    # Koristite `reload=True` za razvoj, ali izbegavajte to u produkciji
    uvicorn.run("api_interface:app", host="0.0.0.0", port=8000)