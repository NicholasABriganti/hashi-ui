import React, { Component } from "react"
import PropTypes from "prop-types"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
const red500 = red['500'];
const green800 = green['800'];
const green900 = green['900'];
import getMuiTheme from "material-ui/styles/getMuiTheme"
import AppBar from "material-ui/AppBar"
import { Card, CardTitle, CardText } from "material-ui/Card"

import { red, green } from '@material-ui/core/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#4b9a7d",
    primary2Color: green800,
    primary3Color: green900
  },
  appBar: {
    height: 50
  }
})

class ErrorApp extends Component {
  render() {
    let uncaughtExceptionBar = undefined

    if (this.props.uncaughtException) {
      uncaughtExceptionBar = (
        <AppBar
          showMenuIconButton={false}
          style={{ backgroundColor: red500 }}
          title={`Error: ${this.props.uncaughtException}`}
        />
      )
    }

    let title = "Something bad and unexpected happened."
    title = title + " (" + this.props.retryCount + " retries completed)"

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar title="Hashi UI" showMenuIconButton={false} />
          {uncaughtExceptionBar}
          <Card>
            <CardTitle title={title} />
            <CardText>
              <p>The system will continue to retry every 5s.</p>
              <p>Please check the hash-ui server log or your browser console.</p>
              <p>You could also try to reload the page.</p>
              <p>
                If you think this is an error in hash-ui, please &nbsp;
                <a target="_blank" href="https://github.com/jippi/hashi-ui/issues">
                  submit a bug report
                </a>
              </p>
            </CardText>
          </Card>
        </div>
      </MuiThemeProvider>
    )
  }
}

ErrorApp.propTypes = {
  uncaughtException: PropTypes.object,
  retryCount: PropTypes.number.isRequired,
  maxRetries: PropTypes.number.isRequired
}

export default ErrorApp
