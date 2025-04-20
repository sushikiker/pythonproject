
from src.presentation.api import auth_router, movie_router, seat_router, hall_router, seance_router, cart_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Разрешённые источники (указываем порт фронта)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешаем нужные источники
    allow_credentials=True,
    allow_methods=["*"],  # Можно указать только нужные методы: ["GET", "POST"]
    allow_headers=["*"],
)



app.include_router(auth_router.router, prefix= '/users', tags=['Users'])

app.include_router(movie_router.router, prefix= '/movies', tags=['Movies'])

app.include_router(seat_router.router, prefix='/seats', tags=['Seats'])

app.include_router(hall_router.router, prefix='/halls', tags=['Halls'])

app.include_router(seance_router.router, prefix='/seances', tags=['Seances'])

app.include_router(cart_router.router, prefix='/carts', tags=['Carts'])