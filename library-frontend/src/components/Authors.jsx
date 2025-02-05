import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import Select from 'react-select';

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $born
    ) {
      name,
      born,
      id
    }
  }
`

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  // const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [ editAuthor ] = useMutation(EDIT_AUTHOR)

  if (!props.show) {
    return null
  }
  console.log(name)
  // const authors = []
  const authors = props.authors
  const options = authors.map( (author) => { return {
    value: author.name,
    label: author.name
  }})

  console.log(options)
  const submit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name, born } })

    setName('')
    setBorn('')
    console.log("submitting")
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Set birthyear</h3>
        <form onSubmit = {submit}>
          <div>
          <Select
            defaultValue={name}
            onChange={(e) => {
              console.log(e)
              setName(e.value)
            }}
            options={options}
          />
            {/* name
            <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            /> */}
            </div>
            <div>
            born
            <input
              value={born}
              onChange={({ target }) => setBorn(Number(target.value))}
            />
            </div>
            <button type="submit">update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
