import React from 'react'
import { Query, Mutation } from 'react-apollo'
import App from '../components/App'
import CONTENT from '../queries/content.gql'
import JournalGeneral from '../components/JournalGeneral'
import JournalAbout from '../components/JournalAbout'

import Loading from '../components/Loading'

export default (props) => {
  return (
    <App>
      <Query query={CONTENT}>
        {({ loading: loadingContent, error: errorContent, data: dataContent }) => {
          if (loadingContent) return <Loading />
          return (
            <div>
              <JournalGeneral content={dataContent.content}  />
              <JournalAbout content={dataContent.content}  />
            </div>
          )
        }}
      </Query>
    </App>
  )
}
