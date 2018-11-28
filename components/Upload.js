import { Mutation } from 'react-apollo'
import UPLOAD_FILE from '../queries/uploadFile.gql'

export default () => (
  <Mutation
    mutation={UPLOAD_FILE}
  >
    {mutate => (
      <input
        type="file"
        required
        onChange={({
          target: {
            validity,
            files: [file]
          }
        }) => {
          console.log('FILE client', file)
          validity.valid
          mutate({ variables: { file } })
        }}
      />
    )}
  </Mutation>
)  
