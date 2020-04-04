import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";

const Header = ({ message = "The Biblio Mecca" }) => {
  return <h1>{message}</h1>;
};

class SearchForm extends Component {
  state = {
    data: [],
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
          data: res.data,
        });
      })
      .catch(console.error);
  }

  render() {
    const { data } = this.state;
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

        {data.length == 0 ? <div></div> : <ResultsTable results={data} />}
      </div>
    );
  }
}

const ResultsTable = ({ results = [] }) => {
  console.log(results);
  return results.length == 0 ? (
    <div></div>
  ) : (
    <div style={{ overflowY: "scroll" }}>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Format</th>
          </tr>
          {results.map((book) => (
            <tr key={book.isbn} className="search-entry">
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isbn}</td>
              <td>{book.format}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// const ResultsTable = () => {
//   return (
//     <div style={{ textAlign: "center", overflowY: "scroll" }}>
//       <table>
//         <tbody>
//           <tr>
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Points</th>
//             <th>Points</th>
//           </tr>
//           <tr>
//             <td>Jill</td>
//             <td>Smith</td>
//             <td>50</td>
//             <td>50</td>
//           </tr>
//           <tr>
//             <td>Jill</td>
//             <td>Smith</td>
//             <td>50</td>
//             <td>50</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

render(
  <div>
    <Header />
    <SearchForm />
  </div>,
  document.getElementById("root")
);
