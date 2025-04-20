import React from "react";
import "./App.css";

import Aside from "./components/Aside/Aside";
import HomePage from "./pages/HomePage/HomePage";
import Cart from "./pages/Cart/Cart";
// import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel/AdminPanel";

import Auth from "./components/auth/auth";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: "home", // Начальное представление
    };
  }

  toggleView = (view) => {
    this.setState({ currentView: view });
  };

  renderContent() {
    const { currentView } = this.state;

    switch (currentView) {
      case "home":
        return <HomePage />;
      case "bucet":
        return <Cart />;
      // case "profile":
      //   return <ProfilePage />;
      case "admin":
        return <AdminPanel />;
      default:
        return <HomePage />;
    }
  }

  render() {
    return (
      <div className="app-wrapper">
        <header className="header">
          <h1>AIR Tickets</h1>
          <Auth />
        </header>

        <main className="main">
          <Aside toggleView={this.toggleView} />
          <div class="main-content">
            {this.renderContent()}
          </div>
        </main>
        <footer className="footer">
          <p>Igor Ranchenko | Ruslan Auyelbekov | Andrey Girsky</p>
        </footer>
      </div>
    );
  }
}

export default App;