import React, { useState, useEffect } from "react";

// Функция для получения данных из cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ProfilePage = ({ toggleView }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    const email = decodeURIComponent(getCookie("userEmail"));
    const name = decodeURIComponent(getCookie("userName"));
    const address = decodeURIComponent(getCookie("userAddress"));
    const paymentMethod = decodeURIComponent(getCookie("userPaymentMethod"));

    if (email && name) {
      setUser({ email, name, address, paymentMethod });

      // Отправляем запрос на сервер для получения заказов
      fetch("http://127.0.0.1:8080/api/recent-orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((orders) => {
          // Получаем ID продуктов из заказов
          const allProductIds = orders.flatMap(order => order.products);

          // Запрашиваем информацию о каждом продукте
          Promise.all(
            allProductIds.map((productId) =>
              fetch(`http://127.0.0.1:8080/api/products/${productId}`)
                .then((res) => res.json())
            )
          )
            .then((products) => {
              // Создаем объект, чтобы подсчитать количество каждого продукта
              const productCount = products.reduce((acc, product) => {
                const existingProduct = acc.find(p => p.id === product.id);
                if (existingProduct) {
                  existingProduct.count += 1;
                } else {
                  acc.push({ ...product, count: 1 });
                }
                return acc;
              }, []);

              setOrderProducts(productCount);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Ошибка при получении продуктов:", err);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.error("Ошибка при получении заказов:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    const cookiesToClear = [
      "cart",
      "authToken",
      "userEmail",
      "userName",
      "userAddress",
      "userPaymentMethod",
    ];

    cookiesToClear.forEach((name) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });

    window.location.reload();
  };

  if (loading) return <p>Загрузка...</p>;
  if (!user) return <p>Профиль не найден</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Профиль</h2>
      <div className="profile-info">
        <p><strong>Имя пользователя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Адрес доставки:</strong> {user.address || "Не указан"}</p>
        <p><strong>Способ оплаты:</strong> {user.paymentMethod || "Не указан"}</p>
      </div>

      <h3 className="order-history-title">История заказов за последние 7 дней</h3>
      <div>
        {orderProducts.length > 0 ? (
          orderProducts.map((product) => (
            <div key={product.id} className="order-item">
              <img src={product.image} alt={product.name} className="order-item-image" />
              <h4>{product.name}</h4>
              <p><strong>Цена:</strong> {product.discount_price ? product.discount_price : product.price} Тг</p>
              <p>
  
  <span className="product-count"><strong>Количество:</strong>{product.count}</span>
</p>

            </div>
          ))
        ) : (
          <p>Заказов пока нет</p>
        )}
      </div>

      <button className="edit-button" onClick={() => toggleView("EditProfile")}>Редактировать</button>
      <button className="logout-button" onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default ProfilePage;
