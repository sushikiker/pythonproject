import React, { useState, useEffect } from "react";
import "./CartProduct.css";
import Cart from "../../TempData/Cart";

const CartProduct = ({ id, image, title, price, quantity, onUpdateCart }) => {
  const [selectedSeats, setSelectedSeats] = useState(Cart.getSeats(id)?.seats || []);
  const [selectedHall, setSelectedHall] = useState(Cart.getSeats(id)?.hallId || Cart.getHalls()[0]?.id);
  const [totalPrice, setTotalPrice] = useState(price * quantity);
  const halls = Cart.getHalls();

  useEffect(() => {
    setTotalPrice(price * quantity);
  }, [price, quantity]);

  const handleSeatToggle = (row, seat) => {
    const seatKey = `${row}-${seat}`;
    const maxSeats = quantity;
    let updatedSeats;

    if (selectedSeats.includes(seatKey)) {
      updatedSeats = selectedSeats.filter((s) => s !== seatKey);
    } else if (selectedSeats.length < maxSeats) {
      updatedSeats = [...selectedSeats, seatKey];
    } else {
      return;
    }

    setSelectedSeats(updatedSeats);
    Cart.updateSeats(id, updatedSeats, selectedHall);
    onUpdateCart();
  };

  const handleHallChange = (event) => {
    const hallId = parseInt(event.target.value, 10);
    setSelectedHall(hallId);
    setSelectedSeats([]);
    Cart.updateSeats(id, [], hallId);
    onUpdateCart();
  };

  const handleIncrease = () => {
    Cart.addItem({ id, title, price });
    onUpdateCart();
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const updatedSeats = [...selectedSeats];
      updatedSeats.pop();
      setSelectedSeats(updatedSeats);
      Cart.updateSeats(id, updatedSeats, selectedHall);
    }
    Cart.removeItem(id);
    onUpdateCart();
  };

  const currentHall = halls.find((hall) => hall.id === selectedHall);

  return (
    <div className="cart-product">
      <img src={image} alt={title} className="cart-product-image" />
      <div className="cart-product-details">
        <div className="cart-product-details-row">
          <p><strong>Цена за единицу:</strong> {price} Тг</p>
        </div>
        <div className="cart-product-details-row">
          <p><strong>Общая стоимость:</strong> {totalPrice} Тг</p>
        </div>
        <div className="cart-product-buttons-row">
          <p><strong>Количество:</strong> {quantity}</p>
          <div className="cart-product-buttons">
            <button className="decrease-button" onClick={handleDecrease}>-</button>
            <button className="increase-button" onClick={handleIncrease}>+</button>
          </div>
        </div>
      </div>
      <div className="hall-selection">
        <label htmlFor={`hall-select-${id}`}>Выберите зал:</label>
        <select
          id={`hall-select-${id}`}
          value={selectedHall || ""}
          onChange={handleHallChange}
        >
          {halls.map((hall) => (
            <option key={hall.id} value={hall.id}>
              {hall.name}
            </option>
          ))}
        </select>
      </div>
      {currentHall && (
        <div className="seat-selection">
          <h4>Выберите места:</h4>
          <div className="seat-grid">
            {Array.from({ length: currentHall.rows }).map((_, row) => (
              <div key={row} className="seat-row">
                {Array.from({ length: currentHall.seatsPerRow }).map((_, seat) => {
                  const seatKey = `${row + 1}-${seat + 1}`;
                  const isSelected = selectedSeats.includes(seatKey);
                  return (
                    <button
                      key={seatKey}
                      className={`seat ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSeatToggle(row + 1, seat + 1)}
                    >
                      {seat + 1}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartProduct;