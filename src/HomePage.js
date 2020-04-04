import React, { Component } from "react";
import SearchForm from "./SearchForm";
import Header from "./Header";

class HomePage extends Component {
  state = {
    booklist: [],
  };

  changeBookList = (data) => {
    this.setState({
      booklist: data,
    });
  };

  render() {
    return (
      <div>
        <Header />
        <SearchForm
          changeBookList={this.changeBookList.bind(this)}
          data={this.state.booklist}
        />
      </div>
    );
  }
}

export default HomePage;
