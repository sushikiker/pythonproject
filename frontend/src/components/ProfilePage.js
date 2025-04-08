import React, { useState, useEffect } from "react";

const ProfilePage = ({ toggleView }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const email = getCookie("userEmail");
    const name = getCookie("userName");
    const address = getCookie("userAddress");
    const paymentMethod = getCookie("userPaymentMethod");

    if (email && name) {
      setUser({ email, name, address, paymentMethod });
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userName=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userAddress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userPaymentMethod=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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

      <h3 className="order-history-title">История заказов</h3>
      <p>Заказов пока нет</p>

      {/* Вызов toggleView без this.props */}
      <button className="edit-button" onClick={() => toggleView("EditProfile")}>Редактировать</button>
      <button className="logout-button" onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default ProfilePage;
