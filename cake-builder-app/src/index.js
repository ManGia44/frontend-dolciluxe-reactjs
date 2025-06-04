import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Nếu bạn có file css global

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);