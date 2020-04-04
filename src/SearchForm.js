import React, { Component } from "react";
import axios from "axios";
import BookList from "./BookList";

class SearchForm extends Component {
  onChangeHandler(event) {
    const { changeBookList } = this.props;
    const input = document.getElementById("search-for");
    if (input && input.value !== "") {
      const search = input.value;
      const by = document.getElementById("select-category").value.toLowerCase();
      console.log(search, by);
      axios
        .get(`/api/searchBook/${search}/${by}`)
        .then((res) => {
          // console.log(res.data);
          changeBookList(res.data);
        })
        .catch(console.error);
    } else {
      changeBookList([]);
    }
  }
  onClickHandler(event) {
    event.preventDefault();
    const { changeBookList } = this.props;

    const input = document.getElementById("search-for");
    if (input && input.value !== "") {
      const search = input.value;
      const by = document.getElementById("select-category").value.toLowerCase();
      console.log(search, by);
      axios
        .get(`/api/searchBook/${search}/${by}`)
        .then((res) => {
          // console.log(res.data);
          changeBookList(res.data);
        })
        .catch(console.error);
    } else {
      changeBookList([]);
    }
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        <form className="search">
          <button onClick={this.onClickHandler.bind(this)}>
            <i className="fa fa-search"></i>
          </button>
          <input
            id="search-for"
            type="text"
            placeholder="Search A Book..."
            onChange={this.onChangeHandler.bind(this)}
          />
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

        {data.length == 0 ? <div></div> : <BookList results={data} />}
      </div>
    );
  }
}

export default SearchForm;
