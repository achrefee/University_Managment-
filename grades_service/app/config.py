from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Server
    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000
    
    # MongoDB
    mongodb_url: str
    mongodb_db_name: str
    
    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    
    # CORS
    allowed_origins: str
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
