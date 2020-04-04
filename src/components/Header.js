import React, { Component } from "react";

// take in message as property, default message displays library name
const Header = ({ message = "The Biblio Mecca" }) => {
  return <h1>{message}</h1>;
};

export default Header;
