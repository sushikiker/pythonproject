// src/components/Seances/Seances.js
import React, { useState, useEffect } from "react";
import { getMovies } from "../../../TempData/movies";
import { getHalls } from "../../../TempData/halls";
import {
  getSeancesByMovie,
  addSeance,
  updateSeance,
  deleteSeance,
} from "../../../TempData/seances";
import "./Seances.css";

export default function Seances() {
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [seances, setSeances] = useState([]);
  const [form, setForm] = useState({
    hall_id: "",
    price: "",
    time_start: "",
    durationMinutes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // загрузить фильмы и залы
  useEffect(() => {
    (async () => {
      try {
        setMovies(await getMovies());
        setHalls(await getHalls());
      } catch {
        setError("Не удалось загрузить данные");
      }
    })();
  }, []);

  // загрузить сеансы при выборе фильма
  useEffect(() => {
    if (!selectedMovie) {
      setSeances([]);
      return;
    }
    (async () => {
      try {
        const list = await getSeancesByMovie(selectedMovie);
        setSeances(list);
        setError("");
      } catch {
        setError("Ошибка при загрузке сеансов");
      }
    })();
  }, [selectedMovie]);

  // начать редактирование
  const startEdit = s => {
    setEditingId(s.id);
    // формат для datetime-local
    const ts = s.time_start.slice(0,16); 
    const te = s.time_end;
    const dur = Math.round((new Date(te) - new Date(s.time_start)) / 60000);
    setForm({
      hall_id: s.hall_id,
      price: s.price,
      time_start: ts,
      durationMinutes: String(dur),
    });
  };

  // отмена
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ hall_id: "", price: "", time_start: "", durationMinutes: "" });
  };

  // добавить или сохранить
  const handleSubmit = async () => {
    const { hall_id, price, time_start, durationMinutes } = form;
    if (!selectedMovie || !hall_id || !price || !time_start || !durationMinutes) {
      return alert("Заполните все поля и выберите фильм");
    }
    // вычислить time_end
    const startDate = new Date(time_start);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const payload = {
      movie_id: +selectedMovie,
      hall_id: +hall_id,
      price: +price,
      time_start: startDate.toISOString(),
      time_end: endDate.toISOString(),
    };
    try {
      if (editingId) {
        const upd = await updateSeance({ id: editingId, ...payload });
        setSeances(prev => prev.map(s => s.id === editingId ? upd : s));
      } else {
        const added = await addSeance(payload);
        setSeances(prev => [...prev, added]);
      }
      cancelEdit();
    } catch {
      alert("Ошибка при сохранении сеанса");
    }
  };

  // удалить
  const handleDelete = async id => {
    if (!window.confirm("Удалить сеанс?")) return;
    try {
      await deleteSeance(id);
      setSeances(prev => prev.filter(s => s.id !== id));
    } catch {
      alert("Не удалось удалить сеанс");
    }
  };

  return (
    <div className="seances-section">
      <h2>Сеансы по фильмам</h2>
      {error && <p className="error-msg">{error}</p>}

      <div className="movie-select">
        <select
          value={selectedMovie}
          onChange={e => {
            setSelectedMovie(e.target.value);
            cancelEdit();
          }}
        >
          <option value="">— Выберите фильм —</option>
          {movies.map(m => (
            <option key={m.id} value={m.id}>
              {m.movie_name} (ID:{m.id})
            </option>
          ))}
        </select>
      </div>

      {selectedMovie && (
        <table className="seances-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Зал</th>
              <th>Цена</th>
              <th>Начало</th>
              <th>Длит. (мин)</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {seances.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{halls.find(h => h.id === s.hall_id)?.hall_name}</td>
                <td>{s.price}</td>
                <td>{s.time_start.slice(0,16).replace("T"," ")}</td>
                <td>
                  {Math.round((new Date(s.time_end) - new Date(s.time_start)) / 60000)}
                </td>
                <td>
                  <button onClick={() => startEdit(s)}>✎</button>
                  <button onClick={() => handleDelete(s.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedMovie && (
        <div className="seance-form">
          <select
            value={form.hall_id}
            onChange={e => setForm(f => ({ ...f, hall_id: e.target.value }))}
          >
            <option value="">— Зал —</option>
            {halls.map(h => (
              <option key={h.id} value={h.id}>
                {h.hall_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Цена"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          />
          <input
            type="datetime-local"
            value={form.time_start}
            onChange={e => setForm(f => ({ ...f, time_start: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Длительность (мин)"
            value={form.durationMinutes}
            onChange={e => setForm(f => ({ ...f, durationMinutes: e.target.value }))}
          />
          {editingId ? (
            <>
              <button onClick={handleSubmit}>Сохранить</button>
              <button onClick={cancelEdit}>Отмена</button>
            </>
          ) : (
            <button onClick={handleSubmit}>Добавить</button>
          )}
        </div>
      )}
    </div>
  );
}
