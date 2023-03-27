import "./wam/audioworklet.js"; // polyfill

import React from 'react';
import ReactDOM from 'react-dom/client';
import Startup from './Startup';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Startup />
);