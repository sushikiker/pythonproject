import React, { useState, useEffect } from "react";

const ProfilePage = ({ user, toggleView }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Если данные пользователя уже переданы через пропсы, сразу убираем флаг загрузки
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    // Удаление куков с токенами
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    
  
    // Перезагрузка страницы
    window.location.reload();
  };
  

  if (loading) return <p>Загрузка...</p>;
  if (!user) return <p>Профиль не найден</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Профиль</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {user.email}</p>
       
      </div>

      <h3 className="order-history-title">История заказов</h3>
      <p>Заказов пока нет</p>

      
      <button className="logout-button" onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default ProfilePage;
