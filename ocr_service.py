import os
import requests
from PIL import Image
import pytesseract

class OCRService:
    def __init__(self):
        self.tesseract_config = '--oem 3 --psm 6'
    
    def extract_text(self, file_path):
        """Extrair texto de uma imagem ou PDF usando OCR"""
        try:
            file_extension = os.path.splitext(file_path)[1].lower()
            
            if file_extension in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
                return self._extract_from_image(file_path)
            elif file_extension == '.pdf':
                return self._extract_from_pdf(file_path)
            else:
                return "Tipo de arquivo não suportado para OCR"
        
        except Exception as e:
            return f"Erro ao processar OCR: {str(e)}"
    
    def _extract_from_image(self, image_path):
        """Extrair texto de uma imagem"""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, config=self.tesseract_config, lang='por')
            return text.strip()
        except Exception as e:
            raise Exception(f"Erro ao processar imagem: {str(e)}")
    
    def _extract_from_pdf(self, pdf_path):
        """Extrair texto de um PDF (primeira página)"""
        try:
            # Para PDFs, seria necessário converter para imagem primeiro
            # Aqui é uma implementação simplificada
            from pdf2image import convert_from_path
            
            pages = convert_from_path(pdf_path, first_page=1, last_page=1)
            if pages:
                text = pytesseract.image_to_string(pages[0], config=self.tesseract_config, lang='por')
                return text.strip()
            else:
                return "Não foi possível converter o PDF"
        except Exception as e:
            raise Exception(f"Erro ao processar PDF: {str(e)}")
    
    def classify_document(self, ocr_text):
        """Classificar o tipo de documento baseado no texto OCR"""
        text_lower = ocr_text.lower()
        
        if 'guia' in text_lower and ('cirurgia' in text_lower or 'procedimento' in text_lower):
            return 'guide'
        elif 'carteira nacional de habilitação' in text_lower or 'cnh' in text_lower:
            return 'cnh'
        elif 'relatório médico' in text_lower or 'laudo' in text_lower:
            return 'medical_report'
        elif 'carteirinha' in text_lower or 'plano de saúde' in text_lower:
            return 'insurance_card'
        elif 'prontuário' in text_lower:
            return 'medical_record'
        else:
            return 'other'

