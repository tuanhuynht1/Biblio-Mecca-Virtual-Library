import React, { Component } from "react";
import Book from "./Book";

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
            <Book book={book} key={book.isbn} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
