from extensions import db

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