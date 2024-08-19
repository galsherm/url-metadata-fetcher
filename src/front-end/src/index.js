import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CsrfTokenProvider } from './context/CsrfTokenContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CsrfTokenProvider>
      <App />
    </CsrfTokenProvider>
  </React.StrictMode>
);

reportWebVitals();
