import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'uma-chave-secreta-muito-segura'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Configurações para integração com APIs externas (WhatsApp, Asana, etc.)
    WHATSAPP_API_URL = os.environ.get('WHATSAPP_API_URL')
    WHATSAPP_API_TOKEN = os.environ.get('WHATSAPP_API_TOKEN')
    ASANA_API_URL = os.environ.get('ASANA_API_URL')
    ASANA_API_TOKEN = os.environ.get('ASANA_API_TOKEN')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') # Para ChatGPT ou LLM
    OCR_API_URL = os.environ.get('OCR_API_URL') # Para Tesseract OCR ou Google Vision
    N8N_WEBHOOK_URL = os.environ.get('N8N_WEBHOOK_URL')


