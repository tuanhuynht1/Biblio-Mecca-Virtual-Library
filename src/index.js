import React, { Component } from "react";
import { render } from "react-dom";
import SearchForm from "./SearchForm";
import Header from "./Header";

// class HomePage extends Component {
//   render() {
//     return(

//     )
//   }
// };

render(
  <div>
    <Header />
    <SearchForm />
  </div>,
  document.getElementById("root")
);
