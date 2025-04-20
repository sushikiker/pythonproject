// src/components/Product/BuyModal/BuyModal.js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getSeancesByMovie } from "../../../TempData/seances";
import { getSeats } from "../../../TempData/seats";
import { addCart } from "../../../TempData/carts";
import "./BuyModal.css";

const BuyModal = ({ userId, movieId, movieName, onClose }) => {
  const [step, setStep] = useState(1);
  const [seances, setSeances] = useState([]);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [seatsByRow, setSeatsByRow] = useState({});
  const [chosen, setChosen] = useState([]);

  useEffect(() => {
    getSeancesByMovie(movieId).then(setSeances).catch(console.error);
  }, [movieId]);

  useEffect(() => {
    if (!selectedSeance) return;
    getSeats(selectedSeance.hall_id)
      .then(list => {
        const grouped = {};
        list.forEach(s => {
          grouped[s.row] = grouped[s.row] || [];
          grouped[s.row].push(s);
        });
        setSeatsByRow(grouped);
        setChosen([]);
        setStep(2);
      })
      .catch(console.error);
  }, [selectedSeance]);

  const toggleSeat = seat => {
    if (seat.status) return;
    setChosen(c =>
      c.includes(seat.id) ? c.filter(x => x !== seat.id) : [...c, seat.id]
    );
  };

  const handlePurchase = async () => {
    if (!chosen.length) return;
    const errors = [];
    for (let seatId of chosen) {
      try {
        await addCart({ user_id: userId, seance_id: selectedSeance.id, seat_id: seatId });
      } catch (err) {
        // игнорировать дубли или валидацию
        if (err.response?.status !== 422) {
          errors.push(`Ошибка для места ${seatId}`);
        }
      }
    }
    if (errors.length) {
      alert(`Некоторые билеты не добавлены:\n${errors.join("\n")}`);
    } else {
      alert(`Добавлено ${chosen.length} билетов.`);
    }
    onClose();
  };

  const formatTime = dtStr =>
    new Date(dtStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return ReactDOM.createPortal(
    <div className="modal-backdrop">
      <div className="modal-window">
        <button className="close-btn" onClick={onClose}>×</button>

        {step === 1 ? (
          <>
            <h2>Сеансы: {movieName}</h2>
            <ul className="seance-list">
              {seances.map(s => (
                <li key={s.id}>
                  <button
                    className="seance-btn"
                    onClick={() => setSelectedSeance(s)}
                  >
                    {new Date(s.time_start).toLocaleDateString()} {formatTime(s.time_start)} — {s.price}₽
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2>
              Сеанс #{selectedSeance.id} — {selectedSeance.price}₽/место
            </h2>
            <p className="seance-info">
              Дата: {new Date(selectedSeance.time_start).toLocaleDateString()}<br/>
              Время: {formatTime(selectedSeance.time_start)} — {formatTime(selectedSeance.time_end)}<br/>
              Длительность: {Math.round((new Date(selectedSeance.time_end) - new Date(selectedSeance.time_start)) / 60000)} мин
            </p>
            <div className="seats-container">
              {Object.entries(seatsByRow)
                .sort((a,b) => a[0] - b[0])
                .map(([row, seats]) => (
                  <div key={row} className="seat-row-block">
                    <strong className="seat-row-title">Ряд {row}</strong>
                    <div className="seats-row">
                      {seats.sort((a,b)=>a.seat-b.seat).map(seat => (
                        <button
                          key={seat.id}
                          className={`seat-btn ${seat.status ? 'taken' : chosen.includes(seat.id) ? 'chosen' : 'free'}`}
                          onClick={() => toggleSeat(seat)}
                        >
                          {seat.seat}
                        </button>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
            <div className="actions">
              <button
                disabled={!chosen.length}
                onClick={handlePurchase}
              >
                Купить ({chosen.length * selectedSeance.price}₽)
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default BuyModal;
