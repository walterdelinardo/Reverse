from flask import Flask, send_from_directory
from flask_cors import CORS

# Importações de modelos
from src.models.user import db
from src.models.surgery import Surgery
from src.models.document import Document
from src.models.report import Report

# Importações de blueprints (rotas)
from src.routes.user import user_bp
from src.routes.surgery import surgery_bp
from src.routes.document import document_bp
from src.routes.report import report_bp
from src.routes.whatsapp import whatsapp_bp
from src.routes.asana import asana_bp

from config import Config
import os

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config.from_object(Config)

# Habilitar CORS para permitir acesso do frontend
CORS(app, origins="*")

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(surgery_bp, url_prefix='/api')
app.register_blueprint(document_bp, url_prefix='/api')
app.register_blueprint(report_bp, url_prefix='/api')
app.register_blueprint(whatsapp_bp, url_prefix='/api')
app.register_blueprint(asana_bp, url_prefix='/api')

# Configurar banco de dados
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)