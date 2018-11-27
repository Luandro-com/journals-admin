import App from '../components/App'
import { Query } from 'react-apollo'
import EDITIONS from '../queries/editions.gql'
import EditionItem from '../components/EditionItem'

export default () => (
  <App>
    <Query query={EDITIONS}>
      {({ loading: loadingEditions, error: errorEditions, data: dataEditions }) => {
        if (loadingEditions) return <h1>Loading</h1>
        if (errorEditions) {
          console.log(errorEditions)
          return <h1>Error</h1>
        }
        if (dataEditions) {
          return (
            <div className="editionsList">
              {dataEditions.editions.map(p => <EditionItem key={p.id} {...p} />)}
            </div>
          )
        }
      }}
    </Query>
    <style jsx>{`
      .editionsList {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-flow: row wrap;
      }
    `}</style>
  </App>
)
