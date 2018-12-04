import React, { Component, PureComponent } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import './home.css';
import { downloadFile, getSimpleDateTime } from '../utils';

const { remote, ipcRenderer: ipc } = window.require('electron');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: localStorage.getItem('items')
        ? JSON.parse(localStorage.getItem('items'))
        : [],
      originalText: '',
      replacedText: '',
      completed: 0,
      dialogTitle: '',
      dialogContent: '',
      open: false,
    };

    ipc.on('get-synonym-result', (event, result) => {
      this.setState({
        replacedText: result,
      });
    });
  }

  componentWillMount() {
    console.log(`componentWillMount, restore the original state`);
    const savedState = JSON.parse(localStorage.getItem('state'));
    this.setState({...savedState});
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(`shouldComponentUpdate with nextProps: ${JSON.stringify(nextProps)}, nextState: ${JSON.stringify(nextState)}`);
    return true;
  }

  componentWillUnmount() {
    console.log(`componentWillUnmount, save the state`);
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  handleClick = name => (event) => {
    if (name === 'replace') {
      // search and replace, and update completed
      const { items, originalText } = this.state;
      let { replacedText } = this.state;
      const totalCount = items.length;
      // init originalText to replacedText
      replacedText = originalText;
      this.setState({
        completed: 0,
      });
      for (let i = 0; i < totalCount; i++) {
        setTimeout(() => {
          console.log(`process ${i} item`);
          const replacedText = replacedText.replace(
            new RegExp(items[i].search, 'gm'),
            items[i].replace,
          );
          this.setState({
            replacedText,
            completed: parseInt(((i + 1) / totalCount) * 100, 10),
          });
          if (i + 1 === totalCount) {
            this.setState({
              open: true,
              dialogTitle: '替换',
              dialogContent: '替换完成',
            });
          }
        }, i * 1000);
      }
    } else if (name === 'reset') {
      this.setState({ replacedText: '', completed: 0 });
    } else if (name === 'file') {
      console.info('file clicked');
      this.fileInput.click();
    } else if (name === 'synonym') {
      const { originalText: text } = this.state;
      // send convert synonym request
      const result = ipc.send('get-synonym', text);
    } else if (name === 'copyToOriginal') {
      const { replacedText } = this.state;
      this.setState({
        originalText: replacedText,
      });
    } else if (name === 'saveResult') {
      const { replacedText } = this.state;
      downloadFile(replacedText, `result-${getSimpleDateTime()}`, 'text/plain;charset=utf-8');
    }
  }

  readFile = (file) => {
    // read file
    const reader = new FileReader();
    reader.onload = (event) => {
      const textContents = event.target.result;
      this.setState({
        originalText: textContents,
      });
    };
    reader.readAsText(file, 'UTF-8');
    this.setState({
      completed: 0,
      open: true,
      dialogTitle: '文件加载',
      dialogContent: '加载成功，现在可以点击替换按钮',
    });
  }

  handleFiles = (event) => {
    const file = event.target.files[0];
    console.info(`readFile ${file}`);
    this.readFile(file);
  }

  dropHandler = (event) => {
    console.log('File(s) dropped');
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    let file = null;
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; ++i) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          file = event.dataTransfer.items[i].getAsFile();
          console.log(
            `event.dataTransfer.items... file[${i}].name = ${file.name}`,
          );
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.files.length; ++i) {
        file = event.dataTransfer.files[i];
        console.log(
          `event.dataTransfer.files... file[${i}].name = ${
            event.dataTransfer.files[i].name
          }`,
        );
      }
    }
    // Pass event to removeDragData for cleanup
    this.removeDragData(event);

    // Read the file now.
    this.readFile(file);
  }

  dragOverHandler = (event) => {
    console.log('File(s) in drop zone');
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
  }

  removeDragData = (event) => {
    console.log('Removing drag data');
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      event.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }
  }

  Transition = props => <Slide direction="up" {...props} />

  handleClose = () => {
    this.setState({ open: false });
  }

  render = () => {
    const {
      originalText,
      replacedText,
      completed,
      open,
      dialogTitle,
      dialogContent,
    } = this.state;
    const options = {
      selectOnLineNumbers: false,
      readOnly: true,
      enableSplitViewResizing: false,
      renderSideBySide: true,
      contextmenu: false,
      wordWrap: 'bounded',

    };
    return (
      <div>
        <Card className="card">
          <CardContent className="cardContent">
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClick('synonym')}
            >
              同义词处理
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClick('copyToOriginal')}
            >
              复制结果到待处理区
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClick('replace')}
            >
              自定义替换
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClick('reset')}
            >
              重置
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClick('saveResult')}
            >
              保存结果文件
            </Button>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent className="cardContent">
            <input
              type="file"
              id="docpicker"
              className="file"
              onChange={this.handleFiles}
              ref={(file) => {
                // console.info(`ref file: ${file}`);
                this.fileInput = file;
              }}
              accept=".txt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <div
              id="drop_zone"
              onDrop={this.dropHandler}
              onDragOver={this.dragOverHandler}
              onClick={this.handleClick('file')}
              role="button"
            >
              <p>拖拽UTF-8编码的文本文件或者点击选择文件</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent className="cardContent">
            <LinearProgress
              className="progress"
              variant="determinate"
              value={completed}
            />
            <MonacoDiffEditor
              height="400"
              language="text"
              value={replacedText}
              original={originalText}
              options={options}
              theme="vs-light"
            />
          </CardContent>
        </Card>
        <Dialog
          open={open}
          TransitionComponent={this.Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {dialogContent}
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

export default Home;
