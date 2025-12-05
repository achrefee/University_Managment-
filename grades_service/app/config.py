from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Server
    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000
    
    # MongoDB - support both naming conventions
    mongodb_url: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    mongodb_db_name: str = "university_oauth"
    
    # JWT
    jwt_secret: str = "university-jwt-secret-key-2024"
    jwt_algorithm: str = "HS256"
    
    # CORS
    allowed_origins: str = "*"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"

settings = Settings()

