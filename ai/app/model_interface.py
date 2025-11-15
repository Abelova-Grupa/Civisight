# model_interface.py
import os
from google import genai
from google.genai import types
from typing import Dict, Any
from dotenv import load_dotenv

# Uvozimo novu strukturu podataka
from data_processing import clean_and_parse_json, InfrastructureReport

load_dotenv("../gemini.env")
API_KEY = os.getenv("API_KEY")
MODEL_ID = os.getenv("MODEL_ID")

class GeminiClassifier:
    """
    Klasa za interakciju sa Gemini API-jem za klasifikaciju i verifikaciju.
    """

    def __init__(self):
        print(f"Inicijalizacija Gemini klijenta za model '{MODEL_ID}'...")
        try:
            self.client = genai.Client(api_key=API_KEY)
            print("Gemini klijent uspešno inicijalizovan.")
        except Exception as e:
            print(f"FATALNA GREŠKA pri inicijalizaciji Gemini klijenta: {e}")
            self.client = None
            raise

    def _create_prompt(self, user_description: str) -> str:
        """Kreira striktno uputstvo za Gemini model."""

        # Koristimo vaš predloženi prompt i formatiranje
        prompt = f"""
        You are an infrastructure problem reviewer.
        Your were given the image and following description: \n{user_description}\n 
        Your task is to determine whether the description depicts what is on the image. 
        If it is not, just return {{"status": "BAD_REQUEST"}}. 
        If the description is related to the image, you also need to determine the request's priority, and classify it. 
        Priority can be LOW, MEDIUM, HIGH. Class is a type of infrastructral problem. 
        You need to respond in a JSON format {{"status": "OK", "classification": "[class you choose]", "priority": "[priority you choose]"}}
        """
        return prompt.strip()

    def run_classification(self, report_data: InfrastructureReport) -> Dict[str, Any]:
        """Izvršava klasifikaciju pozivanjem Gemini API-ja."""

        if self.client is None:
            return {"error": "Gemini klijent nije inicijalizovan."}

        try:
            # 1. Kreiranje prompta
            prompt_tekst = self._create_prompt(report_data.description)

            # 2. Sastavljanje sadržaja (slika + tekst)
            contents = [
                types.Part.from_bytes(
                    data=report_data.image_bytes,
                    mime_type="image/jpeg"  # Pretpostavljamo JPEG, ali bi trebalo da bude dinamično
                ),
                prompt_tekst
            ]

            # 3. Pozivanje API-ja
            print("\n--- Pozivanje Gemini API-ja... ---")
            response = self.client.models.generate_content(
                model=MODEL_ID,
                contents=contents
            )

            # 4. Parsiranje JSON-a
            generated_text = response.text
            return clean_and_parse_json(generated_text)

        except Exception as e:
            return {"error": "Greška u pozivu Gemini API-ja ili obradi.",
                    "details": str(e),
                    "raw_output": generated_text if 'generated_text' in locals() else "N/A"}