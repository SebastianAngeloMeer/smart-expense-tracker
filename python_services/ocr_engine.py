import sys
import pytesseract
from PIL import Image
import re
import json

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_data(image_path):
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img)
        
        amounts = re.findall(r'[\d,]+\.\d{2}', text)
        
        clean_amounts = []
        for a in amounts:
            clean_amounts.append(float(a.replace(',', '')))

        total = max(clean_amounts) if clean_amounts else 0.0

        result = {
            "total": total,
            "currency": "PHP", 
            "status": "success"
        }
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e), "status": "error"}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        extract_data(sys.argv[1])