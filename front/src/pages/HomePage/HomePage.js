import React, { useEffect, useState } from "react";
import { getMovies } from "../../TempData/movies"; // Импорт функции для получения фильмов
import products from "../../TempData/Products"; // Импортируем массив продуктов
import Product from "../../components/Product/Product";
import "./HomePage.css"; // Импорт стилей

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies(); // Запрос к серверу
        console.log("Fetched movies:", data); // Логируем данные для проверки
        setMovies(data); // Устанавливаем фильмы в состояние
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please try again later.");
      }
    };

    fetchMovies();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-list">
      {movies.map((movie) => {
        // Находим продукт по id
        const product = products.find((p) => p.id === movie.id);
        const image = product ? product.image : "default-image-url.jpg"; // Если продукт найден, берем его изображение

        return (
          <Product
            key={movie.id}
            id={movie.id}
            image={image} // Передаем найденное изображение
            movie_name={movie.movie_name}
            movie_description={movie.movie_description}
            movie_duration={movie.movie_duration}
            movie_censor={movie.movie_censor}
          />
        );
      })}
    </div>
  );
};

export default HomePage;