import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ajaxCsrfSetup from './utils';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// setup jquery for CSRF tokens
jQuery.ajaxSetup({
  // jQuery won't allow using the ajaxCsrfSetup function directly
  beforeSend: ajaxCsrfSetup
});
