import SideBar from './components/SideBar/SideBar';
import './App.css';
import './assets/main.css'
import { BrowserRouter, Route } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import AppBar from './components/AppBar/AppBar';
import React, { useState, useEffect } from 'react';


export default function App() {
    //le due funzioni di stato vengono passate a sideBar e appbar, e servono a chiudere/aprire la sidebar sull'evento onclick dei bottoni
    const [sideBarClass, setSideBarClass] = useState("");
    const [sideBarEnabled, setSideBarEnabled] = useState(false);

    //quando il toggle cambia, cambio lo stato della sidebar class, per capire se deve essere aperta o no
    useEffect(() => {
        if(sideBarEnabled)
            setSideBarClass("side-bar-active");
        else
            setSideBarClass("");

    }, [sideBarEnabled]);
    

    return (
        <BrowserRouter>
            <SideBar setSideBarEnabled={setSideBarEnabled} sideBarClass={sideBarClass}/>
            <AppBar setSideBarEnabled={setSideBarEnabled}/>
            <div>
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
}

