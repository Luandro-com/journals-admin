import App from '../components/App'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import ARTICLES from '../queries/articles.gql'
import SubmissionTable from '../components/SubmissionTable'
import Loading from '../components/Loading'

const styles = {
  fab: {
    position: 'fixed',
    right: '5%',
    bottom: '5%'
  },
}

function organizeByIssue(articles) {
  return articles.reduce((groups, currentValue) => {
    if ( groups.indexOf(currentValue.issue.title) === -1 ) {
      groups.push(currentValue.issue.title)
    }
    return groups
  }, []).map((group) => {
    return {
        issue: group,
        articles: articles.filter((article) => {
          return article.issue.title === group
        }).map((article) => { return article })
    }
  })
}

let Submissions =  ({ classes }) => (
  <App>
    <Query query={ARTICLES}>
      {({ loading: loadingArticles, error: errorArticles, data: dataArticles }) => {
        if (loadingArticles) return <Loading />
        if (errorArticles) {
          console.log(errorArticles)
          return <h1>Error</h1>
        }
        if (dataArticles && dataArticles.articles) {
          const notPayedArticles = dataArticles.articles.filter(a => !a.payment)
          const notPayedArticlesOrganizedByIssues = organizeByIssue(notPayedArticles)
          const payedArticles = dataArticles.articles.filter(a => a.payment)
          const payedArticlesOrganizedByIssues = organizeByIssue(payedArticles)

          return (
            <div>
              {payedArticles.length > 0 && <h2>Artigos Submetidos</h2>}
              {payedArticles.length < 1 && <div>
                <h3>Nenhum artigo pago ainda...</h3>
              </div>}
              {payedArticlesOrganizedByIssues.map(e => <div key={e.issue}>
                <SubmissionTable
                  title={e.issue}
                  articles={e.articles}
                  issueId={e.articles[0].issue.id}
                />
              </div>)}
              {notPayedArticles.length > 0 && <h2>não pagos</h2>}
              {notPayedArticles.length < 1 && <div>
                <h3>Nenhum artigo submetido ainda...</h3>
              </div>}
              {notPayedArticlesOrganizedByIssues.map(e => <div key={e.issue}>
                <SubmissionTable
                  title={e.issue}
                  articles={e.articles}
                  issueId={e.articles[0].issue.id}
                />
              </div>)}
              <Fab color="primary" aria-label="Add" className={classes.fab}>
                <AddIcon />
              </Fab>
            </div>
          )
        }
      }}
    </Query>
  </App>
)

Submissions.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Submissions)