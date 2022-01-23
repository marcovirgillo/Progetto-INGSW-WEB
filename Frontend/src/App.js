import SideBar from './components/SideBar/SideBar';
import './App.css';
import './assets/main.css'
import { BrowserRouter, Route } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import AppBar from './components/AppBar/AppBar';
import Footer from './components/Footer/Footer';
import React, { useState, useEffect } from 'react';
import { address } from './assets/globalVar';

const checkLoginAddress = `http://${address}:8080/checkLogin`;
const allCryptoUrl = `http://${address}:8080/supportedCrypto`;

export default function App() {
    //le due funzioni di stato vengono passate a sideBar e appbar, e servono a chiudere/aprire la sidebar sull'evento onclick dei bottoni
    //lo state inizialmente è vuoto => non passo la classe che attiva la sidebar
    const [sideBarClass, setSideBarClass] = useState("");
    const [sideBarEnabled, setSideBarEnabled] = useState(false);
    const [searchMobileOpen, setSearchMobileOpen] = useState(false);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("Auth Token"));
    const [userLogged, setUserLogged] = useState({});
    const [allCrypto, setAllCrypto] = useState([]);

    //provo a vedere se il mio token per il login è valido
    const fetchData = () => {
        fetch(checkLoginAddress, req_options)
            .then(res => parseResult(res));   
    }

    useEffect(() => {
        if(accessToken === null)
            setAccessToken("");

        fetch(allCryptoUrl)
            .then((res) => res.json())
            .then((result) => setAllCrypto(result),
                   (error) => console.log("Error fetching supported crypto "));
    }, []);

    useEffect(fetchData, [accessToken]);

    //quando il toggle cambia, cambio lo stato della sidebar class, per capire se deve essere aperta o no
    useEffect(() => {
        if(sideBarEnabled)
            setSideBarClass("side-bar-active");
        else
            setSideBarClass("");

    }, [sideBarEnabled]);

    const req_options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': accessToken
        }
    };

    //controllo la risposta del server dopo il tentativo di login
    const parseResult = res => {
        if(res.status === 200) {
            console.log("Login con token da app js success")
            res.json().then(result => setUserLogged(result['user']));
        }
        else if(res.status === 5000 && accessToken != "") {
            //TODO popup rifai il login
            //In questo caso il token non nullo che ho salvato non è valido e devo rifare l'accesso
            setUserLogged({});
        }
        else {
            console.log("Errore durante il login da app js:")
            res.json().then((val) => console.log(val));
            setUserLogged({});
        }
    }

    const saveToken = (token) => {
        localStorage.setItem("Auth Token", token);
        setAccessToken(token);
    } 

    return (
        <BrowserRouter>
            <div className="layout-main">
                <SideBar sideBarEnabled={sideBarEnabled} setSideBarEnabled={setSideBarEnabled} sideBarClass={sideBarClass}/>
                <div className="layout-content">
                    <AppBar setSideBarEnabled={setSideBarEnabled} setSearchMobileOpen={setSearchMobileOpen} 
                            isMobileOpen={searchMobileOpen} isSearchFieldOpen={searchMobileOpen} 
                            accessToken={accessToken} setAccessToken={saveToken} allCryptos={allCrypto}
                            setUserLogged={setUserLogged} userLogged={userLogged}
                    />
                    <div className="layout-content-main">
                        <AppRoutes accessToken={accessToken} setAccessToken={saveToken} allCrypto={allCrypto} userLogged={userLogged}/> 
                        <Footer />
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

