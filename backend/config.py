import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:q27pptz8@localhost:5432/tempus")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SWAGGER = {
        'title': 'Tempus API',
        'uiversion': 3
    }
