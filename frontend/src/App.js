import React from "react";
import axios from "axios";
import Header from "./components/Header";
import Aside from "./components/Aside";
import EditProfile from "./components/EditProfile";
import Body from "./components/Body";
import Footer from "./components/Footer";
import DiscountPage from "./components/DiscountPage";
import CartPage from "./components/CartPage";
import ProfilePage from "./components/ProfilePage";
import AuthPage from "./components/Authpage";
class App extends React.Component {
  state = {
    products: [],
    currentView: "all", // Возможные значения: "all", "discounts", "bucet", "profile"
    user: null, // Данные пользователя
    isLoadingUser: false, // Флаг загрузки профиля
  };

  componentDidMount() {
    // Загружаем товары
    axios.get("http://127.0.0.1:8080/api/products/")
      .then(response => {
        this.setState({ products: response.data });
      })
      .catch(error => {
        console.error("Ошибка при загрузке данных:", error);
      });
  
    // Загружаем пользователя из куки
    this.loadUserFromCookies();
  }

  toggleView = (view) => {
    this.setState({ currentView: view });
  };
  fetchUserData = async (email, password) => {
    this.setState({ isLoadingUser: true });

    try {
      const response = await fetch("http://127.0.0.1:8080/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Введенные данные:", { email, password }); // Лог введенных данных
      console.log("Ответ от сервера:", data); // Вывод в консоль

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки профиля");
      }

      // Сохранение данных в куки
      document.cookie = `userEmail=${data.user.email}; path=/; Secure; SameSite=Strict`;
      document.cookie = `userName=${data.user.name}; path=/; Secure; SameSite=Strict`;
      if (data.token) {
        document.cookie = `authToken=${data.token}; path=/; Secure; SameSite=Strict`;
      }

      this.setState({ user: data.user, isLoadingUser: false });
    } catch (error) {
      console.error("Ошибка:", error);
      this.setState({ user: null, isLoadingUser: false });
    }
  };


  loadUserFromCookies = () => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? match[2] : null;
    };

    const email = getCookie("userEmail");
    const name = getCookie("userName");

    if (email && name) {
      this.setState({ user: { email, name } });
    }
  };

 


  renderContent() {
    const { currentView, products, user, isLoadingUser } = this.state;

    if (currentView === "profile") {
      if (isLoadingUser) return <p>Загрузка...</p>;
      return user ? <ProfilePage user={user} toggleView={this.toggleView} products={products}/> : <AuthPage onLogin={this.fetchUserData} />;
    }

    switch (currentView) {
      case "discounts":
        return <DiscountPage products={products} />;
      case "bucet":
        return <CartPage products={products}/>;
      case "EditProfile":
        return <EditProfile />;
      default:
        return <Body products={products} />;
    }
  }

  render() {
    return (
      <div>
        <Header toggleView={this.toggleView} />
        <div className="main">
          <Aside toggleView={this.toggleView} />
          {this.renderContent()}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
