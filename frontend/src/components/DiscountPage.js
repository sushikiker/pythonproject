import React from "react";
import Filter from "./Filter"; // Подключаем компонент товара

class DiscountPage extends React.Component {
  render() {
    // Фильтруем товары, оставляя только те, у которых есть скидка
    const discountedProducts = this.props.products.filter(product => product.discount_price);

    return (
      
        
        <div className="body1">
          {discountedProducts.length > 0 ? (
            discountedProducts.map(product => <Filter key={product.id} obj={product} />)
          ) : (
            <p >Нет товаров со скидками 😔</p>
          )}
        </div>
    
    );
  }
}

export default DiscountPage;
