import React, { useState, useEffect } from "react";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`); 
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const addToOrderHistory = (productId) => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('orderHistory='));

  const history = cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];

  if (!history.includes(productId)) {
    history.push(productId); // Добавляем ID, если его ещё нет
  }

  document.cookie = `orderHistory=${encodeURIComponent(JSON.stringify(history))}; path=/; max-age=604800`; // 7 дней
};
const Filter = ({ obj, isInCart = false, onRemove }) => {
  const { id, name, category, description, price, image, discount_price } = obj;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");  // Адрес из куки
  const [newAddress, setNewAddress] = useState("");  // Новый адрес, который может ввести пользователь

  useEffect(() => {
    // Получаем текущий адрес из cookie
    const savedAddress = decodeURIComponent(getCookie("userAddress"));
    setSelectedAddress(savedAddress || "");  // Если адрес в куки есть, отображаем его
  }, []);

  const stores = [
    { id: 1, name: "Магазин A", price: 320, deliveryTime: "30-40 мин" },
    { id: 2, name: "Магазин B", price: 310, deliveryTime: "20-30 мин" },
    { id: 3, name: "Магазин C", price: 300, deliveryTime: "40-50 мин" },
  ];

  const handleAddToCart = (productId) => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cart='));
    const cart = cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];
  
    if (!cart.includes(productId)) {
      cart.push(productId);
    }
  
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/; max-age=604800`; // 7 дней
  };

  const handleConfirmOrder = () => {
    const customer_email = decodeURIComponent(getCookie("userEmail"));

    // Проверка на наличие email в куки
    if (!customer_email) {
      alert("Пожалуйста, войдите в систему, чтобы оформить заказ.");
      return; // Прерываем выполнение, если email не найден
    }

    const orderData = {
      products: [id],
      choosen_store: selectedStore,
      address: newAddress || selectedAddress, // Если новый адрес пуст, используем текущий из куки
      customer_email,
      status: "pending",
    };

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
        setIsModalOpen(false);
        addToOrderHistory(id);
      })
      .catch(error => {
        console.error("Error:", error);
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
        {!isInCart && <button className="cart-button" onClick={() => handleAddToCart(id)}>В корзину</button>}
        <button className="buy-button" onClick={() => {
       const customer_email = decodeURIComponent(getCookie("userEmail"));
     
       if (!customer_email || customer_email === "null") {
         alert("Пожалуйста, войдите в систему, чтобы оформить заказ.");
         
       } else {
         setIsModalOpen(true);
       }
       
        }}>Купить</button>
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

            <label>Выберите магазин:</label>
            <select onChange={(e) => setSelectedStore(e.target.value)}>
              <option value="">Выберите...</option>
              {stores.map((store) => (
                <option key={store.id} value={store.name}>
                  {store.name} - {store.price} Тг ({store.deliveryTime})
                </option>
              ))}
            </select>

            <label>Адрес доставки:</label>
            <input
              type="text"
              value={newAddress || selectedAddress}  // Показываем новый адрес, если введен, иначе старый
              onChange={(e) => setNewAddress(e.target.value)} // Обновляем новый адрес
              placeholder="Введите новый адрес, если хотите изменить"
            />

            <button 
              className="confirm-button" 
              disabled={!selectedStore ||!(newAddress || selectedAddress)}  // Ожидаем, что магазин выбран и введен адрес
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

