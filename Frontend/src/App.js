import React from 'react';

import { Switch, Route, Link } from 'react-router-dom';

import { NavBar } from './components';
import './App.css';


const App = () => {
    return (
        <div className="app">
            <div className="navbar">
                <NavBar />
            </div>
        </div>
    )
}

export default App
