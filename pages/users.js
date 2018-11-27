import App from '../components/App'
import { Query } from 'react-apollo'
import USERS from '../queries/users.gql'
import UsersTables from '../components/UsersTable'

export default () => (
  <App>
    <Query query={USERS}>
      {({ loading: loadingUsers, error: errorUsers, data: dataUsers }) => {
        if (loadingUsers) return <h1>Loading</h1>
        if (errorUsers) {
          console.log(errorUsers)
          return <h1>Error</h1>
        }
        console.log(dataUsers)
        if (dataUsers) return <UsersTables users={dataUsers.users}  />
      }}
    </Query>
  </App>
)
