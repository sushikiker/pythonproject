import React from "react";
import Filter from './Filter';
class CartPage extends React.Component {
  
  constructor(props) {
    super(props);
    const cookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("cart="));
    const cart = cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) : [];

    this.state = {
      cartItems: cart,
    };
  }

  // Стрелочная версия — нормально, если использовать поля класса (modern JS)
  getCartFromCookies = () => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cart='));

    return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];
  };

  handleRemove = (productId) => {
    const newCart = this.state.cartItems.filter(id => id !== productId);
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(newCart))}; path=/; max-age=604800`;
    this.setState({ cartItems: newCart });
  };
  render() {
    const sampleItems = this.props.products;

    const cartIds = this.getCartFromCookies();
    const filteredItems = sampleItems.filter(item => cartIds.includes(item.id));

    return (
      <div className="body1">
         <h3>Товары в корзине</h3>
          <div className="items-grid">
          <div className="products-scroll-container">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="product-wrapper">
                <Filter key={item.id} obj={item}  isInCart={true} onRemove={this.handleRemove}/> </div>
              ))
            ) : (
              <p>Корзина пуста.</p>
            )}
          </div> </div>
        </div>
      
    );
  }
}

export default CartPage;

