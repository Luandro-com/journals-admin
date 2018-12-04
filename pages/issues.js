import App from '../components/App'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Link from 'next/link'

import { Query } from 'react-apollo'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import ISSUES from '../queries/issues.gql'
import IssueItem from '../components/IssueItem'
import Loading from '../components/Loading'

const styles = {
  fab: {
    position: 'fixed',
    right: '5%',
    bottom: '5%'
  },
}


let Issues = ({ classes }) => (
  <App>
    <Query query={ISSUES}>
      {({ loading: loadingIssues, error: errorIssues, data: dataIssues }) => {
        if (loadingIssues) return <Loading />
        if (errorIssues) {
          console.log(errorIssues)
          return <h1>Error</h1>
        }
        if (dataIssues) {
          console.log('dataIssues', dataIssues)
          return (
            <div className="issuesList">
              {dataIssues.issues.map(p => <IssueItem key={p.key} issueKey={p.key} {...p} />)}
              <Link href='/issue'>
                <Fab color="primary" aria-label="Add" className={classes.fab}>
                  <AddIcon />
                </Fab>
              </Link>
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

Issues.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Issues)