from flask import Flask, request, jsonify
from flasgger import Swagger
from config import Config
from extensions import db, migrate
from models import Weather
from models import WeatherForecast
from models import Alert 
from datetime import datetime, timedelta
from dateutil.parser import parse
from flask_cors import CORS


import requests
OPENWEATHER_API_KEY = "91b363d9e740bd88f0809fa3a5db21ed"  # Substitua com sua chave

from models import Cidade, Previsao

app = Flask(__name__)
CORS(app)
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
    data = request.get_json()

    if not data or "city" not in data:
        return jsonify({"error": "Campo 'city' é obrigatório"}), 400

    city = data.get("city")

    # Consulta na OpenWeatherMap
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric&lang=pt_br"
    try:
        resp = requests.get(url)
        resp.raise_for_status()  # Vai levantar erro se status != 200
    except requests.RequestException:
        return jsonify({"error": "Falha ao consultar OpenWeatherMap"}), 400

    weather_data = resp.json()

    # Validar se os dados essenciais existem na resposta
    if "main" not in weather_data or "temp" not in weather_data["main"] \
       or "weather" not in weather_data or len(weather_data["weather"]) == 0 \
       or "description" not in weather_data["weather"][0]:
        return jsonify({"error": "Dados incompletos recebidos da OpenWeatherMap"}), 400

    temperature = weather_data["main"]["temp"]
    condition = weather_data["weather"][0]["description"]
    city_name = weather_data.get("name", city)  # Nome formatado da cidade

    new_weather = Weather(city=city_name, temperature=temperature, condition=condition)
    db.session.add(new_weather)
    db.session.commit()

    return jsonify(new_weather.to_dict()), 201

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
def get_weather_by_id(id):
    weather = Weather.query.get(id)
    if not weather:
        return jsonify({"error": "Registro não encontrado"}), 404
    return jsonify(weather.to_dict())

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


@app.route("/forecast/<city>", methods=["POST"])
def create_forecast(city):
    try:
        # Primeiro verifica se já temos dados recentes (últimas 6 horas)
        existing = WeatherForecast.query.filter(
            WeatherForecast.city == city,
            WeatherForecast.created_at >= datetime.utcnow() - timedelta(hours=6)
        ).first()
        
        if existing:
            return jsonify({"message": "Dados já estão atualizados"}), 200

        # Busca novos dados na OpenWeather
        url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={OPENWEATHER_API_KEY}&units=metric&lang=pt_br"
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()

        # Processa cada dia da previsão
        for item in data['list']:
            forecast_date = parse(item['dt_txt'])
            new_forecast = WeatherForecast(
                city=city,
                date=forecast_date,
                temperature=item['main']['temp'],
                condition=item['weather'][0]['description'],
                humidity=item['main']['humidity'],
                wind_speed=item['wind']['speed']
            )
            db.session.add(new_forecast)
        
        db.session.commit()
        return jsonify({"message": "Previsão atualizada com sucesso"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
@app.route('/forecast/<city_name>', methods=['GET'])
def get_5day_forecast(city_name):
    try:
        # Busca previsões dos próximos 5 dias (filtra para 1 registro por dia)
        forecasts = WeatherForecast.query.filter(
            WeatherForecast.city == city_name,
            WeatherForecast.date >= datetime.utcnow(),
            WeatherForecast.date <= datetime.utcnow() + timedelta(days=5)
        ).order_by(WeatherForecast.date).all()
        
        if not forecasts:
            return jsonify({"error": "Nenhuma previsão encontrada"}), 404
            
        # Agrupa por dia (opcional)
        forecast_data = [{
            "date": f.date.strftime('%Y-%m-%d'),
            "temperature": f.temperature,
            "condition": f.condition,
            "humidity": f.humidity,
            "wind_speed": f.wind_speed
        } for f in forecasts]
        
        return jsonify(forecast_data), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run()
