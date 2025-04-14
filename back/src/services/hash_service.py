import aiobcrypt
import asyncio

class Hashes:
    async def generate_hash(self,password):

        salt = await aiobcrypt.gensalt()

        hashed_password = await aiobcrypt.hashpw(password.encode('utf-8'),salt)

        return hashed_password.decode('utf-8')
    
    async def verify_hash(self, password, hashed_password):
        
        valid_password = await aiobcrypt.checkpw(password.encode('utf-8'),hashed_password.encode('utf-8'))
        
        return valid_password


