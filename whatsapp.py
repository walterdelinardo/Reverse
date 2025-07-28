from flask import Blueprint, request, jsonify, current_app
import requests
import json
from src.models.user import db
from src.models.surgery import Surgery
from src.services.ai_service import AIService

whatsapp_bp = Blueprint('whatsapp', __name__)

@whatsapp_bp.route('/whatsapp/webhook', methods=['GET'])
def verify_webhook():
    """Verificação do webhook do WhatsApp"""
    verify_token = current_app.config.get('WHATSAPP_VERIFY_TOKEN', 'meu_token_secreto')
    
    if request.args.get('hub.verify_token') == verify_token:
        return request.args.get('hub.challenge')
    else:
        return 'Verification token mismatch', 403

@whatsapp_bp.route('/whatsapp/webhook', methods=['POST'])
def handle_webhook():
    """Processar mensagens recebidas do WhatsApp"""
    try:
        data = request.get_json()
        
        # Processar mensagens recebidas
        if 'messages' in data.get('entry', [{}])[0].get('changes', [{}])[0].get('value', {}):
            messages = data['entry'][0]['changes'][0]['value']['messages']
            
            for message in messages:
                phone_number = message['from']
                message_type = message['type']
                
                if message_type == 'text':
                    text_content = message['text']['body']
                    response = process_text_message(phone_number, text_content)
                    send_whatsapp_message(phone_number, response)
                
                elif message_type in ['image', 'document']:
                    media_id = message[message_type]['id']
                    response = process_media_message(phone_number, media_id, message_type)
                    send_whatsapp_message(phone_number, response)
        
        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def process_text_message(phone_number, text):
    """Processar mensagem de texto usando IA"""
    try:
        ai_service = AIService()
        
        # Verificar se é uma consulta sobre status
        if any(keyword in text.lower() for keyword in ['status', 'andamento', 'reembolso', 'cirurgia']):
            # Buscar cirurgias do paciente pelo telefone
            surgeries = Surgery.query.filter_by(patient_phone=phone_number).all()
            
            if surgeries:
                latest_surgery = surgeries[-1]  # Pegar a mais recente
                return f"Olá! Sua cirurgia de {latest_surgery.surgery_type} está com status: {latest_surgery.status}. "
            else:
                return "Não encontramos nenhuma cirurgia cadastrada para este número. Entre em contato conosco para mais informações."
        
        # Usar IA para responder outras perguntas
        response = ai_service.generate_response(text, phone_number)
        return response
    
    except Exception as e:
        return "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns minutos."

def process_media_message(phone_number, media_id, media_type):
    """Processar mensagem com mídia (imagem/documento)"""
    try:
        # Baixar mídia do WhatsApp
        media_url = get_media_url(media_id)
        
        if media_url:
            # Aqui você salvaria o arquivo e processaria com OCR
            return "Documento recebido com sucesso! Estamos processando e em breve entraremos em contato."
        else:
            return "Não foi possível processar o documento. Tente enviar novamente."
    
    except Exception as e:
        return "Erro ao processar documento. Tente novamente."

def get_media_url(media_id):
    """Obter URL da mídia do WhatsApp"""
    try:
        api_url = current_app.config.get('WHATSAPP_API_URL')
        api_token = current_app.config.get('WHATSAPP_API_TOKEN')
        
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(f'{api_url}/{media_id}', headers=headers)
        
        if response.status_code == 200:
            return response.json().get('url')
        
        return None
    
    except Exception as e:
        print(f"Error getting media URL: {str(e)}")
        return None

def send_whatsapp_message(phone_number, message):
    """Enviar mensagem via WhatsApp"""
    try:
        api_url = current_app.config.get('WHATSAPP_API_URL')
        api_token = current_app.config.get('WHATSAPP_API_TOKEN')
        
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'messaging_product': 'whatsapp',
            'to': phone_number,
            'type': 'text',
            'text': {
                'body': message
            }
        }
        
        response = requests.post(f'{api_url}/messages', 
                               headers=headers, 
                               json=payload)
        
        return response.status_code == 200
    
    except Exception as e:
        print(f"Error sending WhatsApp message: {str(e)}")
        return False

@whatsapp_bp.route('/whatsapp/send', methods=['POST'])
def send_message():
    """Endpoint para enviar mensagens via API"""
    try:
        data = request.get_json()
        phone_number = data['phone_number']
        message = data['message']
        
        success = send_whatsapp_message(phone_number, message)
        
        if success:
            return jsonify({'status': 'Message sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send message'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

