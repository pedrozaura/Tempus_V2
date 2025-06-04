from extensions import db
from datetime import datetime

class Weather(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100), nullable=False)
    temperature = db.Column(db.Float)
    condition = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "city": self.city,
            "temperature": self.temperature,
            "condition": self.condition
        }

class Alert(db.Model):  # NOVO MODELO
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
    
class Cidade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.String(2), nullable=False)

    previsoes = db.relationship("Previsao", backref="cidade", lazy=True)

    def to_dict(self):
        return {"id": self.id, "nome": self.nome, "estado": self.estado}


class Previsao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False)
    temperatura = db.Column(db.Float, nullable=False)
    clima = db.Column(db.String(100), nullable=False)
    umidade = db.Column(db.Integer, nullable=False)
    cidade_id = db.Column(db.Integer, db.ForeignKey("cidade.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "data": self.data.isoformat(),
            "temperatura": self.temperatura,
            "clima": self.clima,
            "umidade": self.umidade,
            "cidade": self.cidade.to_dict() if self.cidade else None,
        }