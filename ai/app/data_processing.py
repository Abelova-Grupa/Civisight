# data_processing.py
import json
from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class InfrastructureReport:
    """Struktura podataka za prijavljeni problem."""
    image_bytes: bytes  # Promena: Prima sirove bajtove slike
    description: str

def clean_and_parse_json(raw_text: str) -> Dict[str, Any]:
    """
    Pokušava da očisti i parsira JSON iz teksta, tolerišući nečist izlaz.
    (Iako Gemini-2.5-Flash obično vraća čist JSON)
    """
    try:
        # Pokušavamo da nađemo prvi i poslednji JSON blok ({...})
        start = raw_text.find('{')
        end = raw_text.rfind('}')

        if start != -1 and end != -1:
            json_str = raw_text[start:end + 1]
            return json.loads(json_str)

        # Ako je izlaz neupotrebljiv, vraćamo sirovi tekst.
        return {"error": "JSONDecodeError", "details": "Model nije vratio ispravan JSON format.",
                "raw_output": raw_text}

    except json.JSONDecodeError as e:
        return {"error": "JSONDecodeError", "details": str(e), "raw_output": raw_text}