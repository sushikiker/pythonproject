// src/TempData/seances.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/seances";

// Получить токен из куки и собрать заголовок авторизации
function getAccessToken() {
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]).replace(/^"|"$/g, "") : null;
}

function authHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Получить один сеанс по ID
export async function getSeance(seanceId) {
  const { data } = await axios.get(
    `${API_URL}/get_seance/${seanceId}`,
    { headers: authHeader() }
  );
  return data;
}

// Получить все сеансы для заданного фильма
export async function getSeancesByMovie(movieId) {
  const { data } = await axios.get(
    `${API_URL}/get_seances/${movieId}`,
    { headers: authHeader() }
  );
  return data;
}

// Добавить новый сеанс
// seanceData = { movie_id, hall_id, price, time_start, time_end }
export async function addSeance(seanceData) {
  const { data } = await axios.post(
    `${API_URL}/add_seance`,
    seanceData,
    { headers: { ...authHeader(), "Content-Type": "application/json" } }
  );
  return data;
}

// Обновить существующий сеанс
// seanceData = { id, movie_id, hall_id, price, time_start, time_end }
export async function updateSeance(seanceData) {
  const { data } = await axios.put(
    `${API_URL}/update_seance`,
    seanceData,
    { headers: { ...authHeader(), "Content-Type": "application/json" } }
  );
  return data;
}

// Удалить сеанс по ID
export async function deleteSeance(seanceId) {
  const { data } = await axios.delete(
    `${API_URL}/delete_seance/${seanceId}`,
    { headers: authHeader() }
  );
  return data;
}
