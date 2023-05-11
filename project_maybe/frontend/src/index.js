import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from "react-router-dom"
import { Footer } from './Footer';
const root = createRoot(document.getElementById('root'));
    
root.render(
    <div>
        <div className='relative z-1 min-h-[100vh]'> 
            <BrowserRouter>
                <App /> 
            </BrowserRouter>
        </div>
        <br/>
        <div className='relative z-10'>
            <Footer className='bottom-0 left-0 right-0' />
        </div>
        
    </div>
    
);
