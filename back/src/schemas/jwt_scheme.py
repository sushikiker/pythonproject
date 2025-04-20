from pydantic import BaseModel

class Token_scheme(BaseModel):
    access_token: str
    token_type: str = "bearer" 
    refresh_token: str
