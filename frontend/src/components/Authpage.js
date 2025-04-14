import React, { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setCookie = (name, value, days) => {
    if (!value) return;
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/;${expires}; Secure; SameSite=Strict`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
  
    setLoading(true);
    setError(null);
  
    const url = isLogin
      ? "http://127.0.0.1:8000/users/login/"
      : "http://127.0.0.1:8000/users/registration/";
  
    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
          role: "user", // Константная роль
        };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Некорректный JSON в ответе сервера");
      }
  
      if (response.ok) {
        console.log("Ответ сервера:", data);
  
        // Сохраняем access_token и refresh_token в cookies
        setCookie("accessToken", data.access_token, 7);
        setCookie("refreshToken", data.refresh_token, 7);
  
        if (isLogin) {
          // Делаем запрос на /users/profile
          const profileResponse = await fetch("http://127.0.0.1:8000/users/profile/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${data.access_token}`,
            },
          });
  
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            
  
            const userName = profileData.email ? profileData.email: "пользователь";
            alert(`Вход успешен! Добро пожаловать, ${userName}`);
          } else {
            throw new Error("Не удалось получить данные профиля");
          }
  
          window.location.reload();
        } else {
          alert(data.message || "Регистрация успешна!");
          setCookie("jwtToken", formData.email, 7); 
  
          setIsLogin(true);
          setFormData({
            email: "",
            password: "",
          });
  
          window.location.reload();
        }
      } else {
        setError(data.detail || data.email || "Ошибка при выполнении запроса");
        console.log(data);
      }
    } catch (error) {
      setError(error.message || "Ошибка соединения с сервером");
    }
  
    setLoading(false);
  };
  

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Пароль:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
      </p>
    </div>
  );
};

export default AuthPage;
