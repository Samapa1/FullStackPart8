import { useState } from "react";
import { Fragment } from "react";
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const books = props.books
  const [genre, setGenre] = useState(null)

  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;
  
  if (!props.show) {
    return null
  }

  const combinedGenres = ["all genres"]
      
  books.forEach(book => book.genres.forEach(g => !combinedGenres.includes(g) ? combinedGenres.push(g) : undefined))

  const selectGenre = (g) => {
    g === "all genres" ? setGenre(null) : setGenre(g) 
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
            {data.allBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
        {combinedGenres.map((g) => (
        <Fragment key = {g}>
        <button onClick={() => selectGenre(g)}>{g}</button> 
        </Fragment>
      ))}
    </div>
  )
}

export default Books
