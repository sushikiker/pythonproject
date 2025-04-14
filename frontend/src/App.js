import React from "react";
import axios from "axios";
import Header from "./components/Header";
import Aside from "./components/Aside";

import Body from "./components/Body";
import Footer from "./components/Footer";
import CartPage from "./components/CartPage";
import ProfilePage from "./components/ProfilePage";
import AuthPage from "./components/Authpage";

class App extends React.Component {
  state = {
    products: [
      {
        id: 1,
        title: "Inception",
        genre: "Sci-Fi",
        director: "Christopher Nolan",
        year: 2010,
        rating: 8.8,
        description: "A skilled thief leads a team into people's dreams to steal secrets.",
        price: 9.99,
        image: "https://www.quirkybyte.com/wp-content/uploads/2018/08/Inception-5.jpg"
      },
      {
        id: 2,
        title: "The Godfather",
        genre: "Crime",
        director: "Francis Ford Coppola",
        year: 1972,
        rating: 9.2,
        description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
        price: 12.99,
        image: "https://example.com/images/godfather.jpg"
      },
      {
        id: 3,
        title: "Interstellar",
        genre: "Adventure",
        director: "Christopher Nolan",
        year: 2014,
        rating: 8.6,
        description: "A team of explorers travel through a wormhole in space in an attempt to save humanity.",
        price: 10.99,
        image: "https://example.com/images/interstellar.jpg"
      },
      {
        id: 5,
        title: "Беловежская пуща",
        genre: "Adventure",
        director: "Christopher Nolan",
        year: 2014,
        rating: 8.6,
        description: "A team of explorers travel through a wormhole in space in an attempt to save humanity.",
        price: 10.99,
        image: "https://example.com/images/interstellar.jpg"
      },
      {
        id: 4,
        title: "Parasite",
        genre: "Thriller",
        director: "Bong Joon-ho",
        year: 2019,
        rating: 8.6,
        description: "A poor family schemes to become employed by a wealthy household by posing as unrelated individuals.",
        price: 8.99,
        image: "https://example.com/images/parasite.jpg"
      }
    ],
    currentView: "all", // Возможные значения: "all", "discounts", "bucet", "profile"
    user: null, // Данные пользователя
    isLoadingUser: false, // Флаг загрузки профиля
  };

  componentDidMount() {
    // Проверяем, есть ли токены в cookies
    const accessToken = this.getCookie("accessToken");
    if (accessToken) {
      this.fetchUserData(accessToken);
    }
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  fetchUserData = async (accessToken) => {
    try {
      this.setState({ isLoadingUser: true });
      const response = await axios.get("http://127.0.0.1:8000/users/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        this.setState({ user: response.data });
      } else {
        this.setState({ user: null });
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      this.setState({ user: null });
    } finally {
      this.setState({ isLoadingUser: false });
    }
  };

  toggleView = (view) => {
    this.setState({ currentView: view });
  };

  renderContent() {
    const { currentView, products, user, isLoadingUser } = this.state;

    if (currentView === "profile") {
      if (isLoadingUser) return <p>Загрузка...</p>;
      return user ? <ProfilePage user={user} toggleView={this.toggleView} /> : <AuthPage onLogin={this.fetchUserData} />;
    }

    switch (currentView) {
      case "bucet":
        return <CartPage toggleView={this.toggleView} products={products} />;
      
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
