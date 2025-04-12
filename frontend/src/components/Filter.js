import React, { useState } from "react";

const Filter = ({ obj, availableSeats = [], isInCart = false ,onRemove}) => {
  const { id, title, genre, director, year, rating, description, price, image } = obj;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]); // Массив выбранных мест

  const stores = [
    { id: 1, name: "Кинотеатр A", price: 320, deliveryTime: "30-40 мин" },
    { id: 2, name: "Кинотеатр B", price: 310, deliveryTime: "20-30 мин" },
    { id: 3, name: "Кинотеатр C", price: 300, deliveryTime: "40-50 мин" },
  ];


  const allSeats = Array.from({ length: 30 }, (_, i) => i + 1); // места от 1 до 30
  
  
  const handleAddToCart = (productId) => {
    // Получаем текущие ID из cookie
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cart='));
    const cart = cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];
  
    // Проверяем, есть ли уже ID
    if (!cart.includes(productId)) {
      cart.push(productId);
    }
  
    // Сохраняем обратно в cookie
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/; max-age=604800`; // 7 дней
  };
  
  // Функция для обработки клика на место
  const toggleSeatSelection = (seat) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seat)) {
        // Если место уже выбрано, убираем его
        return prevSeats.filter((selectedSeat) => selectedSeat !== seat);
      } else {
        // Если место не выбрано, добавляем его
        return [...prevSeats, seat];
      }
    });
  };

  const handleConfirmOrder = () => {
    const orderData = {
      products: id,
      choosen_store: selectedStore,
      seats: selectedSeats,
      customer_email: "example",
      status: "Ожидает обработки",
    };

    fetch("http://127.0.0.1:8080/api/add-order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Order confirmed:", data);
        setIsModalOpen(false);
        setSelectedSeats([]); // Очистка выбранных мест после отправки
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="movie-card">
      <img src={image} alt={title} className="product-image" />
      <h3>{title}</h3>
      <p><strong>Жанр:</strong> {genre}</p>
      <p><strong>Режиссёр:</strong> {director}</p>
      <p><strong>Год:</strong> {year}</p>
      <p><strong>Рейтинг:</strong> {rating}</p>
      <p><strong>Описание:</strong> {description}</p>
      <p><strong>Цена:</strong> {price} Тг</p>

      <div className="buttons">
        {/* Проверка на isInCart, если true, скрываем кнопку "В корзину" */}
        {!isInCart && <button className="cart-button" onClick={() => handleAddToCart(id)}>В корзину</button>}
        <button className="buy-button" onClick={() => setIsModalOpen(true)}>Купить</button>
        {isInCart && (
  <button className="remove-button" onClick={() => onRemove(id)}>
    Удалить из корзины
  </button>
)}

      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Подтверждение покупки</h3>

            <label>Выберите кинотеатр:</label>
            <select onChange={(e) => setSelectedStore(e.target.value)}>
              <option value="">Выберите...</option>
              {stores.map((store) => (
                <option key={store.id} value={store.name}>
                  {store.name} - {store.price} Тг ({store.deliveryTime})
                </option>
              ))}
            </select>

            <label>Выберите места:</label>
            <div className="seat-grid">
              {allSeats.map((seat) => {
                const isAvailable = availableSeats.includes(seat);
                return (
                  <button
                    key={seat}
                    className={`seat-button ${isAvailable ? '' : 'disabled'} ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                    onClick={() => isAvailable && toggleSeatSelection(seat)}
                    disabled={!isAvailable}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>

            <button
              className="confirm-button"
              disabled={!selectedStore  || selectedSeats.length === 0}
              onClick={handleConfirmOrder}
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
