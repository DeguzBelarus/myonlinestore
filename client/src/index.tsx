import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';

import App from './App';
import './index.scss';

const container = document.getElementById('root')!;
const root = createRoot(container);

const app = <Provider store={store}>
   <BrowserRouter>
      <App />
   </BrowserRouter>
</Provider>
root.render(app);

reportWebVitals();
