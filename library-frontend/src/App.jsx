import { useState } from "react";
import { useQuery, useApolloClient } from '@apollo/client';
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"

import { ALL_BOOKS, ALL_AUTHORS } from './queries'

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const authorData = useQuery(ALL_AUTHORS)
  const bookData = useQuery(ALL_BOOKS)

  if (authorData.loading)  {
    return <div>loading...</div>
  }

  if (bookData.loading)  {
    return <div>loading...</div>
  }

  const logout = () => {
    setPage("authors")
    setToken(null)
    localStorage.clear()
    client.resetStore()

  }

  console.log(token)
  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? 
            <>
            <button onClick={() => setPage("add")}>add a book</button> 
            <button onClick={() => setPage("recommendations")}>recommendations</button> 
            <button onClick={() => logout()}>log out</button>
            </>
            : 
            <button onClick={() => setPage("login")}>log in</button>
        }
   
      </div>

      <Authors show={page === "authors"} authors={authorData.data.allAuthors} />

      <Books show={page === "books"} books={bookData.data.allBooks} />

      <NewBook show={page === "add"} />
      
      <Recommendations show={page === "recommendations"} books={bookData.data.allBooks}/>

      <LoginForm show={page === "login"} setToken={setToken}/>
    </div>
  );
};

export default App;
