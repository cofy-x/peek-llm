import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app';
import './home.css';
import './portal.css';

const root = document.getElementById('root');
if (!root) throw new Error('Portal root is missing');
createRoot(root).render(<StrictMode><BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter></StrictMode>);
