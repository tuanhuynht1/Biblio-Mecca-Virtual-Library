import React, { Component } from "react";

const GenInfoMenu = () => {
  return (
    <li className="dropdown">
      <a className="dropdown-toggle" data-toggle="dropdown">
        General Info<span className="caret"></span>
      </a>
      <ul className="dropdown-menu">
        <li>
          <a href="/api">Policies and Procedure</a>
        </li>
        <li>
          <a href="/api">Address & Visiting</a>
        </li>
        <li>
          <a href="/api">About Us</a>
        </li>
      </ul>
    </li>
  );
};

export default GenInfoMenu;
