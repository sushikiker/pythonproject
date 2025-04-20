// src/components/Product/Product.js
import React, { useState } from "react";
import "./Product.css";
import BuyModal from "./BuyModal/BuyModal";

const Product = ({
  id,
  image,
  movie_name,
  movie_description,
  movie_duration,
  movie_censor,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleBuyClick = () => {
    setModalOpen(true);
  };

  return (
    <div className="movie-card">
      <img src={image} alt={movie_name} className="product-image" />
      <h3>{movie_name}</h3>
      <p><strong>Описание:</strong> {movie_description}</p>
      <p><strong>Длительность:</strong> {movie_duration}</p>
      <p><strong>Рейтинг:</strong> {movie_censor}</p>

      <div className="buttons">
        <button className="buy-button" onClick={handleBuyClick}>
          Купить билет
        </button>
      </div>

      {modalOpen && (
        <BuyModal
          movieId={id}
          movieName={movie_name}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Product;
