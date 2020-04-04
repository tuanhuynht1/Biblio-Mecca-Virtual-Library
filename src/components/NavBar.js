import React, { Component } from "react";
import GenInfoMenu from "./GenInfoMenu";
import {
  LoginButton,
  LogoutButton,
  SignUpButton,
  AccountInfoButton,
} from "./NavBarButtons";

const NavBar = ({ patronView, setAccountInfo }) => {
  console.log(patronView);
  return (
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            The Biblio Mecca
          </a>
        </div>

        <ul className="nav navbar-nav">
          {patronView ? <AccountInfoButton /> : <div></div>}
        </ul>

        <ul className="nav navbar-nav navbar-right">
          {patronView ? <div></div> : <SignUpButton />}
          {patronView ? <LogoutButton /> : <LoginButton />}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
