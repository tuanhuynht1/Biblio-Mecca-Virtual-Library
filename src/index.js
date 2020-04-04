import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";

// this file is the root of the React app
// it will route every page and determine what main component to render
// right now we only have the homepage to render

// component, id (root found in views/index.ejs)
render(<HomePage />, document.getElementById("root"));
