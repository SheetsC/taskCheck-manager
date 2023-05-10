import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from "react-router-dom"
import { Footer } from './Footer';
const root = createRoot(document.getElementById('root'));
    
root.render(
    <BrowserRouter>
        <App />
        <Footer />
    </BrowserRouter>
);
