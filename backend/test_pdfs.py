import requests
import sys

BASE_URL = "http://localhost:8082"

def test_pdfs():
    # Login Student to get token
    try:
        res = requests.post(f"{BASE_URL}/auth/login", data={"username": "teststudent@student.com", "password": "password123"})
        res.raise_for_status()
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
    except Exception as e:
        print(f"Auth failed: {e}. Please run test_e2e.py first to register the test account.")
        sys.exit(1)

    print("=" * 60)
    print("NCERT ALIVE - UPLOADING PDF TEST SAMPLES TO SIMPLIFIER")
    print("=" * 60)

    # 1. Document 1: Real Numbers (Class 10 Math)
    print("\n[Document 1] Real Numbers (Class 10 Math)")
    text_math = """
    REAL NUMBERS 1
    1.1 Introduction
    In Class IX, you began your exploration of the world of real numbers and encountered
    irrational numbers. We continue our discussion on real numbers in this chapter. We
    begin with very important properties of positive integers in Sections 1.2, namely the
    Euclid’s division algorithm and the Fundamental Theorem of Arithmetic.
    Euclid’s division algorithm, as the name suggests, has to do with divisibility of
    integers. Stated simply, it says any positive integer a can be divided by another positive
    integer b in such a way that it leaves a remainder r that is smaller than b.
    """
    try:
        payload = {
            "text": text_math,
            "language": "en",
            "class_level": 10,
            "subject": "math",
            "page_id": "test-pdf-real-numbers"
        }
        res = requests.post(f"{BASE_URL}/simplify", json=payload, headers=headers)
        res.raise_for_status()
        data = res.json()
        print(f"  [OK] Simplification successful!")
        print(f"  Detected Subject: {data.get('detected', {}).get('subject')}")
        print(f"  Detected Topic: {data.get('detected', {}).get('topic')}")
    except Exception as e:
        print(f"  [FAILED] Math PDF test: {e}")
        sys.exit(1)

    # 2. Document 2: Natural Resources Hindi (Class 8 Geography)
    print("\n[Document 2] Prakritik Sansadhan (Class 8 Geography - Hindi)")
    text_geo_hi = """
    Prakritik Sansadhan evam Unka Upayog.
    Samast chintansheel samajik vigyani is baat par spasht hain ki hamein kya karne ki avashyakta hai. Hamein samposhaniya arthvyavastha ki or badhna hoga.
    """
    try:
        payload = {
            "text": text_geo_hi,
            "language": "hi",
            "class_level": 8,
            "subject": "geography",
            "page_id": "test-pdf-geo-hi"
        }
        res = requests.post(f"{BASE_URL}/simplify", json=payload, headers=headers)
        res.raise_for_status()
        data = res.json()
        print(f"  [OK] Simplification successful!")
        print(f"  Detected Subject: {data.get('detected', {}).get('subject')}")
        print(f"  Detected Topic: {data.get('detected', {}).get('topic')}")
    except Exception as e:
        print(f"  [FAILED] Geography Hindi PDF test: {e}")
        sys.exit(1)

    # 3. Document 3: Natural Resources English (Class 8 Geography)
    print("\n[Document 3] Natural Resources and Their Use (Class 8 Geography - English)")
    text_geo_en = """
    Natural Resources and Their Use
    Concerned social scientists are clear on what we need to do: we must move toward a regenerative economy, an economy that operates in harmony with nature, repurposing used resources, minimizing waste, and replenishing depleted resources. We must return to the innate wisdom of nature herself, the ultimate regenerator and recycler of all resources.
    """
    try:
        payload = {
            "text": text_geo_en,
            "language": "en",
            "class_level": 8,
            "subject": "geography",
            "page_id": "test-pdf-geo-en"
        }
        res = requests.post(f"{BASE_URL}/simplify", json=payload, headers=headers)
        res.raise_for_status()
        data = res.json()
        print(f"  [OK] Simplification successful!")
        print(f"  Detected Subject: {data.get('detected', {}).get('subject')}")
        print(f"  Detected Topic: {data.get('detected', {}).get('topic')}")
    except Exception as e:
        print(f"  [FAILED] Geography English PDF test: {e}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("[SUCCESS] ALL UPLOADED PDF SAMPLES SIMPLIFIED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_pdfs()
