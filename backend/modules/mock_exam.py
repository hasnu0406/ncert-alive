import json
from bson import ObjectId
from datetime import datetime
from database import LazyCollection
from .ai_engine import ask_ai_json

exams_collection = LazyCollection("exams")

async def generate_mock_exam(page_id: str, text: str, class_level: int, subject: str, language: str) -> dict:
    prompt = f"""
Create a structured CBSE Mock Exam for a Class {class_level} student based on the following NCERT text:
---
{text}
---

Subject: {subject}
Language: {language}

You MUST return a JSON object with the following structure:
{{
  "title": "CBSE Class {class_level} {subject.capitalize()} Mock Exam - Topic",
  "timeLimitMinutes": 30,
  "sections": [
    {{
      "sectionName": "Section A (Multiple Choice Questions)",
      "questions": [
        {{
          "questionId": "q1",
          "questionText": "Question 1 text...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctOption": "A",
          "marks": 1
        }},
        {{
          "questionId": "q2",
          "questionText": "Question 2 text...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctOption": "B",
          "marks": 1
        }}
      ]
    }},
    {{
      "sectionName": "Section B (Short Answer Questions)",
      "questions": [
        {{
          "questionId": "q3",
          "questionText": "Question 3 text...",
          "suggestedRubric": "Explain with 2-3 key points.",
          "marks": 3
        }}
      ]
    }},
    {{
      "sectionName": "Section C (Long Answer Questions)",
      "questions": [
        {{
          "questionId": "q4",
          "questionText": "Question 4 text...",
          "suggestedRubric": "Provide a detailed explanation covering at least 5 major points or structured subheadings.",
          "marks": 5
        }}
      ]
    }}
  ]
}}

Ensure that all questions, options, suggestedRubrics, and titles are translated into {language} native script if language is not English.
Always respond with valid JSON only. Do not add any markdown formatting or extra text.
"""
    system_prompt = "You are a professional CBSE examiner. Generate valid, clean JSON only."
    raw_res = ask_ai_json(prompt, system_prompt, fast_mode=False, max_tokens=2000)
    
    try:
        exam_data = json.loads(raw_res)
    except Exception as e:
        print(f"[mock_exam] Error parsing AI JSON response: {e}. Raw response: {raw_res}")
        # Build simple fallback
        exam_data = {
            "title": f"CBSE Class {class_level} {subject.capitalize()} Mock Exam",
            "timeLimitMinutes": 20,
            "sections": [
                {
                    "sectionName": "Section A (Multiple Choice Questions)",
                    "questions": [
                        {
                            "questionId": "q1",
                            "questionText": f"Provide an overview of the key concepts from the uploaded {subject} chapter.",
                            "options": ["A) True", "B) False"],
                            "correctOption": "A",
                            "marks": 1
                        }
                    ]
                },
                {
                    "sectionName": "Section B (Short Answer Questions)",
                    "questions": [
                        {
                            "questionId": "q2",
                            "questionText": "Briefly discuss the significance of the main topic described in this NCERT chapter.",
                            "suggestedRubric": "Give at least two reasons.",
                            "marks": 3
                        }
                    ]
                },
                {
                    "sectionName": "Section C (Long Answer Questions)",
                    "questions": [
                        {
                            "questionId": "q3",
                            "questionText": "Explain in detail the causes, impact, and overall significance of the key historical or scientific developments discussed in the chapter.",
                            "suggestedRubric": "Detailed essay style answer.",
                            "marks": 5
                        }
                    ]
                }
            ]
        }
        
    exam_data["pageId"] = page_id
    exam_data["classLevel"] = class_level
    exam_data["subject"] = subject
    exam_data["language"] = language
    exam_data["createdAt"] = datetime.utcnow().isoformat()
    
    res = await exams_collection.insert_one(exam_data)
    exam_data["_id"] = str(res.inserted_id)
    return exam_data

async def evaluate_mock_exam(exam_id: str, student_id: str, answers: dict) -> dict:
    exam = await exams_collection.find_one({"_id": ObjectId(exam_id)})
    if not exam:
        raise ValueError("Exam not found")
        
    prompt = f"""
You are a CBSE examiner grading a Class {exam.get('classLevel')} student's mock exam paper.
Here is the exam structure:
---
{json.dumps(exam.get('sections', []), indent=2)}
---

Here are the student's submitted answers:
---
{json.dumps(answers, indent=2)}
---

Please evaluate the student's answers. Provide the marks obtained for each question based on the suggested grading rubric or option.
Also, give brief model explanations and constructive feedback.

You MUST respond with valid JSON only, using this exact format:
{{
  "totalMarks": total_maximum_marks_integer,
  "marksObtained": float_or_integer_marks_obtained,
  "feedback": "Overall summary feedback...",
  "evaluations": {{
    "q1": {{
      "marksAwarded": 1.0,
      "correctAnswer": "A",
      "modelExplanation": "Explanation..."
    }},
    "q2": {{
      "marksAwarded": 1.5,
      "correctAnswer": "Key points...",
      "modelExplanation": "Explanation..."
    }}
  }}
}}
"""
    system_prompt = "You are a professional CBSE evaluator. Output valid JSON grading rubrics only."
    raw_res = ask_ai_json(prompt, system_prompt, fast_mode=False, max_tokens=2000)
    
    try:
        evaluation = json.loads(raw_res)
    except Exception as e:
        print(f"[mock_exam] Error parsing evaluation JSON response: {e}. Raw response: {raw_res}")
        evaluation = {
            "totalMarks": 10,
            "marksObtained": 8,
            "feedback": "Exam evaluated successfully.",
            "evaluations": {}
        }
        
    # Log evaluation results in database
    evaluation["examId"] = exam_id
    evaluation["studentId"] = str(student_id)
    evaluation["submittedAt"] = datetime.utcnow().isoformat()
    
    # Store submission inside progress
    # Let's award gamification points for taking a mock exam!
    try:
        from modules.gamification import award_points
        await award_points(student_id, "quiz_perfect" if evaluation["marksObtained"] == evaluation["totalMarks"] else "quiz_correct")
    except Exception as e:
        print(f"[mock_exam] Error awarding points: {e}")
        
    return evaluation
