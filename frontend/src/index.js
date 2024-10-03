import React from 'react';
import ReactDOM from 'react-dom/client';
//import { BrowserRouter as Router } from 'react-router-dom'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   
      <ThemeProvider>
    
    <App /> 
    </ThemeProvider>,
    
  </React.StrictMode>
);
document.getElementById('root')
reportWebVitals();
