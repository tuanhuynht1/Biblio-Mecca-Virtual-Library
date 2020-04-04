import React, { Component } from "react";

const Header = ({ message = "The Biblio Mecca" }) => {
  return <h1>{message}</h1>;
};

export default Header;
