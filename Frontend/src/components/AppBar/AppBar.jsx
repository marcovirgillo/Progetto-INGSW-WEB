import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Icon } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import "./AppBar.css"
import { Link } from 'react-router-dom'
import { Notifications } from "./../../pages/Home/TestData.js";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { address } from "./../../assets/globalVar.js";
import LoggedAccount from './LoggedAccount.jsx'
import AccessAccount from './AccessAccount.jsx'

const allCryptoUrl = `http://${address}:8080/supportedCrypto`;
const checkLoginAddress = `http://${address}:8080/checkLogin`;

function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)){
            return false;
        }
    }

    return true;
}

function DropdownProfile(props) {
    const [userLogged, setUserLogged] = useState({});
   
    const req_options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    };

    //controllo la risposta del server dopo il tentativo di login
    const parseResult = res => {
        if(res.status === 200) {
            console.log("Login con token da appbar success")
            res.json().then(result => setUserLogged(result['user']));
        }
        else if(res.status === 5000) {
            //TODO popup rifai il login
        }
        else {
            console.log("Errore durante il login da appbar:")
            res.json().then((val) => console.log(val));
            setUserLogged({});
        }
    }

    //provo a vedere se il mio token per il login è valido
    const fetchData = () => {
        fetch(checkLoginAddress, req_options)
            .then(res => parseResult(res));   
    }

    useEffect(fetchData, []);
    useEffect(fetchData, [props.accessToken]);

    return (
        <div className={"dropdown dropdown-profile " + props.class}>
            {!isEmptyObject(userLogged) ? <LoggedAccount setAccessToken={props.setAccessToken} user={userLogged} accessToken={props.accessToken}/> 
                                            : <AccessAccount setAccessToken={props.setAccessToken}/> }
        </div>
    );
}

function DropdownNotification(props) {
    const [notificationList, setNotificationList] = useState(Notifications);
    const deleteNotification = idx => {
        let notif = [...notificationList.slice(0, idx), ...notificationList.slice(idx+1)]
        setNotificationList(notif);
    }

    return (
        <div className={"dropdown dropdown-notification " + props.class}>
            <div className="dropdown-wrapper">
                <ul className="dropdown-notification-list">
                    {notificationList.length > 0 && (notificationList.map((item, val) => (
                        <ul key={val} className="dropdown-list-item-horizontal notification-button">
                            <img src={item.logo} width={20} height={20} style={{borderRadius: '100%'}} alt="crypyo logo"/>
                            <p className="dropdown-text">{item.text}</p>
                            <div className="notif-spacer" />
                            <Icon className="delete-btn" onClick={()=>{deleteNotification(val)}}> 
                                <DeleteOutlineRoundedIcon className="delete-icon" sx={{color: 'white'}}/> 
                            </Icon>
                        </ul>
                    )))}
                    {notificationList.length === 0 && (
                        <p style={{color: 'white', margin: '0px 20px 0px 20px'}}>There are no notifications</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

function DropdownSearchPanel(props) {
    const getClassName = isActive => {
        let cName = "dropdown dropdown-search ";
        if(isActive)
            cName = cName + "search-active";

        return cName;
    }

    const linkClicked = () => {
        if(props.isMobileOpen) 
            props.setMobileFieldOpen(false);
    }

    return(
        <div className={getClassName(props.isActive)}>
            <ul className="search-list">
                <p className="label">Results</p>
                {props.data.slice(0, 6).map((item, val) => (
                    <ul key={val} className="h-list-item">
                        <img src={item.logo} width={30} alt="crypto logo"/>
                        <Link to={`/crypto/${item.id}`} style={{display:'flex', flexDirection:'row'}} 
                              onClick={linkClicked}>
                            <p>{item.name}</p>
                            <p className="ticker">{item.ticker.toUpperCase()}</p>
                        </Link>
                    </ul>
                ))}
            </ul>
        </div>
    )
}

function SearchField(props) {
    return (
        <div className="app-bar-search-field">
            <img className="app-bar-search-icon" alt="search icon"
                src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="app-bar-search" type="text" placeholder="Search.." 
                onChange={(ev) => props.queryData(ev.target.value)}
                onFocus={() => props.setDropdownActive(true)} 
                onBlur={() => setTimeout(() => props.setDropdownActive(false), 100)}
            />
        </div>
    );
}

function SearchFieldMobile(props) {
    return (
        <div className="app-bar-search-field-mobile">
            <img className="app-bar-search-icon" alt="search icon"
                src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="app-bar-search-mobile" type="text" placeholder="Search.." 
                    onChange={(ev) => props.queryData(ev.target.value)} 
                    onFocus={() => props.setDropdownActive(true)} 
                    onBlur={() => setTimeout(() => props.setDropdownActive(false), 100)}
            />
            <div className="spacer" />
            <CloseRoundedIcon className="close-btn" sx={{color: 'white', fontSize: 32, cursor: 'pointer'}} 
                onClick={() => {props.setSearchMobileOpen(false); props.setDropdownActive(false)}}/>
        </div>
    );
}



export default function AppBar(props) {
    const [dropdownProfileActive, setDropdownProfileActive] = useState(false);
    const [dropdownNotificationActive, setDropdownNotificationActive] = useState(false);
    const [dropdownSearchActive, setDropdownSearchActive] = useState(false);
    const [allCryptos, setAllCryptos] = useState([]);
    const [queryedData, setQueryedData] = useState([]);

    {/* https://it.reactjs.org/docs/forwarding-refs.html */}
    
    const wrapperRefProfile = useRef(null);
    useOutsideAlerter(wrapperRefProfile, "Profile");

    const wrapperRefNotification = useRef(null);
    useOutsideAlerter(wrapperRefNotification, "Notification");

    function useOutsideAlerter(ref, component) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    if(component === "Profile")
                        setDropdownProfileActive(false);            

                    else if(component === "Notification")
                        setDropdownNotificationActive(false);
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
    }, [ref]);}

    useEffect(() => {
        fetch(allCryptoUrl)
            .then((res) => res.json())
            .then((result) => {setAllCryptos(result); setQueryedData(result)},
                   (error) => console.log("Error fetching supported crypto "));
    }, []);

    const queryData = (str) => {
        let allCryptoCopy = [];

        allCryptos.forEach((item) => {
            if((item.name.toLowerCase()).includes(str.toLowerCase()) || (item.ticker.toLowerCase()).includes(str.toLowerCase()))
                allCryptoCopy.push(item);
        })

        setQueryedData(allCryptoCopy);
    }

    return (
        <div className="app-bar">
            {/* isSearchFieldOpen serve perchè nella versione mobile la search bar viene rimpiazzato da un bottone che la apre*/}
            {props.isSearchFieldOpen && (
                <SearchFieldMobile queryData={queryData} setSearchMobileOpen={props.setSearchMobileOpen} 
                                setDropdownActive={setDropdownSearchActive} dropdownIsOpen={dropdownSearchActive}
                />
            )}
            {!props.isSearchFieldOpen && (
                <React.Fragment>
                    <Icon className="menu-button" 
                        sx={{marginLeft: 2, marginTop: '-8px', color: 'white', display: 'none', cursor: 'pointer'}}
                        onClick={() => {props.setSideBarEnabled(true)}} > 
                        <MenuRoundedIcon style={{fontSize:32}} /> 
                    </Icon>
                    <Icon className="app-bar-logo" sx={{display: 'none'}} >
                    <Link to=""> 
                        <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={50} width={50} />
                    </Link>
                    </Icon>

                    <SearchField queryData={queryData} setDropdownActive={setDropdownSearchActive}/>

                    <div className="spacer" />
                    <Icon className="search-icon" style={{display: 'none'}} onClick={() => {props.setSearchMobileOpen(true)}}>
                        <img src={require("../../res/logos/search.png")} alt="search icon" width={20} height={20}/>
                    </Icon>
                    <Icon ref={wrapperRefNotification} className="notification-icon" 
                            onClick={()=>{ if(dropdownProfileActive) 
                                                setDropdownProfileActive(false);
                                        
                                            setDropdownNotificationActive(!dropdownNotificationActive)}}
                    >
                        <img src={require("../../res/logos/bell.png")} width={24} height={24} alt="bell"/>
                    </Icon>
                    <Icon ref={wrapperRefProfile} className="profile-icon" style={{display: 'revert'}} 
                            onClick={()=>{  if(dropdownNotificationActive)
                                                    setDropdownNotificationActive(false);

                                            setDropdownProfileActive(!dropdownProfileActive); }}
                    >
                        <img src={require("../../res/logos/profile.png")} width={20} height={20} alt="profile"/>
                    </Icon>


                    <DropdownNotification class={dropdownNotificationActive ? ' drop-active': ''} />
                    <DropdownProfile class={dropdownProfileActive ? ' drop-active' : ''} accessToken={props.accessToken} setAccessToken={props.setAccessToken}/>
                </React.Fragment>
            )}

            <DropdownSearchPanel data={queryedData} isActive={dropdownSearchActive} isMobileOpen={props.isMobileOpen}
                                setDropdownActive={setDropdownSearchActive} setMobileFieldOpen={props.setSearchMobileOpen}/>
            
        </div>
    );
}