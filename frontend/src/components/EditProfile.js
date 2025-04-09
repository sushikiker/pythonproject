import React, { useState, useEffect } from "react";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    
    password: "",
    address: "",
    age: "",
    paymentMethod: "paypal",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? decodeURIComponent(match[2]) : "";
    };

    setFormData({
      name: getCookie("userName"),
      email: getCookie("userEmail"),
      password: "", 
      address: getCookie("userAddress"),
      age: getCookie("userAge"),
      paymentMethod: getCookie("userPaymentMethod"),
    });
  }, []);

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
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("http://127.0.0.1:8080/api/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Некорректный ответ от сервера");
      }

      if (response.ok) {
        setCookie("userName", formData.name, 7);
        
        setCookie("userAddress", formData.address, 7);
        setCookie("userAge", formData.age, 7);
        setCookie("userPaymentMethod", formData.paymentMethod, 7);
        setMessage("Данные успешно обновлены!");
      } else {
        setError(data.error || "Ошибка при обновлении данных");
      }
    } catch (error) {
      setError(error.message || "Ошибка соединения с сервером");
    }

    setLoading(false);
  };

  return (
    <div className="profile-container">
      <h2>Редактирование профиля</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Имя:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

       

        <label>Пароль (оставьте пустым, если не хотите менять):</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />

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

        <button type="submit" disabled={loading}>{loading ? "Сохранение..." : "Сохранить изменения"}</button>
      </form>
    </div>
  );
};

export default EditProfile;