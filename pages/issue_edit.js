import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { withRouter } from 'next/router'

import CREATE_ISSUE from '../queries/issueCreate.gql'
import UPDATE_ISSUE from '../queries/issueUpdate.gql'
import ISSUE from '../queries/issue.gql'
import IssueForm from '../components/forms/issue'

import App from '../components/App'
import Loading from '../components/Loading'

const NewIssue = ({ router: { query: { key } } }) => {
  return (
    <App>
      {!key && <Mutation mutation={CREATE_ISSUE}>
        {(createIssue, { error: errorCreateIssue, client: clientUpdate }) => {
          return (
            <IssueForm onSubmit={async (values) => {
              const res = await createIssue({ variables: { input: values } })
              console.log('CREATE RES', res)
              if (errorCreateIssue) console.log('ERROR do something...', errorCreateIssue)
              return clientUpdate.writeData({ data: {
                issue: {
                  ...res.data.createIssue
                }
              }})
            }}/>
          )
        }}
      </Mutation>}
      {key && 
        <Query query={ISSUE} variables={{ issueKey: key }}>
          {({ loading: loadingIssue, error: errorIssue, data: dataIssue }) => {
            if (loadingIssue) return <Loading />
            return (
              <Mutation mutation={UPDATE_ISSUE}>
                {(updateIssue, { error: errorupdateIssue, client: clientUpdate }) => {
                  return (
                    <IssueForm
                      onSubmit={async (values) => {
                        const res = await updateIssue({ variables: { input: values, issueId: dataIssue.issue.id } })
                        console.log(res)
                        if (errorupdateIssue) console.log('ERROR do something...')
                        return clientUpdate.writeData({ data: {
                          issue: {
                            ...res.data.updateIssue
                          }
                        }})
                      }}
                      issue={dataIssue.issue}
                    />
                  )
                }}
              </Mutation>
            )
          }}
        </Query>
      }
    </App>
  )
}

export default withRouter(NewIssue)