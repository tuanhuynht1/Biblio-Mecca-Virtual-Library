import React, { Component } from "react";
import { render } from "react-dom";

const Header = ({ message = "The Biblio Mecca" }) => {
  return <h1>{message}</h1>;
};

class SearchForm extends Component {
  onClickHandler(event) {
    event.preventDefault();
    console.log("CATEGORY", document.getElementById("select-category").value);
    console.log("SEARCH FOR", document.getElementById("search-for").value);
  }

  render() {
    return (
      <form className="search">
        <button onClick={this.onClickHandler}>
          <i className="fa fa-search"></i>
        </button>
        <input id="search-for" type="text" placeholder="Search A Book..." />
        <select id="select-category">
          <option value="Title">Title</option>
          <option value="ISBN">ISBN</option>
          <option value="Author">Author</option>
          <option value="Category">Category</option>
          <option value="Format">Format</option>
        </select>
      </form>
    );
  }
}

render(
  <div>
    <Header />
    <SearchForm />
  </div>,
  document.getElementById("root")
);

//   <!--Body-->
//   <br /><br /><br /><br />
//   <h1 style="font-size: 70;">The Biblio Mecca</h1>
//   <br /><br /><br /><br /><br />

//   <form class="search" action="#" style="margin: auto; max-width: 1000px;">
//     <button type="submit"><i class="fa fa-search"></i></button>
//     <input type="text" placeholder="Search A Book..." />
//     <select id="searchFor" name="searchFor">
//       <option value="ISBN">ISBN</option>
//       <option value="Title">Title</option>
//       <option value="Author">Author</option>
//       <option value="Category">Category</option>
//       <option value="Format">Format</option>
//     </select>
//   </form>
// </body>
