# api_interface.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model_interface import GeminiClassifier as Classifier
import uvicorn
import base64

from data_processing import InfrastructureReport
from solana_interface import (
    create_report_sync,
    vote_sync,
    get_report_sync,
)

from typing import List
from solidity_interface import create_report_on_chain, get_reports_from_chain


# --- Pydantic modeli za striktnu validaciju ulaza ---


class ReportInput(BaseModel):
    image_base64: str
    description: str


class SolanaReportPayload(BaseModel):
    """
    Payload za kreiranje reporta na Solani.
    report_seed: proizvoljan ID (npr. hash slike ili kombinacija timestampa i random sufiksa)
    user_id:     identifikator korisnika u vašem sistemu (off-chain, ne koristi se on-chain)
    """
    report_seed: str
    user_id: str


class VotePayload(BaseModel):
    """
    Payload za glasanje za postojeći report.
    vote: 1 = upvote, 2 = downvote (u skladu sa Anchor error porukom)
    """
    report_id: str
    user_id: str  # off-chain identifikator; on-chain glasa uvek backend wallet
    vote: int

class ReportIn(BaseModel):
    lat: float
    lon: float
    priority: int


class ReportOut(BaseModel):
    lat: float
    lon: float
    priority: int
    createdAt: int
    reporter: str

# --- INICIJALIZACIJA ---

app = FastAPI(title="Infrastructure Classifier API")

# Učitavanje modela se vrši pri pokretanju servera (jednokratno)
try:
    classifier = Classifier()
except Exception as e:
    print(f"Server se gasi zbog greške pri učitavanju modela: {e}")
    raise


# --- RUTIRANJE ---


@app.get("/")
def read_root():
    return {
        "status": "OK",
        "model": "gemini-2.5-flash",
        "message": "Spreman za klasifikaciju.",
    }


@app.post("/classify_report")
async def classify_report(report: ReportInput):
    """
    Prima Base64 sliku i opis, dekodira je i prosleđuje klasifikatoru.
    """
    try:
        image_bytes = base64.b64decode(report.image_base64)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "image_base64 polje nije validan Base64 string.",
                "details": str(e),
            },
        )

    report_data_internal = InfrastructureReport(
        image_bytes=image_bytes,
        description=report.description,
    )

    report_data = classifier.run_classification(report_data_internal)

    if isinstance(report_data, dict) and "error" in report_data:
        print(f"Greška u klasifikaciji: {report_data}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Greška u obradi modela.",
                "details": report_data.get("details", "Nema detalja."),
            },
        )

    return report_data


@app.post("/solana/report")
def create_report(payload: SolanaReportPayload):
    """
    Kreira novi izveštaj (Report account) na Solana blockchainu bez opisa i URL-a fotografije.
    On-chain se koristi samo `report_seed` (kao PDA seed) i backend wallet kao kreator.
    """
    report_seed = payload.report_seed
    # user_id se ne koristi on-chain, ali je ostavljen zbog validacije i korelacije sa off-chain sistemom
    user_id = payload.user_id
    print(f"Kreiranje reporta za user_id={user_id}, report_seed={report_seed}")

    try:
        tx_sig = create_report_sync(report_seed)
        return {"status": "ok", "report_seed": report_seed, "tx": tx_sig}
    except Exception as e:
        print(f"Greška pri kreiranju Solana izveštaja: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Greška pri kreiranju Solana izveštaja.",
                "details": str(e),
            },
        )


@app.post("/solana/vote")
def vote(payload: VotePayload):
    """
    Glasanje za postojeći report.
    On-chain se kao glasač koristi backend wallet; `user_id` služi samo za vašu evidenciju.
    """
    report_id = payload.report_id
    user_id = payload.user_ida
    vote_type = int(payload.vote)

    if vote_type not in (1, 2):
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Nevažeći tip glasa. Dozvoljeno je 1 (upvote) ili 2 (downvote)."
            },
        )

    print(f"Glasanje user_id={user_id}, report_id={report_id}, vote_type={vote_type}")

    try:
        tx_sig = vote_sync(report_id, vote_type)
        return {"status": "ok", "tx": tx_sig}
    except Exception as e:
        print(f"Greška pri glasanju na Solani: {e}")
        raise HTTPException(
            status_code=500,
            detail={"message": "Greška pri glasanju na Solani.", "details": str(e)},
        )


@app.get("/solana/report/{report_id}")
def get_report(report_id: str):
    """
    Vraća sadržaj Report account-a za dati `report_id` (seed).
    """
    try:
        result = get_report_sync(report_id)
        return result
    except Exception as e:
        print(f"Greška pri čitanju Solana izveštaja: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Greška pri čitanju Solana izveštaja.",
                "details": str(e),
            },
        )

@app.post("/solidity/report")
def create_report(report: ReportIn):
    """
    Prima JSON od AI/backend-a i šalje novi report na blockchain.
    """
    result = create_report_on_chain(
        lat=report.lat,
        lon=report.lon,
        priority=report.priority,
    )

    return {
        "status": "ok",
        "tx_hash": result["tx_hash"],
        "blockNumber": result["blockNumber"],
    }


@app.get("/solidity/reports", response_model=List[ReportOut])
def get_reports():
    """
    Vraća sve report-ove iz Solidity kontrakta u čistom JSON obliku.
    """
    raw = get_reports_from_chain()
    # FastAPI + Pydantic će sam mapirati dict -> ReportOut
    return raw


# --- POKRETANJE SERVERA ---
if __name__ == "__main__":
    uvicorn.run("api_interface:app", host="0.0.0.0", port=8000)
