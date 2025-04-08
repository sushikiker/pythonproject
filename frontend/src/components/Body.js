import React from "react";
import Filter from './Filter';
class Body extends React.Component{
 
  render(){


    return(
        <div className="body1">
         
          {this.props.products.map(obj => (
                    <Filter obj={obj} key={obj.id} />
                ))}
        </div>
    )
}

}
export default Body