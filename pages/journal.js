import React from 'react'
import { Query, Mutation } from 'react-apollo'
import App from '../components/App'
import CONTENT from '../queries/content.gql'
import JournalGeneral from '../components/JournalGeneral'
import Loading from '../components/Loading'

export default (props) => {
  return (
    <App>
      <Query query={CONTENT}>
        {({ loading: loadingContent, error: errorContent, data: dataContent }) => {
          if (loadingContent) return <Loading />
          return (
            <JournalGeneral content={dataContent.content}  />
          )
        }}
      </Query>
    </App>
  )
}
