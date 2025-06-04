# db_create.py
from app import app
from models import db

with app.app_context():
    db.create_all()
    print("Banco de dados e tabelas criados com sucesso.")

