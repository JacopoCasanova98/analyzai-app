from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=False)

class TextInput(BaseModel):
    text: str

@app.post("/analyze")
def analyze_text(input: TextInput):
    try:
        result = classifier(input.text)[0]
        return {
            "emotion": result['label'].lower(),
            "confidence": round(result['score'], 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
