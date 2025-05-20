import React from "react";

class Aside extends React.Component{
 
  render(){


    return(
        <aside>
        <h1>Каталог</h1>
        <p><a href="#" onClick={() => this.props.toggleView("all")}>Главная страница</a></p>
        <p><a href="#" onClick={() => this.props.toggleView("discounts")}>Скидки</a></p>
        <p><a href="#" onClick={() => this.props.toggleView("bucet")}>Корзина</a></p>
        <p><a href="#" onClick={() => this.props.toggleView("profile")}>Профиль</a></p>
        </aside>
    )
}

}
export default Aside