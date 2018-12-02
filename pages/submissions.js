import App from '../components/App'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import PAYED_ARTICLES from '../queries/payedArticles.gql'
import SubmissionTable from '../components/SubmissionTable'
import Loading from '../components/Loading'

const styles = {
  fab: {
    position: 'fixed',
    right: '5%',
    bottom: '5%'
  },
}

let Submissions =  ({ classes }) => (
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