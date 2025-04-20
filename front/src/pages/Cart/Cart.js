// src/pages/Cart/Cart.js
import React, { useState, useEffect } from 'react';
import { getUserCart, deleteCart } from '../../TempData/carts';
import { getSeance } from '../../TempData/seances';
import { getSeats } from '../../TempData/seats';
import './Cart.css';

const Cart = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) читаем «сырые» записи из куки
        const raw = await getUserCart(); // [{ id, seance_id, seat_id }, …]
        console.log('Raw cart:', raw);

        // 2) оставляем только объекты с нужными полями
        const entries = raw.filter(x =>
          x && typeof x === 'object' && 'seance_id' in x && 'seat_id' in x
        );
        console.log('Filtered:', entries);

        // 3) «обогащаем» каждую запись деталями сеанса и места
        const detailed = await Promise.all(entries.map(async entry => {
          const seance = await getSeance(entry.seance_id);
          const seats = await getSeats(seance.hall_id);
          const seatObj = seats.find(s => s.id === entry.seat_id) || {};

          // название фильма – если в seance его нет, придётся хранить в cookie при добавлении
          const movieName = seance.movie_name || seance.movieTitle || '—';

          return {
            cartId:      entry.id,
            movieName,
            sessionId:   seance.id,
            date:        new Date(seance.time_start).toLocaleDateString(),
            time:        new Date(seance.time_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration:    Math.round((new Date(seance.time_end) - new Date(seance.time_start)) / 60000),
            hall:        seance.hall_id,
            row:         seatObj.row,
            seatNumber:  seatObj.seat,
            price:       seance.price,
          };
        }));

        console.log('Detailed tickets:', detailed);
        setTickets(detailed);
      } catch (e) {
        console.error('Error loading cart tickets:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRemove = async cartId => {
    await deleteCart(cartId);
    setTickets(prev => prev.filter(t => t.cartId !== cartId));
  };

  if (loading) {
    return <div className="cart-loading">Загрузка…</div>;
  }
  if (!tickets.length) {
    return <div className="cart-empty">Корзина пуста.</div>;
  }

  return (
    <div className="cart-gallery">
      {tickets.map(t => (
        <div key={t.cartId} className="ticket-card">
          <button className="remove-btn" onClick={() => handleRemove(t.cartId)}>×</button>
          <h3 className="movie-title">{t.movieName}</h3>
          <div className="ticket-row"><span>Сеанс #</span><span>{t.sessionId}</span></div>
          <div className="ticket-row"><span>Дата:</span><span>{t.date}</span></div>
          <div className="ticket-row"><span>Время:</span><span>{t.time}</span></div>
          <div className="ticket-row"><span>Длительность:</span><span>{t.duration} мин</span></div>
          <div className="ticket-row"><span>Зал:</span><span>{t.hall}</span></div>
          <div className="ticket-row"><span>Ряд:</span><span>{t.row}</span></div>
          <div className="ticket-row"><span>Место:</span><span>{t.seatNumber}</span></div>
          <div className="ticket-row price-row"><span>Цена:</span><span>{t.price} ₽</span></div>
        </div>
      ))}
    </div>
  );
};

export default Cart;
