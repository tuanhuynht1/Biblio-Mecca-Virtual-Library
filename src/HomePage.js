import React, { Component } from "react";
import SearchForm from "./SearchForm";
import Header from "./Header";

class HomePage extends Component {
  state = {
    // empty search result on load,  pass booklist to children to update
    booklist: [],
  };

  // call back function to update booklist, passed on to children
  changeBookList = (data) => {
    this.setState({
      booklist: data,
    });
  };

  render() {
    return (
      <div>
        {/* render header  */}
        <Header />
        {/* render search form, pass update function to search form to handle */}
        <SearchForm
          changeBookList={this.changeBookList.bind(this)}
          data={this.state.booklist}
        />
      </div>
    );
  }
}

const NavBar = () => {
  return (
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="home.html">
            The Biblio Mecca
          </a>
        </div>
        <ul className="nav navbar-nav">
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown">
              General Info<span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a href="policies.html">Policies and Procedure</a>
              </li>
              <li>
                <a href="address.html">Address & Visiting</a>
              </li>
              <li>
                <a href="aboutUs.html">About Us</a>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a href="signup.html">
              <span className="glyphicon glyphicon-user"></span> Patron Sign Up
            </a>
          </li>
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
              <span className="glyphicon glyphicon-log-in"></span> Login
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a href="login.html">As Patron</a>
              </li>
              <li>
                <a href="login.html">As Librarian</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default HomePage;
