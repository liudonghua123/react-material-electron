import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { render } from 'react-dom';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { downloadFile, readFile, getSimpleDateTime } from '../utils';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    height: 50,
  },
  button: {
    margin: 'auto',
    width: '75%',
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  card: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'flex-start',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  cardLeftContent: {
    display: 'flex',
    flexDirection: 'row',
    flexBasis: '60%',
  },
  cardSearch: {
    fontSize: '1.5em',
    color: '#ff3333',
    flexGrow: 1,
    width: '40%',
  },
  cardArrow: {
    fontSize: '1.5em',
    color: '#ff9900',
    flexGrow: 1,
    width: '20%',
  },
  cardReplace: {
    fontSize: '1.5em',
    color: '#99ff00',
    flexGrow: 1,
    width: '40%',
  },
  cardRightAction: {
    display: 'flex',
    flexDirection: 'row',
    flexBasis: '40%',
    justifyContent: 'space-around',
  },
  cardDelete: {
    width: '100%',
  },
  input: {
    margin: theme.spacing.unit,
  },
});

class Configuration extends PureComponent {
  constructor(props) {
    super(props);
    console.info(`getItem ${localStorage.getItem('items')}`);
    this.state = {
      items: localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [],
      search: '',
      replace: '',
      searchMode: false,
      searchItems: {},
      editMode: [],
      searchEdit: '',
      replaceEdit: '',
      dialogTitle: '',
      dialogContent: '',
      open: false,
    };
  }

  count = 0;

  searchInput = null;

  replaceInput = null;

  componentDidMount = () => {
    console.info('componentDidMount');
    console.info(`this.searchInput ${this.searchInput}`);
  }

  componentWillUnmount = () => {
    // cancel click callback
    console.info('componentWillUnmount');
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  handleChange = name => (event) => {
    console.info(`handleChange ${name} with ${event.target.value}`);
    this.setState({
      [name]: event.target.value,
    });
  };

  handleFocus = name => (event) => {
    console.info(`handleFocus ${name}, ${this[name]}`);
    if (this[name]) {
      this[name].focus();
    }
  };

  handleKeyDown = (updateItem, index) => (event) => {
    if (event.key === 'Escape') {
      console.info('Escape pressed, exist edit mode');
      this.setState({
        editMode: false,
      });
    }
  }

  handleDoubleClick = (item, index) => (event) => {
    // cancel previous callback
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    // increment count
    this.count++;
    // schedule new callback  [timeBetweenClicks] ms after last click
    this.timeout = setTimeout(() => {
      // listen for double clicks
      if (this.count === 2) {
        // turn on edit mode
        const editMode = {};
        editMode[index] = true;
        this.setState({
          editMode,
          searchEdit: item.search,
          replaceEdit: item.replace,
        });
      }
      // set focus
      // reset count
      this.count = 0;
    }, 250);
  }

  handleAdd = (event) => {
    if (!this.state.search || !this.state.replace) {
      this.setState({ open: true, dialogTitle: '错误', dialogContent: '搜索或替换都不能为空' });
      return;
    }
    const items = [...this.state.items, { search: this.state.search, replace: this.state.replace }];
    this.setState({
      items,
      searchMode: false,
    });
    console.info(`saveItem ${JSON.stringify(items)}`);
    localStorage.setItem('items', JSON.stringify(items));
  };

  handleSearch = (event) => {
    const items = this.state.items.filter((item, index) => {
      if (this.state.search && this.state.replace) {
        return item.search.includes(this.state.search) && item.replace.includes(this.state.replace);
      }
      if (this.state.search) {
        return item.search.includes(this.state.search);
      }
      if (this.state.replace) {
        return item.replace.includes(this.state.replace);
      }

      return true;
    });
    this.setState({
      searchItems: items,
      searchMode: true,
    });
  };

  handleDelete = deleteItem => (event) => {
    const items = this.state.items.filter((item, index) => deleteItem.search !== item.search || deleteItem.replace !== item.replace);
    this.setState({
      items,
      searchMode: false,
    });
    console.info(`saveItem ${JSON.stringify(items)}`);
    localStorage.setItem('items', JSON.stringify(items));
  }

  handleUpdate = (updateItem, index) => (event) => {
    const items = [...this.state.items];
    const index = items.indexOf(updateItem);
    items[index].search = this.state.searchEdit;
    items[index].replace = this.state.replaceEdit;
    if (!this.state.searchEdit || !this.state.replaceEdit) {
      this.setState({ open: true, dialogTitle: '错误', dialogContent: '搜索或替换都不能为空' });
      return;
    }
    const editMode = {};
    editMode[index] = false;
    this.setState({
      items,
      searchMode: false,
      editMode,
    });
    console.info(`saveItem ${JSON.stringify(items)}`);
    localStorage.setItem('items', JSON.stringify(items));
  }

  handleImport = (event) => {
    console.info('file clicked');
    this.fileInput.click();
  };

  handleExport = (event) => {
    const { items } = this.state;
    let exportContents = '';
    for (const item of items) {
      exportContents += `${item.search},${item.replace}\r\n`;
    }
    const d = new Date();
    downloadFile(exportContents, `export-data-${getSimpleDateTime()}.txt`, 'text/plain;charset=utf-8');
  };

  handleFiles = (event) => {
    const file = event.target.files[0];
    console.info(`readFile ${file}`);
    readFile(file, (textContents) => {
      const items = [];
      // By lines
      const lines = textContents.split('\n');
      for (let line = 0; line < lines.length; line++) {
        // split the origin and repaced by comma
        const words = lines[line].split(',');
        if (words.length && words.length === 2) {
          items.push({ search: words[0].trim(), replace: words[1].trim() });
        }
      }
      this.setState({
        items,
        searchMode: false,
      });
      console.info(`import to save items ${JSON.stringify(items)}`);
      localStorage.setItem('items', JSON.stringify(items));
    });
  }

  handleRLDDChange = (reorderedItems) => {
    console.info(`handleRLDDChange, reorderedItems: ${reorderedItems}`)
    this.setState({ items: reorderedItems });
  };

  itemRenderer = (item, index) => (
    <div className={this.props.classes.card} key={`${item.search}-${item.replace}`}>
      <div className={this.props.classes.cardContent}>
        <div className={this.props.classes.cardLeftContent}>
          {this.state.editMode[index] ? <Input onKeyDown={this.handleKeyDown(item, index)} autoFocus inputRef={(input) => { console.info(`set ref ${input} on ${this}`); this.searchInput = input; }} value={this.state.searchEdit} onClick={this.handleFocus('searchInput')} onChange={this.handleChange('searchEdit')} className={this.props.classes.input} inputProps={{ 'aria-label': 'Description' }} /> : <div onClick={this.handleDoubleClick(item, index)} className={this.props.classes.cardSearch}>{item.search}</div>}
          <div className={this.props.classes.cardArrow}>{' -> '}</div>
          {this.state.editMode[index] ? <Input onKeyDown={this.handleKeyDown(item, index)} inputRef={(input) => { console.info(`set ref ${input} on ${this}`); this.replaceInput = input; }} value={this.state.replaceEdit} onClick={this.handleFocus('replaceInput')} onChange={this.handleChange('replaceEdit')} className={this.props.classes.input} inputProps={{ 'aria-label': 'Description' }} /> : <div onClick={this.handleDoubleClick(item, index)} className={this.props.classes.cardReplace}>{item.replace}</div>}
        </div>
        <div className={this.props.classes.cardRightAction}>
          <Button variant="contained" color="primary" onClick={this.handleUpdate(item, index)} disabled={!this.state.editMode[index]}>修改</Button>
          <Button variant="contained" color="primary" onClick={this.handleDelete(item)}>删除</Button>
        </div>
      </div>
    </div>
  );

  listRender() {
    const items = this.state.searchMode ? this.state.searchItems : this.state.items;
    const itemCards = items.map((item, index) => {
      return this.itemRenderer(item, index);
    });
    return (<div>{itemCards}</div>);
  };

  Transition = props => <Slide direction="up" {...props} />

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">
          <Grid container spacing={24}>
            <Grid item xs={2} className={classes.grid}>
              <Input
                placeholder="搜索"
                className={classes.input}
                value={this.state.name}
                onChange={this.handleChange('search')}
              />
            </Grid>
            <Grid item xs={2} className={classes.grid}>
              <Input
                placeholder="替换"
                className={classes.input}
                value={this.state.replace}
                onChange={this.handleChange('replace')}
              />
            </Grid>
            <Grid item xs={2} className={classes.grid}>
              <Button variant="contained" onClick={this.handleAdd} color="primary" className={classes.button}>添加</Button>
            </Grid>
            <Grid item xs={2} className={classes.grid}>
              <Button variant="contained" onClick={this.handleSearch} color="primary" className={classes.button}>搜索</Button>
            </Grid>
            <Grid item xs={2} className={classes.grid}>
              <input
                type="file"
                id="docpicker"
                className="file"
                onChange={this.handleFiles}
                ref={(file) => {
                  // console.info(`ref file: ${file}`);
                  this.fileInput = file;
                }}
                accept=".txt"
              />
              <Button variant="contained" color="secondary" onClick={this.handleImport} className={classes.button}>导入</Button>
            </Grid>
            <Grid item xs={2} className={classes.grid}>
              <Button variant="contained" color="secondary" onClick={this.handleExport} className={classes.button}>导出</Button>
            </Grid>
          </Grid>
        </form>
        <div>
          { this.listRender() }
        </div>
        <Dialog
          open={this.state.open}
          TransitionComponent={this.Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {this.state.dialogTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.state.dialogContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Configuration);
