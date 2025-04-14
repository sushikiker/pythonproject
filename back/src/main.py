from fastapi import FastAPI
from src.presentation.api import auth_router, movie_router, seat_router, hall_router, seance_router, cart_router
app = FastAPI()

app.include_router(auth_router.router, prefix= '/users', tags=['Users'])

app.include_router(movie_router.router, prefix= '/movies', tags=['Movies'])

app.include_router(seat_router.router, prefix='/seats', tags=['Seats'])

app.include_router(hall_router.router, prefix='/halls', tags=['Halls'])

app.include_router(seance_router.router, prefix='/seances', tags=['Seances'])

app.include_router(cart_router.router, prefix='/carts', tags=['Carts'])