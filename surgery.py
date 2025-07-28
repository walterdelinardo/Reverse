from datetime import datetime
from src.models.user import db

class Surgery(db.Model):
    __tablename__ = 'surgeries'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(100), nullable=False)
    patient_cpf = db.Column(db.String(14), nullable=False)
    patient_phone = db.Column(db.String(20), nullable=False)
    surgery_type = db.Column(db.String(100), nullable=False)
    surgery_date = db.Column(db.DateTime, nullable=False)
    doctor_name = db.Column(db.String(100), nullable=False)
    hospital_name = db.Column(db.String(100), nullable=False)
    insurance_company = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, in_analysis, approved, rejected, completed
    reimbursement_amount = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    asana_task_id = db.Column(db.String(100), nullable=True)  # ID da tarefa no Asana
    
    # Relacionamento com documentos
    documents = db.relationship('Document', backref='surgery', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_name': self.patient_name,
            'patient_cpf': self.patient_cpf,
            'patient_phone': self.patient_phone,
            'surgery_type': self.surgery_type,
            'surgery_date': self.surgery_date.isoformat() if self.surgery_date else None,
            'doctor_name': self.doctor_name,
            'hospital_name': self.hospital_name,
            'insurance_company': self.insurance_company,
            'status': self.status,
            'reimbursement_amount': self.reimbursement_amount,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'asana_task_id': self.asana_task_id,
            'documents': [doc.to_dict() for doc in self.documents]
        }

