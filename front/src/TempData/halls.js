import axios from "axios";

const API_URL = "http://127.0.0.1:8000/halls";

// Получить список всех залов
export const getHalls = async () => {
  try {
    const response = await axios.get(`${API_URL}/get_halls`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching halls:", error);
    throw error;
  }
};

// Получить зал по ID
export const getHallById = async (hallId) => {
  try {
    const response = await axios.get(`${API_URL}/get_hall/${hallId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching hall with ID ${hallId}:`, error);
    throw error;
  }
};

// Добавить новый зал
export const addHall = async (hallData) => {
  try {
    const response = await axios.post(`${API_URL}/add_hall`, hallData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding hall:", error);
    throw error;
  }
};

// Удалить зал по ID
export const deleteHall = async (hallId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete_hall/${hallId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting hall with ID ${hallId}:`, error);
    throw error;
  }
};

// Получить токен из cookies
const getAccessToken = () => {
  const cookies = document.cookie.split("; ");
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("access_token=")
  );
  return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
};