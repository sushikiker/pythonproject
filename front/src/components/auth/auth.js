// src/components/Auth/Auth.js
import React, { useState, useEffect } from "react";
import {
  login,
  register,
  logout,
  getUserEmail,
} from "../../TempData/auth";
import "./auth.css";

const Auth = () => {
  const [mode, setMode] = useState(null); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const saved = getUserEmail();
    if (saved) {
      console.log("Existing session:", saved);
      setUserEmail(saved);
    }
  }, []);

  const startLogin = () => {
    setError(null);
    setEmail("");
    setPassword("");
    setMode("login");
  };

  const startRegister = () => {
    setError(null);
    setEmail("");
    setPassword("");
    setMode("register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login:", email);
      const res = await login(email.trim(), password);
      console.log("Login successful:", res);
      setUserEmail(getUserEmail());
      setMode(null);
    } catch (err) {
      console.error("Login error:", err);
      setError("Неверный email или пароль");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting register:", email);
      await register(email.trim(), password);
      console.log("Register successful, logging in...");
      const res = await login(email.trim(), password);
      console.log("Auto‑login after register:", res);
      setUserEmail(getUserEmail());
      setMode(null);
    } catch (err) {
      console.error("Register error:", err);
      if (err.response?.status === 422) {
        setError("Пользователь уже существует или неверные данные");
      } else {
        setError("Ошибка регистрации");
      }
    }
  };

  const handleLogout = () => {
    console.log("Logging out:", userEmail);
    logout();
    setUserEmail(null);
    setMode(null);
  };

  // если уже залогинен — только кнопка выхода
  if (userEmail) {
    return (
      <div className="auth-logged">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        {!mode && (
          <>
            <button onClick={startLogin}>Login</button>
            <button onClick={startRegister}>Register</button>
          </>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="auth-form">
            <h3>Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <div className="auth-form-buttons">
              <button type="submit">Login</button>
              <button type="button" onClick={() => setMode(null)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="auth-form">
            <h3>Register</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <div className="auth-form-buttons">
              <button type="submit">Register</button>
              <button type="button" onClick={() => setMode(null)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
