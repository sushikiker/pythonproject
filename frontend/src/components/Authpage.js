import React, { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    age: "",
    paymentMethod: "paypal", // Способ оплаты по умолчанию
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
  
    console.log("Отправляемые данные:", formData);
  
    const url = isLogin
      ? "http://127.0.0.1:8080/api/login/"
      : "http://127.0.0.1:8080/api/register/";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Некорректный JSON в ответе сервера");
      }
  
      if (response.ok) {
        console.log("Ответ сервера:", data);
  
        if (isLogin) {
          if ( !data.user) {
            throw new Error("Отсутствует информация о пользователе");
          }
          
          
          setCookie("userEmail", data.user.email, 7);
          setCookie("userName", data.user.name, 7);
          setCookie("userAddress", data.user.address, 7);
          setCookie("userAge", data.user.age, 7);
          setCookie("userPaymentMethod", data.user.paymentMethod, 7);
  
          alert(`Вход успешен! Добро пожаловать, ${data.user.name}`);
          window.location.reload();
        } else {
          // Регистрация: сервер просто отправляет `message` и `id`
          alert(data.message || "Регистрация успешна!");
          setCookie("userEmail", formData.email, 7);
          setCookie("userName", formData.name, 7);
          setCookie("userAddress",formData.address, 7);
          setCookie("userAge", formData.age, 7);
          setCookie("userPaymentMethod", formData.paymentMethod, 7);
          setIsLogin(true);
          setFormData({ name: "", email: "", password: "", address: "", age: "", paymentMethod: "paypal" });
          window.location.reload();
        }
      } else {
        setError(data.email || "Ошибка при выполнении запроса");
        console.log(data)
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
        {!isLogin && (
          <>
            <label>Имя:</label>
            <input 
            type="text" 
            name="name" 
            value={formData.name}
             onChange={handleChange}
              required 
              />

            <label>Адрес доставки:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />

            <label>Возраст:</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required min="1" />

            <label>Способ оплаты:</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
              <option value="credit_card">Кредитная карта</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Банковский перевод</option>
            </select>
          </>
        )}

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
