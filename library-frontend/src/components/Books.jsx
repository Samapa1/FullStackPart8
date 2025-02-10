import { useState } from "react";
import { Fragment } from "react";

const Books = (props) => {
  const books = props.books
  const [genre, setGenre] = useState("all genres")
  const [filteredBooks, setFilteredBooks] = useState(props.books)

  if (!props.show) {
    return null
  }

  const combinedGenres = ["all genres"]
      
  books.forEach(book => book.genres.forEach(g => !combinedGenres.includes(g) ? combinedGenres.push(g) : undefined))

  const selectGenre = (g) => {
    setGenre(g)

    if (g === "all genres") {
      console.log(books)
      setFilteredBooks(books)
      console.log(filteredBooks)
    }
    else {
      const filtered = books.filter(book => { return book.genres.includes(g)
      })
      setFilteredBooks(filtered)
      console.log(genre)
    }
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
          {filteredBooks.map((b) => (
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
