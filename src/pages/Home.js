import React, { Component, PureComponent } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [],
      originalText: '',
      replacedText: '',
      completed: 0,
      dialogTitle: '',
      dialogContent: '',
      open: false,
    };
  }

    handleClick = (name) => (event) => {
        if(name == 'replace') {
            // search and replace, and update completed
            const items = this.state.items;
            const totalCount = items.length;
            this.state.replacedText = this.state.originalText;
            this.setState({ completed: 0 });
            for (let i = 0; i < totalCount; i++) {
                setTimeout(() => {
                    console.log(`process ${i} item`);
                    const replacedText = this.state.replacedText.replace(new RegExp(items[i].search, 'gm'), items[i].replace);
                    this.setState({ replacedText, completed: parseInt((i + 1) / totalCount * 100) });
                    if(i + 1 == totalCount) {
                        this.setState({ open: true, dialogTitle: '替换', dialogContent: '替换完成' });
                    }
                }, i * 1000);
           }
        }
        else if(name == 'reset') {
            this.setState({ replacedText: '', completed: 0});
        }
        else if(name == 'file') {
            console.info(`file clicked`);
            this.fileInput.click();
        }
    }

    readFile = file => {
        // read file
        const reader = new FileReader();  
        reader.onload = (event) => {    
          const textContents = event.target.result;
          this.setState({
              originalText: textContents,
          });
        }
        reader.readAsText(file,"UTF-8");
        this.setState({ completed: 0, open: true, dialogTitle: '文件加载', dialogContent: '加载成功，现在可以点击替换按钮' });
    }

    handleFiles = event => {
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
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            file = event.dataTransfer.items[i].getAsFile();
            console.log(`event.dataTransfer.items... file[${i}].name = ${file.name}`);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
          file = event.dataTransfer.files[i];
          console.log(`event.dataTransfer.files... file[${i}].name = ${event.dataTransfer.files[i].name}`);
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

    Transition = (props) => {
        return <Slide direction="up" {...props} />;
    }

    handleClose = () => {
        this.setState({ open: false });
    };


  render = () => {
    let {originalText, replacedText} = this.state;
    return (
        <div>
        <Card className="card">
            <CardContent className="cardContent">
                <Button variant="contained" color="primary" onClick={this.handleClick('replace')}>替换</Button>
                <Button variant="contained" color="primary" onClick={this.handleClick('reset')}>重置</Button>
            </CardContent>
        </Card>
        <Card className="card">
            <CardContent className="cardContent">
            <input type="file" id="docpicker" className="file" onChange={this.handleFiles} ref={file => { console.info(`ref file: ${file}`); this.fileInput = file}}
                accept=".txt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            </input>
            <div id="drop_zone" onDrop={this.dropHandler} onDragOver={this.dragOverHandler} onClick={this.handleClick('file')} >
                <p>Drag one or more files to this Drop Zone ...</p>
            </div>
            </CardContent>
        </Card>
        <LinearProgress className="progress" variant="determinate" value={this.state.completed} />
        <ReactDiffViewer
            oldValue={originalText}
            newValue={replacedText}
            splitView
            />
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
    )
    };
}

export default Home;
