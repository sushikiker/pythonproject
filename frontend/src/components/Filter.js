import React, { useState } from "react";
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};
const Filter = ({ obj }) => {
  const { id, name, category, description, price, image, discount_price } = obj;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const stores = [
    { id: 1, name: "Магазин A", price: 320, deliveryTime: "30-40 мин" },
    { id: 2, name: "Магазин B", price: 310, deliveryTime: "20-30 мин" },
    { id: 3, name: "Магазин C", price: 300, deliveryTime: "40-50 мин" },
  ];

  const addresses = [
    "г. Москва, ул. Пушкина, д. 10",
    "г. Москва, ул. Ленина, д. 5",
    "г. Москва, ул. Тверская, д. 3",
  ];

  // Функция для отправки данных
  const handleConfirmOrder = () => {
    const customer_email = getCookie("userEmail");
    const orderData = {
      products: id,
      choosen_store: selectedStore,
      address: selectedAddress,
      customer_email,
      status:"Ожидает обработки" // если есть скидка, отправляем скидочную цену
    };

    // Отправка данных на сервер
    fetch("http://127.0.0.1:8080/api/add-order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Order confirmed:", data);
        // Можно обработать ответ от сервера
        setIsModalOpen(false); // Закрываем модальное окно после успешного подтверждения
      })
      .catch(error => {
        console.error("Error:", error);
        // Можно показать ошибку пользователю, если необходимо
      });
  };

  return (
    <div className="person">
      <img src={image} alt={name} className="product-image" />
      <h3>{name}</h3>
      <p><strong>Категория:</strong> {category}</p>
      <p><strong>Описание:</strong> {description}</p>

      {discount_price ? (
        <p>
          <strong>Цена: </strong>
          <span className="old-price">{price} Тг</span>
          <span className="discount-price">{discount_price} Тг</span>
        </p>
      ) : (
        <p><strong>Цена:</strong> {price} Тг</p>
      )}

      <div className="buttons">
        <button className="buy-button" onClick={() => setIsModalOpen(true)}>Купить</button>
        <button className="cart-button">В корзину</button>
      </div>

      {/* Модальное окно подтверждения покупки */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Подтверждение покупки</h3>

            <label>Выберите магазин:</label>
            <select onChange={(e) => setSelectedStore(e.target.value)}>
              <option value="">Выберите...</option>
              {stores.map((store) => (
                <option key={store.id} value={store.name}>
                  {store.name} - {store.price} Тг ({store.deliveryTime})
                </option>
              ))}
            </select>

            <label>Выберите адрес доставки:</label>
            <select onChange={(e) => setSelectedAddress(e.target.value)}>
              <option value="">Выберите...</option>
              {addresses.map((address, index) => (
                <option key={index} value={address}>{address}</option>
              ))}
            </select>

            <button 
              className="confirm-button" 
              disabled={!selectedStore || !selectedAddress}
              onClick={handleConfirmOrder} // Отправка данных при подтверждении заказа
            >
              Подтвердить заказ
            </button>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
