import openai
import os
from flask import current_app

class AIService:
    def __init__(self):
        self.client = openai.OpenAI(
            api_key=os.environ.get('OPENAI_API_KEY'),
            base_url=os.environ.get('OPENAI_API_BASE', 'https://api.openai.com/v1')
        )
    
    def generate_response(self, user_message, phone_number):
        """Gerar resposta usando ChatGPT/LLM"""
        try:
            system_prompt = """
            Você é um assistente virtual da REVERSE, uma empresa especializada em gestão de cirurgias e reembolso.
            
            Suas responsabilidades:
            - Ajudar pacientes com dúvidas sobre reembolso de cirurgias
            - Orientar sobre documentação necessária
            - Fornecer informações sobre status de processos
            - Ser sempre cordial, profissional e prestativo
            
            Tipos de documentos necessários:
            - Guia médica
            - CNH ou RG
            - Carteirinha do plano de saúde
            - Relatórios médicos
            - Laudos
            
            Se o paciente perguntar sobre status, oriente-o a fornecer CPF ou nome completo.
            Se precisar de documentos, explique quais são necessários e como enviar.
            
            Mantenha as respostas concisas e úteis.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"AI Service error: {str(e)}")
            return "Olá! Sou o assistente da REVERSE. Como posso ajudá-lo com seu reembolso de cirurgia hoje?"
    
    def classify_intent(self, message):
        """Classificar a intenção da mensagem"""
        try:
            system_prompt = """
            Classifique a intenção da mensagem do usuário em uma das categorias:
            - status_inquiry: pergunta sobre status do reembolso
            - document_submission: envio de documentos
            - general_question: pergunta geral sobre processo
            - complaint: reclamação ou problema
            - greeting: cumprimento ou saudação
            
            Responda apenas com a categoria.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=50,
                temperature=0.1
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"Intent classification error: {str(e)}")
            return "general_question"
    
    def extract_patient_info(self, message):
        """Extrair informações do paciente da mensagem"""
        try:
            system_prompt = """
            Extraia as seguintes informações da mensagem, se disponíveis:
            - Nome completo
            - CPF
            - Telefone
            - Tipo de cirurgia
            - Data da cirurgia
            - Nome do médico
            - Hospital
            
            Retorne em formato JSON. Se alguma informação não estiver disponível, use null.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=200,
                temperature=0.1
            )
            
            import json
            return json.loads(response.choices[0].message.content.strip())
        
        except Exception as e:
            print(f"Info extraction error: {str(e)}")
            return {}
    
    def generate_report_summary(self, surgeries_data):
        """Gerar resumo de relatório usando IA"""
        try:
            system_prompt = """
            Gere um resumo executivo baseado nos dados de cirurgias fornecidos.
            Inclua:
            - Total de cirurgias
            - Status dos processos
            - Valores de reembolso
            - Principais insights
            
            Seja conciso e profissional.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": str(surgeries_data)}
                ],
                max_tokens=500,
                temperature=0.5
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"Report generation error: {str(e)}")
            return "Erro ao gerar resumo do relatório."

