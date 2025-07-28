from flask import Blueprint, request, jsonify, current_app
import requests
from datetime import datetime
from src.models.user import db
from src.models.surgery import Surgery

asana_bp = Blueprint('asana', __name__)

class AsanaService:
    def __init__(self):
        self.api_url = current_app.config.get('ASANA_API_URL', 'https://app.asana.com/api/1.0')
        self.api_token = current_app.config.get('ASANA_API_TOKEN')
        self.headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
    
    def create_task(self, surgery_data):
        """Criar tarefa no Asana para uma cirurgia"""
        try:
            task_data = {
                'data': {
                    'name': f"Reembolso - {surgery_data['patient_name']} - {surgery_data['surgery_type']}",
                    'notes': f"""
                    Paciente: {surgery_data['patient_name']}
                    CPF: {surgery_data['patient_cpf']}
                    Telefone: {surgery_data['patient_phone']}
                    Cirurgia: {surgery_data['surgery_type']}
                    Data da Cirurgia: {surgery_data['surgery_date']}
                    Médico: {surgery_data['doctor_name']}
                    Hospital: {surgery_data['hospital_name']}
                    Convênio: {surgery_data['insurance_company']}
                    """,
                    'projects': [current_app.config.get('ASANA_PROJECT_ID')],
                    'due_on': datetime.now().strftime('%Y-%m-%d')
                }
            }
            
            response = requests.post(
                f'{self.api_url}/tasks',
                headers=self.headers,
                json=task_data
            )
            
            if response.status_code == 201:
                return response.json()['data']['gid']
            else:
                print(f"Asana API error: {response.text}")
                return None
        
        except Exception as e:
            print(f"Error creating Asana task: {str(e)}")
            return None
    
    def update_task_status(self, task_id, status, notes=None):
        """Atualizar status da tarefa no Asana"""
        try:
            # Mapear status interno para status do Asana
            asana_status_map = {
                'pending': 'Not Started',
                'in_analysis': 'In Progress',
                'approved': 'Completed',
                'rejected': 'Completed',
                'completed': 'Completed'
            }
            
            update_data = {
                'data': {
                    'completed': status in ['approved', 'rejected', 'completed']
                }
            }
            
            if notes:
                update_data['data']['notes'] = notes
            
            response = requests.put(
                f'{self.api_url}/tasks/{task_id}',
                headers=self.headers,
                json=update_data
            )
            
            return response.status_code == 200
        
        except Exception as e:
            print(f"Error updating Asana task: {str(e)}")
            return False
    
    def add_comment(self, task_id, comment):
        """Adicionar comentário à tarefa"""
        try:
            comment_data = {
                'data': {
                    'text': comment
                }
            }
            
            response = requests.post(
                f'{self.api_url}/tasks/{task_id}/stories',
                headers=self.headers,
                json=comment_data
            )
            
            return response.status_code == 201
        
        except Exception as e:
            print(f"Error adding Asana comment: {str(e)}")
            return False

@asana_bp.route('/asana/create-task', methods=['POST'])
def create_asana_task():
    """Criar tarefa no Asana para uma cirurgia"""
    try:
        data = request.get_json()
        surgery_id = data['surgery_id']
        
        surgery = Surgery.query.get_or_404(surgery_id)
        
        asana_service = AsanaService()
        task_id = asana_service.create_task(surgery.to_dict())
        
        if task_id:
            surgery.asana_task_id = task_id
            db.session.commit()
            
            return jsonify({
                'message': 'Asana task created successfully',
                'task_id': task_id
            }), 201
        else:
            return jsonify({'error': 'Failed to create Asana task'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@asana_bp.route('/asana/update-task', methods=['PUT'])
def update_asana_task():
    """Atualizar tarefa no Asana"""
    try:
        data = request.get_json()
        surgery_id = data['surgery_id']
        status = data['status']
        notes = data.get('notes')
        
        surgery = Surgery.query.get_or_404(surgery_id)
        
        if not surgery.asana_task_id:
            return jsonify({'error': 'No Asana task associated with this surgery'}), 400
        
        asana_service = AsanaService()
        success = asana_service.update_task_status(surgery.asana_task_id, status, notes)
        
        if success:
            return jsonify({'message': 'Asana task updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update Asana task'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@asana_bp.route('/asana/add-comment', methods=['POST'])
def add_asana_comment():
    """Adicionar comentário à tarefa no Asana"""
    try:
        data = request.get_json()
        surgery_id = data['surgery_id']
        comment = data['comment']
        
        surgery = Surgery.query.get_or_404(surgery_id)
        
        if not surgery.asana_task_id:
            return jsonify({'error': 'No Asana task associated with this surgery'}), 400
        
        asana_service = AsanaService()
        success = asana_service.add_comment(surgery.asana_task_id, comment)
        
        if success:
            return jsonify({'message': 'Comment added successfully'}), 200
        else:
            return jsonify({'error': 'Failed to add comment'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@asana_bp.route('/asana/webhook', methods=['POST'])
def asana_webhook():
    """Webhook para receber atualizações do Asana"""
    try:
        data = request.get_json()
        
        # Processar eventos do Asana
        for event in data.get('events', []):
            if event['type'] == 'task' and event['action'] == 'changed':
                task_id = event['resource']['gid']
                
                # Encontrar cirurgia associada
                surgery = Surgery.query.filter_by(asana_task_id=task_id).first()
                
                if surgery:
                    # Atualizar status baseado no evento do Asana
                    # Implementar lógica específica conforme necessário
                    pass
        
        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

