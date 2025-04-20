import axios from "axios";

const API_URL = "http://127.0.0.1:8000/movies";

// Получить список всех фильмов
export const getMovies = async () => {
  try {
    const response = await axios.get(`${API_URL}/get_movies`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Получить фильм по ID
export const getMovieById = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}/get_movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie with ID ${movieId}:`, error);
    throw error;
  }
};

// Добавить новый фильм
export const addMovie = async (movieData) => {
  try {
    const response = await axios.post(`${API_URL}/add_movie`, movieData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

// Обновить фильм
export const updateMovie = async (movieData) => {
  try {
    const response = await axios.put(`${API_URL}/update_movie`, movieData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};

// Удалить фильм по ID
export const deleteMovie = async (movieId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete_movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Добавляем токен авторизации
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting movie with ID ${movieId}:`, error);
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