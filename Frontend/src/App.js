import SideBar from './components/SideBar/SideBar';
import './App.css';
import './assets/main.css'
import { BrowserRouter, Route } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import AppBar from './components/AppBar/AppBar';
import Footer from './components/Footer/Footer';
import React, { useState, useEffect } from 'react';
import { address } from './assets/globalVar';
import ResultPopup from './components/ResultPopup/ResultPopup';

const checkLoginAddress = `http://${address}:8080/checkLogin`;
const allCryptoUrl = `http://${address}:8080/supportedCrypto`;
const logoutLink = `http://${address}:8080/logout`;

export default function App() {
    //le due funzioni di stato vengono passate a sideBar e appbar, e servono a chiudere/aprire la sidebar sull'evento onclick dei bottoni
    //lo state inizialmente è vuoto => non passo la classe che attiva la sidebar
    const [sideBarClass, setSideBarClass] = useState("");
    const [sideBarEnabled, setSideBarEnabled] = useState(false);
    const [searchMobileOpen, setSearchMobileOpen] = useState(false);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("Auth Token"));
    const [userLogged, setUserLogged] = useState({});
    const [allCrypto, setAllCrypto] = useState([]);
    const [resultPopupActive, setResultPopupActive] = useState(false);
    const [resultPopupText, setResultPopupText] = useState("");

    //provo a vedere se il mio token per il login è valido
    const fetchData = () => {
        if(accessToken === "")
            setUserLogged({});
        else {
            fetch(checkLoginAddress, req_options)
                .then(res => parseResult(res));   
        }
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
            res.json().then(result => setUserLogged(result['user']));
        }
        else if(res.status === 5000 && accessToken != "") {
            //In questo caso il token non nullo che ho salvato non è valido e devo rifare l'accesso
            setUserLogged({});
            saveToken("");
        }
        else {
            console.log("Errore durante il login da app js:")
            res.json().then((val) => console.log(val));
            setUserLogged({});
            saveToken("");
        }
    }

    const saveToken = (token) => {
        localStorage.setItem("Auth Token", token);
        setAccessToken(token);
    } 

    const showResultPopup = (msg) => {
        setResultPopupActive(true);
        setResultPopupText(msg);
        setTimeout(() => setResultPopupActive(false), 3000);
    }

    const logoutOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': accessToken
        }
    }

    const doLogout = () => {
        fetch(logoutLink, logoutOptions);
        
        setUserLogged({});
        saveToken("");
    }

    return (
        <BrowserRouter>
            <div className="layout-main">
                <SideBar sideBarEnabled={sideBarEnabled} setSideBarEnabled={setSideBarEnabled} sideBarClass={sideBarClass}/>
                <div className="layout-content">
                    <ResultPopup isActive={resultPopupActive} text={resultPopupText} />
                    <AppBar setSideBarEnabled={setSideBarEnabled} setSearchMobileOpen={setSearchMobileOpen} 
                            isMobileOpen={searchMobileOpen} isSearchFieldOpen={searchMobileOpen} 
                            accessToken={accessToken} setAccessToken={saveToken} allCryptos={allCrypto}
                            setUserLogged={setUserLogged} userLogged={userLogged} doLogout={doLogout}
                    />
                    <div className="layout-content-main">
                        <AppRoutes accessToken={accessToken} setAccessToken={saveToken} allCrypto={allCrypto} doLogout={doLogout}
                                   userLogged={userLogged} fetchProfile={fetchData} showResultPopup={showResultPopup}/> 
                        <Footer />
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

