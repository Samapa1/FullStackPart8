import { useState, useEffect } from "react"
import { useQuery } from '@apollo/client';
import { USERDATA } from "../queries"

const Recommendations = ( { show, books }) => {
    const userdata = useQuery(USERDATA)
    const [ favoriteGenre, setFavoriteGenre ] = useState(null)

    useEffect(() => {
        if ( userdata.data) {
            const favoritegenre = userdata.data?.me?.favoriteGenre ?? null
            setFavoriteGenre(favoritegenre)
        }
      }, [userdata])

    if (! show ) {
        return null
    }

    return (
        <div>
            <h3>
                recommendations
            </h3>
             <div>
                  <table>
                    <tbody>
                      <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                      </tr>
                      {books.filter((b) => b.genres.includes(favoriteGenre)).map((b) => (
                        <tr key={b.title}>
                          <td>{b.title}</td>
                          <td>{b.author.name}</td>
                          <td>{b.published}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
        </div>
    )
}


export default Recommendations