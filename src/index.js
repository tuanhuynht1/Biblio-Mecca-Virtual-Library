import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";

const Header = ({ message = "The Biblio Mecca" }) => {
  return <h1>{message}</h1>;
};

class SearchForm extends Component {
  state = {
    results: [],
  };

  onClickHandler(event) {
    event.preventDefault();
    const search = document.getElementById("search-for").value;
    const by = document.getElementById("select-category").value.toLowerCase();
    console.log(search, by);
    axios
      .get(`/api/searchBook/${search}/${by}`)
      .then((res) => {
        // console.log(res.data);
        this.setState({
          results: res.data,
        });
      })
      .catch(console.error);
  }

  render() {
    const { results } = this.state;
    return (
      <div>
        <form className="search">
          <button onClick={this.onClickHandler.bind(this)}>
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

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        {results.length == 0 ? (
          <div></div>
        ) : (
          results.map((book) => (
            <div className="search-entry" key={book.isbn}>
              {book.title}, {book.author}, {book.format}, {book.isbn}
            </div>
          ))
        )}
      </div>
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
