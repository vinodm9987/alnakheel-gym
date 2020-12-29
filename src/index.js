import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
// import { store, persistor } from './store';
import { store } from './store';
// import { PersistGate } from 'redux-persist/integration/react'
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './i18n';
import 'react-phone-number-input/style.css'

ReactDOM.render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <App />
    {/* </PersistGate> */}
  </Provider>,
  document.getElementById('root')
);

