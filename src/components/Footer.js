import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit,
    padding: `${theme.spacing.unit * 6}px 0`,
  },
});

class Footer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          This is the footer
        </Typography>
      </footer>
    );
  }
}

export default withStyles(styles)(Footer);
