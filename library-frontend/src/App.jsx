import { useState } from "react";
import { gql, useQuery } from '@apollo/client';
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
      id
    }
  }
`
const ALL_BOOKS = gql`
  query {
    allBooks  {
      title
      author
      published
      genres
      id
    }
  }
`

const App = () => {
  const [page, setPage] = useState("authors");
  const authorData = useQuery(ALL_AUTHORS)
  const bookData = useQuery(ALL_BOOKS)

  if (authorData.loading)  {
    return <div>loading...</div>
  }

  if (bookData.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={authorData.data.allAuthors} />

      <Books show={page === "books"} books={bookData.data.allBooks} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
