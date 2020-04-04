import React, { Component } from "react";
import SearchForm from "./components/SearchForm";
import Header from "./components/Header";
import BookList from "./components/BookList";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booklist: [],
    };
    this.updateBookList = this.updateBookList.bind(this);
  }

  updateBookList(data) {
    this.setState({
      booklist: data,
    });
  }

  render() {
    const { booklist } = this.state;
    return (
      <div>
        <Header />
        <SearchForm
          updateBookList={this.updateBookList}
          booklist={this.state.booklist}
        />
        {booklist.length == 0 ? <div></div> : <BookList results={booklist} />}
      </div>
    );
  }
}

export default Home;
