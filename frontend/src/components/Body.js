import React from "react";
import Filter from './Filter';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    };
    this.filt = React.createRef();

    this.handleSubmit = (e) => {
      e.preventDefault();
      this.setState({ searchQuery: this.filt.current.value.toLowerCase() });
    };
  }

  render() {
    const filteredProducts = this.props.products.filter(product =>
      product.name.toLowerCase().includes(this.state.searchQuery) || product.category.toLowerCase().includes(this.state.searchQuery) ||
      product.description.toLowerCase().includes(this.state.searchQuery)
    );

    return (
      <div className="body1">
        <form className="search-form" onSubmit={this.handleSubmit}>
          <input
            id="enter"
            ref={this.filt}
            placeholder="Поиск по названию или описанию..."
          />
          <button type="submit">Найти</button>
        </form>

        {filteredProducts.length > 0 ? (
          <div className="products-scroll-container">
            {filteredProducts.map((obj) => (
              <div key={obj.id} className="product-wrapper">
                <Filter obj={obj} />
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
