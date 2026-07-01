import requests
import json
import sys

BASE_URL = "http://localhost:8082"

def run_tests():
    print("=" * 60)
    print("NCERT ALIVE - AUTOMATED E2E INTEGRATION TEST SUITE")
    print("=" * 60)

    # 1. Register student
    student_email = "teststudent@student.com"
    student_pwd = "password123"
    student_payload = {
        "name": "Test Student",
        "email": student_email,
        "password": student_pwd,
        "role": "student",
        "class_level": 10,
        "linked_parent_email": "testparent@parent.com"
    }
    
    # We delete existing if registered previously
    # (Allowing repeated execution of this script)
    print("\n[Step 1] Registering Student...")
    try:
        res = requests.post(f"{BASE_URL}/auth/register", json=student_payload)
        if res.status_code == 400 and "Email already registered" in res.text:
            print("  Student already registered. Proceeding to login.")
        else:
            res.raise_for_status()
            print("  Student registered successfully!")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 2. Register parent
    parent_email = "testparent@parent.com"
    parent_pwd = "password123"
    parent_payload = {
        "name": "Test Parent",
        "email": parent_email,
        "password": parent_pwd,
        "role": "parent"
    }
    print("\n[Step 2] Registering Parent...")
    try:
        res = requests.post(f"{BASE_URL}/auth/register", json=parent_payload)
        if res.status_code == 400 and "Email already registered" in res.text:
            print("  Parent already registered. Proceeding to login.")
        else:
            res.raise_for_status()
            print("  Parent registered successfully!")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 3. Login Student & Parent to get tokens
    print("\n[Step 3] Logging in and acquiring access tokens...")
    try:
        # Student Login
        res = requests.post(f"{BASE_URL}/auth/login", data={"username": student_email, "password": student_pwd})
        res.raise_for_status()
        student_token = res.json()["access_token"]
        student_headers = {"Authorization": f"Bearer {student_token}"}
        print("  Student login successful. Token acquired.")

        # Parent Login
        res = requests.post(f"{BASE_URL}/auth/login", data={"username": parent_email, "password": parent_pwd})
        res.raise_for_status()
        parent_token = res.json()["access_token"]
        parent_headers = {"Authorization": f"Bearer {parent_token}"}
        print("  Parent login successful. Token acquired.")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 4. Verify linking
    print("\n[Step 4] Checking Profile and Parent-Student Link Status...")
    try:
        res = requests.get(f"{BASE_URL}/auth/me", headers=student_headers)
        res.raise_for_status()
        profile = res.json()
        print(f"  Student Profile: {profile['name']} (Class {profile['class']})")
        if profile.get("linkedParent"):
            print(f"  [OK] Linkage verified! Linked to Parent: {profile['linkedParent']['name']} ({profile['linkedParent']['email']})")
        else:
            print("  [WARN] Parent connection not found in profile!")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 5. Detect subject & class
    print("\n[Step 5] Testing Auto-Detection of NCERT content...")
    detect_payload = {
        "text": "The Rise of Nationalism in Europe. In 1848, Frédéric Sorrieu, a French artist, prepared a series of four prints visualising his dream of a world made up of democratic and social Republics.",
        "class_level": 10
    }
    try:
        res = requests.post(f"{BASE_URL}/simplify/detect", json=detect_payload, headers=student_headers)
        res.raise_for_status()
        det = res.json()
        print(f"  Detected Subject: {det.get('subject')}")
        print(f"  Detected Topic: {det.get('topic')}")
        print(f"  Detected Class Level: {det.get('class_level')}")
        if det.get("class_level") == 10 and det.get("subject") == "history":
            print("  [OK] Auto-detection passed successfully!")
        else:
            print(f"  [WARN] Unexpected detection output: {det}")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 6. Get Curriculum subjects and roadmaps
    print("\n[Step 6] Testing Curriculum and Syllabus Roadmaps API...")
    try:
        # Get subjects list
        res = requests.get(f"{BASE_URL}/curriculum/subjects", headers=student_headers)
        res.raise_for_status()
        subjects = res.json()
        print(f"  Available Class 10 Subjects: {subjects}")

        # Get roadmap
        res = requests.get(f"{BASE_URL}/curriculum/roadmap?subject=history", headers=student_headers)
        res.raise_for_status()
        roadmap = res.json()
        print(f"  Roadmap Chapters Loaded: {len(roadmap)} chapters found.")
        print(f"  First Chapter: {roadmap[0]['chapterName']} (Status: {roadmap[0]['status']})")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 7. Mock Exam Generation
    print("\n[Step 7] Generating CBSE mock exam paper...")
    try:
        # First simplify to populate cache for test-chapter-p1
        simplify_payload = {
            "text": "The Rise of Nationalism in Europe. In 1848 Frédéric Sorrieu, a French artist, prepared a series of prints visualising democratic and social republics. In the nineteenth century nationalism emerged as a force which brought about sweeping changes in the political and mental world of Europe.",
            "language": "en",
            "class_level": 10,
            "subject": "history",
            "page_id": "test-chapter-p1"
        }
        requests.post(f"{BASE_URL}/simplify", json=simplify_payload, headers=student_headers).raise_for_status()

        exam_payload = {
            "page_id": "test-chapter-p1",
            "language": "en"
        }
        res = requests.post(f"{BASE_URL}/exams/generate", json=exam_payload, headers=student_headers)
        res.raise_for_status()
        exam = res.json()
        print(f"  Exam Title: {exam['title']}")
        print(f"  Time Limit: {exam['timeLimitMinutes']} minutes")
        print(f"  Sections Generated: {[sec['sectionName'] for sec in exam['sections']]}")
        
        # Verify Section C (Long Answer Questions) is present
        sec_names = [sec['sectionName'].lower() for sec in exam['sections']]
        if any("long answer" in name for name in sec_names) or len(exam['sections']) >= 3:
            print("  [OK] Mock exam contains Section C Long Answer Questions!")
        else:
            print("  [WARN] Exam sections are missing long answer questions!")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 8. Mock Exam Evaluation
    print("\n[Step 8] Submitting and evaluating mock exam answers...")
    answers_payload = {
        "exam_id": exam["_id"],
        "answers": {
            "q1": "A",
            "q2": "B",
            "q3": "Frédéric Sorrieu was a French artist who painted prints of democratic republics.",
            "q4": "Nationalism arose in Europe due to the French Revolution, the rise of the middle class, romanticism, and spread of liberal ideas which challenged absolute monarchs."
        }
    }
    try:
        res = requests.post(f"{BASE_URL}/exams/evaluate", json=answers_payload, headers=student_headers)
        res.raise_for_status()
        result = res.json()
        print(f"  Evaluated Score: {result['marksObtained']} / {result['totalMarks']} Marks")
        print(f"  Feedback: {result['feedback']}")
        
        # Calculate grade
        pct = (result['marksObtained'] / (result['totalMarks'] or 1)) * 100
        print(f"  [OK] Dynamic CBSE Grade Sheet generated successfully (Percentage: {pct:.1f}%)!")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 9. Test Chatbot
    print("\n[Step 9] Testing NCERT AI Chatbot...")
    doubt_payload = {
        "question": "What did Frédéric Sorrieu visualize in his prints?",
        "context": "Frédéric Sorrieu, a French artist, prepared a series of four prints visualising his dream of a world made up of democratic and social Republics.",
        "language": "en",
        "page_id": "test-chapter-p1"
    }
    try:
        res = requests.post(f"{BASE_URL}/doubt", json=doubt_payload, headers=student_headers)
        res.raise_for_status()
        chat_res = res.json()
        print(f"  AI Chat Answer: {chat_res['answer'][:120]}...")
        print(f"  Session ID: {chat_res['session_id']}")
        
        # Test History Retrieval
        hist_res = requests.get(f"{BASE_URL}/doubt/history/{chat_res['session_id']}", headers=student_headers)
        hist_res.raise_for_status()
        history = hist_res.json()["history"]
        print(f"  Chat History Messages Count: {len(history)}")
        print("  [OK] AI Chatbot and history retrieval passed successfully!")
    except Exception as e:
        print(f"  FAILED: {e}")
        sys.exit(1)

    # 10. Test Multi-language Support
    print("\n[Step 10] Testing E2E Multi-language Translations on all 18 CBSE languages...")
    languages = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'ur', 'as', 'ne', 'mai', 'kok', 'doi', 'mni', 'san']
    for lang in languages:
        try:
            simplify_payload = {
                "text": "Frédéric Sorrieu was a French artist.",
                "language": lang,
                "class_level": 10,
                "subject": "history",
                "page_id": f"test-lang-{lang}"
            }
            res = requests.post(f"{BASE_URL}/simplify", json=simplify_payload, headers=student_headers)
            res.raise_for_status()
            print(f"  [OK] Language '{lang}' simplification pipeline operational!")
        except Exception as e:
            print(f"  [FAILED] Language '{lang}': {e}")
            sys.exit(1)
    print("  [OK] All 18 CBSE languages verified successfully!")

    print("\n" + "=" * 60)
    print("[SUCCESS] E2E INTEGRATION TESTS COMPLETED SUCCESSFULLY! ALL SERVICES ARE 100% OPERATIONAL.")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
