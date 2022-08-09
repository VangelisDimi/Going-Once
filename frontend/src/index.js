import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

import Welcome from './components/welcome';
import Signup from './components/signup';
import NotFound from './components/notFound';


// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
    <Routes>
        <Route
            exact path="/"
            element = {<Navigate to="/welcome"/>}
        />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>
);