import axios from "axios";

const API_URL = "http://127.0.0.1:8000/seats";

// Получаем токен из куки (убираем кавычки, если есть)
const getAccessToken = () => {
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]).replace(/^"|"$/g, "") : null;
};

// Формируем заголовок авторизации, если токен есть
const authHeader = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Получить место по ID
export const getSeat = async (seatId) => {
  try {
    const response = await axios.get(`${API_URL}/get_seat/${seatId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching seat ${seatId}:`, error.response?.data || error);
    throw error;
  }
};

// Получить все свободные места в зале
export const getFreeSeats = async (hallId) => {
  try {
    const response = await axios.get(`${API_URL}/get_free_seats/${hallId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching free seats for hall ${hallId}:`, error.response?.data || error);
    throw error;
  }
};

// Получить все места в зале
export const getSeats = async (hallId) => {
  try {
    const response = await axios.get(`${API_URL}/get_seats/${hallId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching seats for hall ${hallId}:`, error.response?.data || error);
    throw error;
  }
};

// Добавить новое место
export const addSeat = async (seatData) => {
  try {
    const response = await axios.post(
      `${API_URL}/add_seat`,
      seatData,
      { headers: { ...authHeader(), "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding seat:", error.response?.data || error);
    throw error;
  }
};

// Обновить существующее место
export const updateSeat = async (seatData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update_seat`,
      seatData,
      { headers: { ...authHeader(), "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating seat:", error.response?.data || error);
    throw error;
  }
};

// Удалить место по ID
export const deleteSeat = async (seatId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete_seat/${seatId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting seat ${seatId}:`, error.response?.data || error);
    throw error;
  }
};
