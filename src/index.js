import React, { Component } from "react";
import { render } from "react-dom";
import Home from "./Home";
import NavBar from "./components/NavBar";

// this file is the root of the React app
// it will route every page and determine what main component to render
// it will include the state of the entire application

class App extends Component {
  // global state component
  state = {
    accountInfo: null,
  };

  // set account info as global data
  setAccountInfo(data) {
    this.setState({
      accountInfo: {
        username: data.username,
        fname: data.fname,
        lname: data.lname,
        DOB: data.DOB,
        address: data.adress,
        phone: data.phone,
      },
    });
  }

  render() {
    const { accountInfo } = this.state;
    // will route to other containers (Home, SignUp, Login, Account)
    return (
      <div>
        <NavBar
          /* NavBar set to patron view if account info exists */
          patronView={accountInfo != null}
          setAccountInfo={this.setAccountInfo.bind(this)}
        />
        <Home />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
