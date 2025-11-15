# test_classifier.py
import json
import os

# Koristimo novu klasu i strukturu podataka
from model_interface import GeminiClassifier as Classifier
from data_processing import InfrastructureReport

# NAPOMENA: Sada samo čitamo u bajtove, nema Base64 konverzije
def image_to_bytes(image_path: str) -> bytes:
    """Učitava sliku sa diska i vraća sirove bajtove."""
    try:
        with open(image_path, "rb") as f:
            return f.read()
    except FileNotFoundError:
        print(f"GREŠKA: Slika nije pronađena na putanji: {image_path}")
        return b""
    except Exception as e:
        print(f"Greška pri čitanju slike: {e}")
        return b""

def run_local_test(image_file: str, description: str, classifier: Classifier):
    """Izvršava test i ispisuje rezultat."""
    print("=" * 60)
    print(f"** POKRETANJE TESTA ZA: '{description[:40]}...' **")
    print(f"** Koristi se slika: {image_file} **")
    print("=" * 60)

    image_bytes = image_to_bytes(image_file)
    if not image_bytes:
        print("Test nije mogao da se pokrene zbog greške sa slikom.")
        return

    report = InfrastructureReport(
        image_bytes=image_bytes,
        description=description
    )

    result = classifier.run_classification(report)

    # 4. Ispis rezultata
    print("\n--- REZULTAT KLASIFIKACIJE ---")
    print(json.dumps(result, indent=4, ensure_ascii=False))
    print("------------------------------\n")

if __name__ == "__main__":

    # Putanja do vaše test slike (PROMENITE OVU PUTANJU!)
    TEST_IMAGE_PATH = "../test_images/image1.jpg"

    if not os.path.exists(TEST_IMAGE_PATH):
        print(f"Molimo kreirajte test sliku i sačuvajte je kao '{TEST_IMAGE_PATH}' u ovom direktorijumu.")
        # Ne možemo automatski kreirati lažnu sliku bez PIL, pa samo prekidamo
        exit()

    # Inicijalizacija klasifikatora (API klijent se inicijalizuje ovde)
    try:
        classifier_instance = Classifier()
    except Exception:
        print("Zaustavljanje testa zbog greške pri inicijalizaciji API klijenta.")
        exit()

    # --- TEST SCENARIJI ---

    test_description_1 = "Pukla cev"
    run_local_test(TEST_IMAGE_PATH, test_description_1, classifier_instance)