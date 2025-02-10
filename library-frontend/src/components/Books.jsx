import { useState } from "react";
import { Fragment } from "react";

const Books = (props) => {
  const [genre, setGenre] = useState("all")
  if (!props.show) {
    return null
  }

  const books = props.books
  console.log(books)
  const combinedGenres = []

  // books.map(book => book.genres.map(g => combinedGenres.push(g)))
  books.map(book => book.genres.map(g => !combinedGenres.includes(g) ? combinedGenres.push(g) : undefined))
  console.log(combinedGenres)
  // const allGenres = combined


  // allGenres.forEach(g => combinedGenres.push(g))
  // console.log(combinedGenres)
  const selectGenre = () => {
    console.log("selection")
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
          {books.map((b) => (
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
        {/* <div key = {g}> */}
        <button onClick={() => selectGenre()}>{g}</button> 
        </Fragment>
        // </div>
      ))}
    </div>
  )
}

export default Books
