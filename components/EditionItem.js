import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Mutation } from 'react-apollo'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import toReal from '../lib/toReal'
import DELETE_EDITION from '../queries/deleteEdition.gql'
import EDITIONS_LOCAL from '../queries/editionsLocal.gql'

const styles = {
  card: {
    width: 320,
    height: 400,
    margin: 7
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
}

function ProductItem(props) {
  const { classes, id, title, image, body, publishedCall, published, submitedArticles, selectedArticles, selectedEditorials } = props
  return (
    <Mutation mutation={DELETE_EDITION}>
      {(deleteEdition, { error: errorDelete, client: clientDelete }) => (
        <Card className={classes.card}>
          {image && <CardMedia
            component="img"
            alt={name}
            className={classes.media}
            height="140"
            image={image}
            title={name}
          />}
          <CardContent>
            {publishedCall && <span>chamada publicada</span>}
            {published && <span> | publicado</span>}
            <Typography gutterBottom variant="h5" component="h1">
              {title}
            </Typography>
            <Typography gutterBottom variant="h6" component="h5">
              Submissões
            </Typography>
            {submitedArticles.map(article => {
              return (
                <Typography gutterBottom component="h5" key={article.id}>
                  {article.title}
                </Typography>
              )
            })}
            <Typography gutterBottom variant="h6" component="h5">
              Seleções
            </Typography>
            {selectedArticles.map(article => {
              return (
                <Typography gutterBottom component="h5" key={article.id}>
                  {article.title}
                </Typography>
              )
            })}
            <Typography gutterBottom variant="h6" component="h5">
              Editoriais
            </Typography>
            {selectedEditorials.map(article => {
              return (
                <Typography gutterBottom component="h5" key={article.id}>
                  {article.title}
                </Typography>
              )
            })}
          </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Editar
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={async () => {
              const res = await deleteEdition({ variables: { editionId: id }})
              if (res && res.data.deleteEdition.id) {
                const { editions } = clientDelete.cache.readQuery({ query: EDITIONS_LOCAL})
                const newList = editions.filter(e => e.id !== res.data.deleteEdition.id)
                clientDelete.writeData({ data: {
                  editions: newList
                }})
              }
            }}>
            Deletar
          </Button>
        </CardActions>
      </Card>
      )}
    </Mutation>
  )
}

ProductItem.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ProductItem)

