import React, { Component } from "react";

class LoginButton extends Component {
  render() {
    return (
      <li>
        <a href="/api">
          <span className="glyphicon glyphicon-log-in"></span> Login
        </a>
      </li>
    );
  }
}

class LogoutButton extends Component {
  render() {
    return (
      <li>
        <a href="/api">
          <span className="glyphicon glyphicon-log-in"></span> Logout
        </a>
      </li>
    );
  }
}

class AccountInfoButton extends Component {
  render() {
    return (
      <li>
        <a href="/api">
          <span className="glyphicon glyphicon-log-in"></span> Account Info
        </a>
      </li>
    );
  }
}

const SignUpButton = () => {
  return (
    <li>
      <a href="/api">
        <span className="glyphicon glyphicon-user"></span> Sign Up
      </a>
    </li>
  );
};

export { LoginButton, LogoutButton, SignUpButton, AccountInfoButton };
