import React from "react";
import Filter from './Filter';

class Body extends React.Component {
  render() {
    const { products } = this.props;

    return (
      <div className="body1">
        {/* Проверяем, есть ли товары в props */}
        {products.length > 0 ? (
          products.map((obj) => (
            <div key={obj.id} className="product-wrapper">
              {/* Передаем каждый товар в компонент Filter */}
              <Filter obj={obj} key={obj.id} availableSeats={[2, 5, 8, 10]} />
            </div>
          ))
        ) : (
          <p>Нет товаров для отображения.</p>
        )}
      </div>
    );
  }
}

export default Body;
