import App from '../components/App'
import { Query } from 'react-apollo'
import PAYED_ARTICLES from '../queries/payedArticles.gql'
import SubmissionTable from '../components/SubmissionTable'

export default () => (
  <App>
    <Query query={PAYED_ARTICLES}>
      {({ loading: loadingArticles, error: errorArticles, data: dataArticles }) => {
        if (loadingArticles) return <h1>Loading</h1>
        if (errorArticles) {
          console.log(errorArticles)
          return <h1>Error</h1>
        }
        if (dataArticles && dataArticles.payedArticles) {
          const organizedByEditions = dataArticles.payedArticles.reduce((groups, currentValue) => {
            if ( groups.indexOf(currentValue.edition.title) === -1 ) {
              groups.push(currentValue.edition.title)
            }
            return groups
          }, []).map((group) => {
            return {
                edition: group,
                articles: dataArticles.payedArticles.filter((article) => {
                  return article.edition.title === group
                }).map((article) => { return article })
            }
          })

          return (
            <div>
              {dataArticles.payedArticles.length < 1 && <h3>Nenhum artigo submetido ainda...</h3>}
              {organizedByEditions.map(e => <SubmissionTable
                title={e.edition}
                articles={e.articles}
                editionId={e.articles[0].edition.id}
                key={e.edition}
              />)}
            </div>
          )
        }
      }}
    </Query>
  </App>
)
