// src/components/Seats/Seats.js
import React, { useState, useEffect } from "react";
import { getHalls } from "../../../TempData/halls";
import {
  getSeats,
  updateSeat,
  addSeat,
  deleteSeat,
} from "../../../TempData/seats";
import "./Seats.css";

const Seats = () => {
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [seatsMap, setSeatsMap] = useState({}); // { row: [seat,…] }
  const [error, setError] = useState(null);

  // загрузить список залов
  useEffect(() => {
    (async () => {
      try {
        setHalls(await getHalls());
      } catch {
        setError("Не удалось загрузить залы");
      }
    })();
  }, []);

  // загрузить места при выборе зала
  useEffect(() => {
    if (!selectedHall) {
      setSeatsMap({});
      return;
    }
    (async () => {
      try {
        const list = await getSeats(selectedHall.id);
        const map = {};
        list.forEach((s) => {
          map[s.row] = map[s.row] || [];
          map[s.row].push(s);
        });
        setSeatsMap(map);
        setError(null);
      } catch {
        setError("Ошибка при загрузке мест");
      }
    })();
  }, [selectedHall]);

  // добавить новый ряд (место №1)
  const handleAddRow = async () => {
    if (!selectedHall) return alert("Выберите зал");
    const rows = Object.keys(seatsMap).map(Number);
    const newRow = rows.length ? Math.max(...rows) + 1 : 1;
    try {
      const added = await addSeat({
        hall_id: selectedHall.id,
        row: newRow,
        seat: 1,
        status: false,
      });
      setSeatsMap(prev => ({ ...prev, [newRow]: [added] }));
    } catch {
      alert("Ошибка при добавлении ряда");
    }
  };

  // добавить сидение в ряд (не больше 20)
  const handleAddSeat = async (row) => {
    const rowSeats = seatsMap[row] || [];
    if (rowSeats.length >= 20) return;
    try {
      const added = await addSeat({
        hall_id: selectedHall.id,
        row,
        seat: rowSeats.length + 1,
        status: false,
      });
      setSeatsMap(prev => ({ ...prev, [row]: [...prev[row], added] }));
    } catch {
      alert("Ошибка при добавлении места");
    }
  };

  // удалить последнее сидение
  const handleRemoveSeat = async (row) => {
    const rowSeats = seatsMap[row] || [];
    if (!rowSeats.length) return;
    const last = rowSeats[rowSeats.length - 1];
    try {
      await deleteSeat(last.id);
      setSeatsMap(prev => ({ ...prev, [row]: prev[row].slice(0, -1) }));
    } catch {
      alert("Ошибка при удалении места");
    }
  };

  // переключить статус места
  const toggleSeat = async (seat) => {
    try {
      const upd = await updateSeat({
        id: seat.id,
        hall_id: selectedHall.id,
        row: seat.row,
        seat: seat.seat,
        status: !seat.status,
      });
      setSeatsMap(prev => ({
        ...prev,
        [seat.row]: prev[seat.row].map(s => s.id === seat.id ? upd : s),
      }));
    } catch {
      alert("Не удалось изменить статус");
    }
  };

  return (
    <div className="seats-section">
      <h2>Управление местами</h2>
      {error && <p className="error-msg">{error}</p>}

      <div className="hall-select">
        <select
          value={selectedHall?.id || ""}
          onChange={e => {
            const id = Number(e.target.value);
            setSelectedHall(halls.find(h => h.id === id) || null);
          }}
        >
          <option value="">— Выберите зал —</option>
          {halls.map(h => (
            <option key={h.id} value={h.id}>
              {h.hall_name} (ID: {h.id})
            </option>
          ))}
        </select>
        {selectedHall && (
          <button className="add-row" onClick={handleAddRow}>
            Добавить ряд
          </button>
        )}
      </div>

      {selectedHall && (
        <p className="current-hall">
          Выбран зал: {selectedHall.hall_name} (ID: {selectedHall.id})
        </p>
      )}

      {selectedHall && (
        <div className="seats-grid">
          {Object.entries(seatsMap)
            .filter(([, seats]) => seats.length > 0)
            .sort(([a], [b]) => a - b)
            .map(([row, seats]) => (
              <div key={row} className="seat-row">
                <div className="row-header">
                  <strong className="row-number">{row}</strong>
                  <div className="row-controls">
                    <button
                      className="add-seat-btn"
                      disabled={seats.length >= 20}
                      onClick={() => handleAddSeat(+row)}
                    >
                      +
                    </button>
                    <button
                      className="remove-seat-btn"
                      disabled={seats.length === 0}
                      onClick={() => handleRemoveSeat(+row)}
                    >
                      −
                    </button>
                  </div>
                </div>
                <div className="row-seats">
                  {seats
                    .sort((a, b) => a.seat - b.seat)
                    .map(seat => (
                      <button
                        key={seat.id}
                        className={`seat ${seat.status ? "taken" : "free"}`}
                        onClick={() => toggleSeat(seat)}
                      >
                        {seat.seat}
                      </button>
                    ))}
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Seats;
