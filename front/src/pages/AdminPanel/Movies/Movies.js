import React, { useState, useEffect } from "react";
import { getMovies, addMovie, updateMovie, deleteMovie } from "../../../TempData/movies";
import "./Movies.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    movie_name: "",
    movie_description: "",
    movie_duration: "",
    movie_censor: "",
  });
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    movie_name: "",
    movie_description: "",
    movie_duration: "",
    movie_censor: "",
  });

  // Загрузка списка фильмов при монтировании
  useEffect(() => {
    (async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Не удалось загрузить фильмы. Попробуйте позже.");
      }
    })();
  }, []);

  const handleAddMovie = async () => {
    const nameTrimmed = newMovie.movie_name.trim();
    const nameLower = nameTrimmed.toLowerCase();

    if (!nameTrimmed) {
      return alert("Название фильма не может быть пустым!");
    }
    if (movies.some(m => m.movie_name.toLowerCase() === nameLower)) {
      return alert("Фильм с таким названием уже существует, придумай другое название.");
    }
    if (nameTrimmed.length > 50) {
      return alert("Название фильма не должно превышать 50 символов!");
    }
    if (newMovie.movie_description.length > 1000) {
      return alert("Описание фильма не должно превышать 1000 символов!");
    }

    console.log("Payload for addMovie:", newMovie);

    try {
      const added = await addMovie(newMovie);
      setMovies(prev => [...prev, added]);
      setNewMovie({ movie_name: "", movie_description: "", movie_duration: "", movie_censor: "" });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail === "Movie name must be unique") {
        alert("Фильм с таким названием уже существует!");
      } else if (err.response?.data) {
        console.error("Backend validation error:", err.response.data);
        alert(`Ошибка на сервере:\n${JSON.stringify(err.response.data)}`);
      } else {
        console.error("Error adding movie:", err);
        alert("Не удалось добавить фильм.");
      }
    }
  };

  const startEdit = (movie) => {
    setEditingId(movie.id);
    setEditingData({
      movie_name: movie.movie_name,
      movie_description: movie.movie_description,
      movie_duration: movie.movie_duration,
      movie_censor: movie.movie_censor,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateMovie({ id: editingId, ...editingData });
      setMovies(prev => prev.map(m => (m.id === editingId ? updated : m)));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating movie:", err);
      const detail = err.response?.data?.detail;
      if (detail) {
        alert(detail);
      } else {
        alert("Не удалось сохранить изменения.");
      }
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await deleteMovie(id);
      setMovies(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error("Error deleting movie:", err);
      alert("Не удалось удалить фильм.");
    }
  };

  return (
    <div className="movies-section">
      <h2>Управление фильмами</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="add-movie">
        <input
          type="text"
          placeholder="Название фильма (до 50 символов)"
          value={newMovie.movie_name}
          onChange={e => setNewMovie({ ...newMovie, movie_name: e.target.value })}
        />
        <textarea
          placeholder="Описание фильма (до 1000 символов)"
          value={newMovie.movie_description}
          onChange={e => setNewMovie({ ...newMovie, movie_description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Длительность фильма (например, 2ч 30м)"
          value={newMovie.movie_duration}
          onChange={e => setNewMovie({ ...newMovie, movie_duration: e.target.value })}
        />
        <input
          type="text"
          placeholder="Возрастной рейтинг (censor)"
          value={newMovie.movie_censor}
          onChange={e => setNewMovie({ ...newMovie, movie_censor: e.target.value })}
        />
        <button onClick={handleAddMovie}>Добавить фильм</button>
      </div>

      <div className="movies-list">
        {movies.map(movie => (
          <div key={movie.id} className="movie-item">
            {editingId === movie.id ? (
              <>
                <input
                  type="text"
                  value={editingData.movie_name}
                  onChange={e => setEditingData({ ...editingData, movie_name: e.target.value })}
                />
                <textarea
                  value={editingData.movie_description}
                  onChange={e => setEditingData({ ...editingData, movie_description: e.target.value })}
                />
                <input
                  type="text"
                  value={editingData.movie_duration}
                  onChange={e => setEditingData({ ...editingData, movie_duration: e.target.value })}
                />
                <input
                  type="text"
                  value={editingData.movie_censor}
                  onChange={e => setEditingData({ ...editingData, movie_censor: e.target.value })}
                />
                <button onClick={handleSaveEdit}>Сохранить</button>
                <button onClick={cancelEdit}>Отмена</button>
              </>
            ) : (
              <>
                <p><strong>Название:</strong> {movie.movie_name}</p>
                <p><strong>Описание:</strong> {movie.movie_description}</p>
                <p><strong>Длительность:</strong> {movie.movie_duration}</p>
                <p><strong>Рейтинг:</strong> {movie.movie_censor}</p>
                <button onClick={() => startEdit(movie)}>Редактировать</button>
                <button onClick={() => handleDeleteMovie(movie.id)}>Удалить</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
