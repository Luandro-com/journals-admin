import App from '../components/App'
import { Query } from 'react-apollo'
import PAYED_ARTICLES from '../queries/payedArticles.gql'
import SubmissionTable from '../components/SubmissionTable'
import Loading from '../components/Loading'

export default () => (
  <App>
    <Query query={PAYED_ARTICLES}>
      {({ loading: loadingArticles, error: errorArticles, data: dataArticles }) => {
        if (loadingArticles) return <Loading />
        if (errorArticles) {
          console.log(errorArticles)
          return <h1>Error</h1>
        }
        if (dataArticles && dataArticles.payedArticles) {
          const organizedByIssues = dataArticles.payedArticles.reduce((groups, currentValue) => {
            if ( groups.indexOf(currentValue.issue.title) === -1 ) {
              groups.push(currentValue.issue.title)
            }
            return groups
          }, []).map((group) => {
            return {
                issue: group,
                articles: dataArticles.payedArticles.filter((article) => {
                  return article.issue.title === group
                }).map((article) => { return article })
            }
          })

          return (
            <div>
              {dataArticles.payedArticles.length < 1 && <h3>Nenhum artigo submetido ainda...</h3>}
              {organizedByIssues.map(e => <SubmissionTable
                title={e.issue}
                articles={e.articles}
                issueId={e.articles[0].issue.id}
                key={e.issue}
              />)}
            </div>
          )
        }
      }}
    </Query>
  </App>
)
