import React, { useState, useEffect } from "react";
import { getHalls, addHall, deleteHall } from "../../../TempData/halls";
import "./Halls.css";

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [newHallName, setNewHallName] = useState("");
  const [editHallId, setEditHallId] = useState(null);
  const [editHallName, setEditHallName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const data = await getHalls();
        setHalls(data);
      } catch (err) {
        console.error("Error fetching halls:", err);
        setError("Failed to load halls. Please try again later.");
      }
    };

    fetchHalls();
  }, []);

  const handleAddHall = async () => {
    if (!newHallName.trim()) return alert("Название зала не может быть пустым!");
    try {
      const newHall = await addHall({ hall_name: newHallName });
      setHalls([...halls, newHall]);
      setNewHallName("");
    } catch (err) {
      console.error("Error adding hall:", err);
      alert("Не удалось добавить зал.");
    }
  };

  const handleDeleteHall = async (id) => {
    try {
      await deleteHall(id);
      setHalls(halls.filter((hall) => hall.id !== id));
    } catch (err) {
      console.error("Error deleting hall:", err);
      alert("Не удалось удалить зал.");
    }
  };

  const handleEditHall = async () => {
    if (!editHallName.trim()) return alert("Название зала не может быть пустым!");
    try {
      const updatedHall = { id: editHallId, hall_name: editHallName };
      setHalls(halls.map((hall) => (hall.id === editHallId ? updatedHall : hall)));
      setEditHallId(null);
      setEditHallName("");
    } catch (err) {
      console.error("Error editing hall:", err);
      alert("Не удалось обновить зал.");
    }
  };

  return (
    <div className="halls-section">
      <h2>Управление залами</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="add-hall">
        <input
          type="text"
          placeholder="Название нового зала"
          value={newHallName}
          onChange={(e) => setNewHallName(e.target.value)}
        />
        <button onClick={handleAddHall}>Добавить зал</button>
      </div>
      <div className="halls-list">
        {halls.map((hall) => (
          <div key={hall.id} className="hall-item">
            {editHallId === hall.id ? (
              <>
                <input
                  type="text"
                  value={editHallName}
                  onChange={(e) => setEditHallName(e.target.value)}
                />
                <button onClick={handleEditHall}>Сохранить</button>
                <button onClick={() => setEditHallId(null)}>Отмена</button>
              </>
            ) : (
              <>
                <p>
                  <strong>ID:</strong> {hall.id} | <strong>Название:</strong> {hall.hall_name}
                </p>
                <button
                  onClick={() => {
                    setEditHallId(hall.id);
                    setEditHallName(hall.hall_name);
                  }}
                >
                  Редактировать
                </button>
                <button onClick={() => handleDeleteHall(hall.id)}>Удалить</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Halls;