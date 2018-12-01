import App from '../components/App'
import { Query } from 'react-apollo'
import ISSUES from '../queries/issues.gql'
import IssueItem from '../components/IssueItem'
import Loading from '../components/Loading'

export default () => (
  <App>
    <Query query={ISSUES}>
      {({ loading: loadingIssues, error: errorIssues, data: dataIssues }) => {
        if (loadingIssues) return <Loading />
        if (errorIssues) {
          console.log(errorIssues)
          return <h1>Error</h1>
        }
        if (dataIssues) {
          return (
            <div className="issuesList">
              {dataIssues.issues.map(p => <IssueItem key={p.id} {...p} />)}
            </div>
          )
        }
      }}
    </Query>
    <style jsx>{`
      .issuesList {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-flow: row wrap;
      }
    `}</style>
  </App>
)
