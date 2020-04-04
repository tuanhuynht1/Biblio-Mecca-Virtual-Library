import React, { Component } from "react";

const Book = ({ book }) => {
  return (
    <tr className="search-entry">
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>{book.isbn}</td>
      <td>{book.format}</td>
    </tr>
  );
};

export default Book;
