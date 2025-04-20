// src/components/Aside/Aside.js
import React from "react";
import { getUserRole } from "../../TempData/auth";
import "./Aside.css";

class Aside extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: "home", // Начальное представление
      role: getUserRole()  // прочитаем роль из куки
    };
  }

  handleViewChange = (view) => {
    this.setState({ currentView: view });
    if (this.props.toggleView) {
      this.props.toggleView(view);
    }
  };

  render() {
    const { currentView, role } = this.state;
    const isAdmin = role === "admin";

    return (
      <aside className="aside">
        <h1>Каталог</h1>
        <p>
          <button
            className={currentView === "home" ? "active" : ""}
            onClick={() => this.handleViewChange("home")}
          >
            Главная страница
          </button>
        </p>
        <p>
          <button
            className={currentView === "bucet" ? "active" : ""}
            onClick={() => this.handleViewChange("bucet")}
          >
            Корзина
          </button>
        </p>
        {isAdmin && (
          <p>
            <button
              className={currentView === "admin" ? "active" : ""}
              onClick={() => this.handleViewChange("admin")}
            >
              Админ панель
            </button>
          </p>
        )}
      </aside>
    );
  }
}

export default Aside;
