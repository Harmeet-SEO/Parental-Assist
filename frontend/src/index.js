import React from 'react';
import './App.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import ReactDOM from 'react-dom/client';
import App from './App';


import { useEffect } from 'react';

function InitAOS() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <><InitAOS /><App /></>
  </React.StrictMode>
);