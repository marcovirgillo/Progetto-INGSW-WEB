import SideBar from './components/SideBar/SideBar';
import './App.css';
import './assets/main.css'
import { BrowserRouter, Route } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import AppBar from './components/AppBar/AppBar';
import Footer from './components/Footer/Footer';
import React, { useState, useEffect } from 'react';

export default function App() {
    //le due funzioni di stato vengono passate a sideBar e appbar, e servono a chiudere/aprire la sidebar sull'evento onclick dei bottoni
    //lo state inizialmente è vuoto => non passo la classe che attiva la sidebar
    const [sideBarClass, setSideBarClass] = useState("");
    const [sideBarEnabled, setSideBarEnabled] = useState(false);
    const [searchMobileOpen, setSearchMobileOpen] = useState(false);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("Auth Token"));
    
    useEffect(() => {
        if(accessToken === null)
            setAccessToken("");

        console.log("recupero token:", accessToken);
    }, []);

    const saveToken = (token) => {
        console.log("salvo token:", token);
        localStorage.setItem("Auth Token", token);
        setAccessToken(token);
    } 

    //quando il toggle cambia, cambio lo stato della sidebar class, per capire se deve essere aperta o no
    useEffect(() => {
        if(sideBarEnabled)
            setSideBarClass("side-bar-active");
        else
            setSideBarClass("");

    }, [sideBarEnabled]);

    return (
        <BrowserRouter>
            <div className="layout-main">
                <SideBar sideBarEnabled={sideBarEnabled} setSideBarEnabled={setSideBarEnabled} sideBarClass={sideBarClass}/>
                <div className="layout-content">
                    <AppBar setSideBarEnabled={setSideBarEnabled} setSearchMobileOpen={setSearchMobileOpen} 
                            isMobileOpen={searchMobileOpen} isSearchFieldOpen={searchMobileOpen} accessToken={accessToken} setAccessToken={saveToken}/>
                    <div className="layout-content-main">
                        <AppRoutes setAccessToken={saveToken}/> 
                        <Footer />
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

