import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Header from './components/Header';
import Footer from './components/Footer';
import {
  Route,
  NavLink,
  HashRouter,
  withRouter
} from "react-router-dom";
import Home from './pages/Home';
import Configuration from './pages/Configuration';
import About from './pages/About';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

class App extends React.Component {
  state = {

  };

  render() {
    const { classes } = this.props;

    return (
      <HashRouter>
        <div>
          <Header />
          <div className={classes.root}>
            <Route exact path="/" component={Home} />
            <Route path="/configuration" component={Configuration} />
            <Route path="/about" component={About} />
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));