import React, { Component } from 'react';
import "./AppBar.css"

export default function AppBar() {
    return (
        <div className="app-bar">
            <input className="app-bar-search" type="text" placeholder="Cerca.."/>
        </div>
    );
}