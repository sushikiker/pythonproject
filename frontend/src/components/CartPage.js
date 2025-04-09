import React from "react";
import Filter from './Filter'; // Импортируем компонент Filter

class CartPage extends React.Component {
  render() {
    // Примерные товары
    const sampleItems = [
      {
        id: 1,
        title: "Inception",
        genre: "Sci-Fi",
        director: "Christopher Nolan",
        year: 2010,
        rating: 8.8,
        description: "A skilled thief leads a team into people's dreams to steal secrets.",
        price: 9.99,
        image: "https://avatars.mds.yandex.net/i?id=acfefca6dc029042c65a8f26c884c3c5_l-5297681-images-thumbs&n=13"
      },
      {
        id: 2,
        title: "The Godfather",
        genre: "Crime",
        director: "Francis Ford Coppola",
        year: 1972,
        rating: 9.2,
        description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
        price: 12.99,
        image: "https://example.com/images/godfather.jpg"
      },
      {
        id: 3,
        title: "Interstellar",
        genre: "Adventure",
        director: "Christopher Nolan",
        year: 2014,
        rating: 8.6,
        description: "A team of explorers travel through a wormhole in space in an attempt to save humanity.",
        price: 10.99,
        image: "https://example.com/images/interstellar.jpg"
      }
    ];

    return (
      <div className="body1">
        <h2>Корзина</h2>
        
        <div className="sample-items">
          <h3>Товары в корзине</h3>
          <div className="items-grid">
            {sampleItems.map((item) => (
              <Filter key={item.id} obj={item} availableSeats={[2, 5]} isInCart = {true}/> // Передаем товар в Filter
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default CartPage;
