import React, { Component } from 'react'
import { Form, Field } from 'react-final-form'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import isISODate from 'is-iso-date'
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

function isValidDate(dateString) {
  // First check for the pattern
  var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

  if(!regex_date.test(dateString))
  {
      return false;
  }

  // Parse the date parts to integers
  var parts   = dateString.split("-");
  var day     = parseInt(parts[2], 10);
  var month   = parseInt(parts[1], 10);
  var year    = parseInt(parts[0], 10);

  // Check the ranges of month and year
  if(year < 1000 || year > 3000 || month == 0 || month > 12)
  {
      return false;
  }

  var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  // Adjust for leap years
  if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
  {
      monthLength[1] = 29;
  }

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
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

class IssueForm extends Component {
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
    if (issue) {
      Object.keys(issue).map(i => {
        if (isISODate(issue[i])) {
          formatedIssue[i] = issue[i]
        } else {
          formatedIssue[i] = issue[i]
        }
      }) 
    }
    return (
      <Form
        initialValues={issue ? issue : {}}
        onSubmit={async e => {
          let cleanList = {}
          Object.keys(validInputList).map(valid => {
            Object.keys(e).map(i => {
              if (i === valid && e[i] !== null) {
                if (isValidDate(e[i])) {
                  cleanList[i] = new Date(e[i]).toISOString()
                } else if (0 === e[i] % (!isNaN(parseFloat(e[i])) && 0 <= ~~e[i])) {
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
              <span>{issue && issue.key}</span>
              <div className={classes.column}>
                <Typography component="h4" variant="h4">Capa</Typography>
              </div>
              <div className={classes.column}>
                {issue ? (issue.logo ? <img src={issue.logo} /> : <h4>Sem logo...</h4>) : null}
                {!issue ? (this.state.uploaded ? <img src={this.state.uploaded} /> : <h4>Sem logo...</h4>) : null}
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

IssueForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(IssueForm)


