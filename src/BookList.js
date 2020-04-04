import React, { Component } from "react";

const BookList = ({ results = [] }) => {
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

export default BookList;
