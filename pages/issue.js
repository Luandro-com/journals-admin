import React from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'next/router'
import CREATE_ISSUE from '../queries/issueCreate.gql'
import UPDATE_ISSUE from '../queries/issueUpdate.gql'
import ISSUES from '../queries/issues.gql'

import IssueForm from '../components/forms/issue'

import App from '../components/App'

const NewIssue = ({ router: { query: { key } } }) => {
  return (
    <App>
      {!key && <Mutation mutation={CREATE_ISSUE}>
        {(createIssue, { error: errorCreateIssue, client: clientUpdate }) => {
          console.log('QUERY', key)
          return (
            <IssueForm onSubmit={async (values) => {
              const res = await createIssue({ variables: { input: values } })
              console.log(res)
              if (errorCreateIssue) console.log('ERROR do something...')
              return clientUpdate.writeData({ data: {
                content: {
                  ...res.data.createIssue
                }
              }})
            }}/>
          )
        }}
      </Mutation>}
      {key && 
        <Query query={ISSUES}>
          {({ loading: loadingIssues, error: errorIssues, data: dataIssues }) => {
            if (loadingIssues) return <Loading />
            return (
              <Mutation mutation={UPDATE_ISSUE}>
                {(updateIssue, { error: errorupdateIssue, client: clientUpdate }) => {
                  console.log('QUERY', key)
                  return (
                    <IssueForm onSubmit={async (values) => {
                      const res = await updateIssue({ variables: { input: values } })
                      console.log(res)
                      if (errorupdateIssue) console.log('ERROR do something...')
                      return clientUpdate.writeData({ data: {
                        content: {
                          ...res.data.updateIssue
                        }
                      }})
                    }} issues={dataIssues.issues} />
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