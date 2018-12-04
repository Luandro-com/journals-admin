import React, { Component } from 'react'
import { Form, Field } from 'react-final-form'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Upload from './Upload'
import OutlineTextField from './OutlineTextField'
const validInputList = {
  title: {
    label: 'Título',
    type: 'text'
  },
  image: {
    label: 'Imagem de capa',
    type: 'file'
  },
  key: {
    label: 'Slug',
    type: 'text'
  },
  body: {
    label: 'Apresentação',
    type: 'text'
  },
  volume: {
    label: 'Volume',
    type: 'int'
  },
  number: {
    label: 'Número',
    type: 'int'
  },
  year: {
    label: 'Ano',
    type: 'text'
  },
  evaluationPeriod: {
    label: 'Périodo de Avalição',
    type: 'int'
  },
  publicationPrediction: {
    label: 'Previsão de Publicação',
    type: 'date'
  },
  contact: {
    label: 'Contato',
    type: 'text'
  },
  startCall: {
    label: 'Início da chamada',
    type: 'date'
  },
  endCall: {
    label: 'Prazo da chamada',
    type: 'date'
  },
}

const validate = values => {
  const errors = {}
  // if (!values.userName) {
  //   errors.userName = 'Required'
  // }
  return errors
}

const cleanObject = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (Array.isArray(obj[prop]) && obj[prop]) 
    if (obj[prop]) { newObj[prop] = obj[prop]; }
  });
  return newObj;
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  column: {
    flexBasis: '33.33%',
  },
});

class JournalGeneralForm extends Component {
  state = {
    uploaded: null,
  }

  clearUpload = () => this.setState({ uploaded: null })

  handleUpload = (uploaded, change, blur) => {
    blur('image')
    change('image', uploaded)
    this.setState({ uploaded })
  }

  render() {
    const { classes, onSubmit, issue } = this.props
    let formatedIssue = {}
    Object.keys(issue).map(i => {
      if ((new Date(issue[i]) !== "Invalid Date") && !isNaN(new Date(issue[i]))) {
        console.log(issue[i])
        formatedIssue[i] = issue[i]
      } else {
        formatedIssue[i] = issue[i]
      }
    })
    console.log(formatedIssue)
    return (
      <Form
        initialValues={issue ? issue : {}}
        onSubmit={async e => {
          let cleanList = {}
          Object.keys(validInputList).map(valid => {
            Object.keys(e).map(i => {
              if (i === valid && e[i] !== null) {
                if (0 === e[i] % (!isNaN(parseFloat(e[i])) && 0 <= ~~e[i])) {
                  cleanList[i] = parseInt(e[i])
                } else {
                  cleanList[i] = e[i]
                }
              }
            })
          })
          
          console.log('cleanList', cleanList)
          await onSubmit(cleanList)
          this.clearUpload()
        }}
        validate={validate}
        render={({ handleSubmit, pristine, invalid, form: { change, blur } }) => (
          <form onSubmit={handleSubmit}>
            <Paper className={classes.root} elevation={1}>
              <span>{issue.key}</span>
              <div className={classes.column}>
                <Typography component="h4" variant="h4">Capa</Typography>
              </div>
              <div className={classes.column}>
                {(issue.logo || this.state.uploaded) && <img src={this.state.uploaded || issue.logo} />}
                {(!this.state.uploaded && !issue.logo) && <h4>Sem logo...</h4>}
              </div>
              <div className={classNames(classes.column, classes.helper)}>
                <Typography variant="caption">
                  Imagem de capa da edição
                  <br />
                  <Field name="image">
                    {(fieldprops) => <Upload
                      {...fieldprops}
                      accept="image/*"
                      handleUpload={url => this.handleUpload(url, change, blur)}
                    /> }
                  </Field>
                </Typography>
              </div>
              {Object.keys(validInputList)
                .filter(k => {
                  if(validInputList[k].type !== 'file') {
                    return validInputList[k]
                  }
                })
                .map(input => (
                  <div className={classes.column} key={input}>
                    <Field
                      name={input}
                      component={OutlineTextField}
                      type={validInputList[input].type}
                      label={validInputList[input].label}
                    />
                  </div>
                ))
              }
              <Divider />
              <Button size="small">Cancel</Button>
              <Button size="small" color="primary" type="submit" disabled={pristine || invalid}>
                Salvar
              </Button>
          </Paper>
          <style jsx>{`
            img {
              max-width: 300px;
              max-height: 300px;
            }
          `}</style>
        </form>
      )} />      
    )
  }
}

JournalGeneralForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(JournalGeneralForm)


