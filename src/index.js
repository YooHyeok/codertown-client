import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
/* 리덕스 처리 */
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './redux_jwt/persist-store';

// const store = createStore(rootReducer);
let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
 </CookiesProvider>
);
