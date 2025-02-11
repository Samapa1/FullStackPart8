import { useState, useEffect } from "react"
import { useMutation, useApolloClient } from '@apollo/client'
import { LOGIN, USERDATA } from "../queries"

const LoginForm = ( { show, setToken }) => {
    const apolloClient = useApolloClient();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN, {
        // refetchQueries: [  {query: USERDATA} ],
        onError: (error) => {
            console.log(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if ( result.data ) {
          console.log("setting token")
          const token = result.data.login.value
          setToken(token)
          localStorage.setItem('user-token', token)
          apolloClient.refetchQueries({ include: [USERDATA] })
        }
      }, [result.data])
    

    const submit = async (event) => {
        event.preventDefault()
        login({  variables: { username, password } })
        console.log(`submitting ${username} ${password}`)

        setUsername('')
        setPassword('')
    }

    if (! show) {
        return null
      }
    

    return (
        <div>
            <h3>Log in to app</h3>
            <form onSubmit={submit}>
                <div>
                    username
                    <input
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">log in</button>
            </form>
        </div>
    )
}

export default LoginForm