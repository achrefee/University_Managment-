from pymongo import MongoClient
from app.config import settings

class Database:
    client: MongoClient = None
    
db = Database()

def get_database():
    return db.client[settings.mongodb_db_name]

def connect_to_mongo():
    db.client = MongoClient(settings.mongodb_url)
    print(f"Connected to MongoDB: {settings.mongodb_db_name}")

def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")
