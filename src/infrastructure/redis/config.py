from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    
    REDIS_URL: str = os.getenv('REDIS_URL')

settings = Settings()