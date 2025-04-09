import React from "react";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.filt = React.createRef();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered value:", this.filt.current.value);
  };

  render() {
    return (
      <div>
        <header className="header">
          <div className="header2">
            <div className="headerText" style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
              AIR Bilets
            </div>
            <form onSubmit={this.handleSubmit}>
              <input id="enter" ref={this.filt} />
              <button type="submit">Enter</button>
            </form>
          </div>
        </header>
      </div>
    );
  }
}

export default Header;
