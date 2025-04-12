import React from "react";
import Filter from './Filter';

class Body extends React.Component {
  render() {
    const { products } = this.props;

    return (
      <div className="body1">
      {products.length > 0 ? (
        <div className="products-scroll-container">
          {products.map((obj) => (
            <div key={obj.id} className="product-wrapper">
              <Filter obj={obj} availableSeats={[2, 5, 8, 10]} />
            </div>
          ))}
        </div>
      ) : (
        <p>Нет товаров для отображения.</p>
      )}
    </div>
  
    );
  }
}

export default Body;
