import React from 'react';
import ReactDOM from 'react-dom/client';
//import { BrowserRouter as Router } from 'react-router-dom'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <App /> 
    
  </React.StrictMode>
);

reportWebVitals();
