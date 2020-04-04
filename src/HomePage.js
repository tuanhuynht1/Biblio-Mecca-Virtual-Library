import React, { Component } from "react";
import SearchForm from "./components/SearchForm";
import Header from "./components/Header";

class HomePage extends Component {
  state = {
    // empty search result on load,  pass booklist to children to update
    booklist: [],
  };

  // call back function to update booklist, passed on to children
  changeBookList = (data) => {
    this.setState({
      booklist: data,
    });
  };

  render() {
    return (
      <div>
        {/* render header  */}
        <Header />
        {/* render search form, pass update function to search form to handle */}
        <SearchForm
          changeBookList={this.changeBookList.bind(this)}
          data={this.state.booklist}
        />
      </div>
    );
  }
}

export default HomePage;
