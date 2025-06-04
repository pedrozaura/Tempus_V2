from flask import Flask, request, jsonify
from flasgger import Swagger
from config import Config
from extensions import db, migrate
from models import Weather
from models import Alert 

from models import Cidade, Previsao

app = Flask(__name__)
app.config.from_object(Config)

# Inicializações
db.init_app(app)
migrate.init_app(app, db)
swagger = Swagger(app)

@app.route("/")
def index():
    """
    Página inicial da API Tempus
    ---
    responses:
      200:
        description: Dados iniciais da API
    """
    from datetime import datetime
    return jsonify({
        "projeto": "TEMPUS – Radar Meteorológico em Tempo Real",
        "mensagem": "Bem-vindo à API Tempus!",
        "data_hora": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

# CRUD completo

@app.route("/weather", methods=["POST"])
def create_weather():
    """
    Adiciona um novo registro meteorológico
    ---
    parameters:
      - in: body
        name: body
        schema:
          properties:
            city:
              type: string
            temperature:
              type: number
            condition:
              type: string
    responses:
      201:
        description: Registro criado
    """
    data = request.get_json()
    new = Weather(**data)
    db.session.add(new)
    db.session.commit()
    return jsonify(new.to_dict()), 201

@app.route("/weather", methods=["GET"])
def list_weather():
    """
    Lista todos os registros meteorológicos
    ---
    responses:
      200:
        description: Lista de registros
    """
    return jsonify([w.to_dict() for w in Weather.query.all()])

@app.route("/weather/<int:id>", methods=["GET"])
def get_weather(id):
    """
    Retorna um registro meteorológico específico
    ---
    parameters:
      - name: id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Registro retornado
    """
    item = Weather.query.get_or_404(id)
    return jsonify(item.to_dict())

@app.route("/weather/<int:id>", methods=["PUT"])
def update_weather(id):
    """
    Atualiza um registro meteorológico
    ---
    parameters:
      - name: id
        in: path
        type: integer
        required: true
      - in: body
        name: body
        schema:
          properties:
            city:
              type: string
            temperature:
              type: number
            condition:
              type: string
    responses:
      200:
        description: Registro atualizado
    """
    item = Weather.query.get_or_404(id)
    data = request.get_json()
    item.city = data.get("city", item.city)
    item.temperature = data.get("temperature", item.temperature)
    item.condition = data.get("condition", item.condition)
    db.session.commit()
    return jsonify(item.to_dict())

@app.route("/weather/<int:id>", methods=["DELETE"])
def delete_weather(id):
    """
    Deleta um registro meteorológico
    ---
    parameters:
      - name: id
        in: path
        type: integer
        required: true
    responses:
      204:
        description: Registro deletado
    """
    item = Weather.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204


# CRUD ALERT

@app.route("/alerts", methods=["POST"])
def create_alert():
    """
    Cria um novo alerta
    ---
    parameters:
      - in: body
        name: body
        schema:
          properties:
            title:
              type: string
            message:
              type: string
    responses:
      201:
        description: Alerta criado com sucesso
    """
    data = request.get_json()
    new_alert = Alert(title=data["title"], message=data["message"])
    db.session.add(new_alert)
    db.session.commit()
    return jsonify(new_alert.to_dict()), 201

@app.route("/alerts", methods=["GET"])
def list_alerts():
    """
    Lista todos os alertas
    ---
    responses:
      200:
        description: Lista de alertas
    """
    alerts = Alert.query.order_by(Alert.created_at.desc()).all()
    return jsonify([a.to_dict() for a in alerts])

@app.route("/alerts/<int:id>", methods=["GET"])
def get_alert(id):
    """
    Retorna um alerta específico
    ---
    parameters:
      - name: id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Alerta retornado
    """
    alert = Alert.query.get_or_404(id)
    return jsonify(alert.to_dict())

@app.route("/alerts/<int:id>", methods=["DELETE"])
def delete_alert(id):
    """
    Deleta um alerta
    ---
    parameters:
      - name: id
        in: path
        type: integer
        required: true
    responses:
      204:
        description: Alerta deletado
    """
    alert = Alert.query.get_or_404(id)
    db.session.delete(alert)
    db.session.commit()
    return '', 204

@app.route("/cidades", methods=["POST"])
def criar_cidade():
    data = request.get_json()
    nova = Cidade(nome=data["nome"], estado=data["estado"])
    db.session.add(nova)
    db.session.commit()
    return jsonify(nova.to_dict()), 201

@app.route("/cidades", methods=["GET"])
def listar_cidades():
    return jsonify([c.to_dict() for c in Cidade.query.all()])

@app.route("/previsoes", methods=["POST"])
def criar_previsoes():
    """
    Espera um array JSON com previsões dos próximos dias:
    [
      { "cidade_id": 1, "data": "2025-06-04", "temperatura": 22.5, "clima": "Céu limpo", "umidade": 75 },
      ...
    ]
    """
    dados = request.get_json()
    novas = []
    for item in dados:
        p = Previsao(**item)
        db.session.add(p)
        novas.append(p)
    db.session.commit()
    return jsonify([p.to_dict() for p in novas]), 201

@app.route("/previsoes/<int:cidade_id>", methods=["GET"])
def listar_previsoes_por_cidade(cidade_id):
    previsoes = Previsao.query.filter_by(cidade_id=cidade_id).order_by(Previsao.data).all()
    return jsonify([p.to_dict() for p in previsoes])






if __name__ == "__main__":
    app.run()
