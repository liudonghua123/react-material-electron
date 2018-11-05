import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// https://github.com/mui-org/material-ui/issues/6256
import 'typeface-roboto';
import 'material-design-icons/iconfont/material-icons.css';

const rootEl = document.getElementById('root')

ReactDOM.render(<App />, rootEl);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// https://medium.com/@brianhan/hot-reloading-cra-without-eject-b54af352c642
// https://daveceddia.com/hot-reloading-create-react-app/
if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default
      ReactDOM.render(
        <NextApp />,
        rootEl
      )
    })
  }
