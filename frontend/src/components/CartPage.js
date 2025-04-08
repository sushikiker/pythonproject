import React from "react";

class CartPage extends React.Component {
  render() {
    // Примерные товары
    const sampleItems = [
      { id: 1, name: "Пицца Маргарита", price: 300, image: "https://avatars.mds.yandex.net/i?id=7ebe9bb2397c8145492a04f9527ef8f50e2f498a-4531164-images-thumbs&n=13" },
      { id: 1, name: "Пицца Маргарита", price: 300, image: "https://avatars.mds.yandex.net/i?id=7ebe9bb2397c8145492a04f9527ef8f50e2f498a-4531164-images-thumbs&n=13" },
      { id: 1, name: "Пицца Маргарита", price: 300, image: "https://avatars.mds.yandex.net/i?id=7ebe9bb2397c8145492a04f9527ef8f50e2f498a-4531164-images-thumbs&n=13" },
     
    ];

    return (
      <div className="body1">
        <h2>Корзина</h2>
        
        <div className="sample-items">
          <h3>Популярные товары</h3>
          <div className="items-grid">
            {sampleItems.map((item) => (
              <div key={item.id} className="item-card">
                <img src={item.image} alt={item.name} className="item-image" />
                <h4>{item.name}</h4>
                <p>{item.price} Т</p>
                <button className="add-to-cart">Купить</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default CartPage;

