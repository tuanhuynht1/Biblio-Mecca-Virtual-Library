import React, { Component } from "react";
import GenInfoMenu from "./GenInfoMenu";
import SignUpButton from "./SignUpButton";
import LoginButton from "./LoginButton";

const NavBar = () => {
  return (
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            The Biblio Mecca
          </a>
        </div>

        <ul className="nav navbar-nav">
          <GenInfoMenu />
        </ul>

        <ul className="nav navbar-nav navbar-right">
          <SignUpButton />
          <LoginButton />
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
