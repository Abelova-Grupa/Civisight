# api_server.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model_interface import GeminiClassifier as Classifier
import uvicorn

# --- Pydantic modeli za striktnu validaciju ulaza ---
# Koristimo Pydantic za validaciju inputa preko API-ja
class ReportInput(BaseModel):
    image_base64: str
    description: str

# --- INICIJALIZACIJA ---
app = FastAPI(title="Infrastructure VLM Classifier API")

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
    return {"status": "OK", "model": "SmolVLM-Instruct", "message": "Spreman za klasifikaciju."}

@app.post("/classify_report")
async def classify_report(report: ReportInput):
    """
    Prima Base64 sliku i opis, vraća klasifikaciju i prioritet.
    """

    # Konvertovanje Pydantic modela u naš interni model
    report_data = classifier.run_classification(report)

    # Provera da li je došlo do greške
    if "error" in report_data:
        print(f"Greška u klasifikaciji: {report_data}")
        # Vraćanje HTTP 500 ako je model generisao neparsirani JSON ili neku internu grešku
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
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000)