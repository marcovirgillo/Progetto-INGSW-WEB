import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import "./AppBar.css"
import { Link } from 'react-router-dom'
import LoggedAccount from './LoggedAccount.jsx'
import AccessAccount from './AccessAccount.jsx'
import DropdownNotification from './DropdownNotification.jsx';
import { address } from '../../assets/globalVar';

const getNotificationsUrl = `http://${address}:8080/getUserNotifications`;
const deleteNotificationsUrl = `http://${address}:8080/deleteUserNotifications`;

function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)){
            return false;
        }
    }

    return true;
}

function DropdownProfile(props) {
    return (
        <div className={"dropdown dropdown-profile " + props.class}>
            {!isEmptyObject(props.userLogged) ? <LoggedAccount setAccessToken={props.setAccessToken} user={props.userLogged} accessToken={props.accessToken} /> 
                                            : <AccessAccount setAccessToken={props.setAccessToken}/> }
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
    const [queryedData, setQueryedData] = useState([]);
    const [notificationList, setNotificationList] = useState([]);
    const [notificationBtnCLicked, setNotificationBtnClicked] = useState(false);

    const wrapperRefNotificationDropdown = useRef(null);
    useOutsideAlerter(wrapperRefNotificationDropdown, "Notification");
    
    const wrapperRefNotification = useRef(null);

    const wrapperRefProfile = useRef(null);
    useOutsideAlerter(wrapperRefProfile, "Profile");

    function useOutsideAlerter(ref, component) {
        useEffect(() => {
            function handleClickOutside(event) {
                if(component === "Notification") {
                    if (ref.current && !ref.current.contains(event.target) && wrapperRefNotification && !wrapperRefNotification.current.contains(event.target))
                        setDropdownNotificationActive(false);
                }
                else if(component === "Profile") {
                    if(ref.current && !ref.current.contains(event.target)){
                        setTimeout(() => setDropdownProfileActive(false), 100);
                    }
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
    }, [ref]);}

    const queryData = (str) => {
        let allCryptoCopy = [];

        props.allCryptos.forEach((item) => {
            if((item.name.toLowerCase()).includes(str.toLowerCase()) || (item.ticker.toLowerCase()).includes(str.toLowerCase()))
                allCryptoCopy.push(item);
        })

        setQueryedData(allCryptoCopy);
    }

    useEffect(() => setQueryedData(props.allCryptos), [props.allCryptos]);

    const parseResponse = res => {
        if(res.status === 200) {
            res.json().then(result => setNotificationList(result['notifications']));
            setNotificationBtnClicked(false);
        }
    }

    const fetchNotifications = () => {
        if(props.accessToken === null || props.accessToken === "")
            return;
        
        const options = {
            method: 'GET',
            headers: {
                'Authorization': props.accessToken,
            }
        }

        fetch(getNotificationsUrl, options)
            .then(res => parseResponse(res));
    }

    const deleteNotification = (id, idx, type) => {
        fetch(deleteNotificationsUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': props.accessToken
            },
            body : JSON.stringify({
                'id': id,
                'type': type
            })
        });

        let notif = [...notificationList.slice(0, idx), ...notificationList.slice(idx+1)]
        setNotificationList(notif);
    }

    useEffect(fetchNotifications, []);
    useEffect(fetchNotifications, [props.accessToken]);

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
                    <span className="notification-icon-span">
                        <Icon ref={wrapperRefNotification} className="notification-icon" 
                                onClick={()=>{ if(dropdownProfileActive) 
                                                    setDropdownProfileActive(false);

                                                setNotificationBtnClicked(true);
                                                setDropdownNotificationActive(!dropdownNotificationActive)}}
                        >
                            <img src={require("../../res/logos/bell.png")} width={24} height={24} alt="bell"/>
                        </Icon>
                        {!notificationBtnCLicked && (<p>{notificationList.length}</p>)}
                    </span>

                    <Icon ref={wrapperRefProfile} className="profile-icon" style={{display: 'revert'}} 
                            onClick={()=>{  if(dropdownNotificationActive)
                                                    setDropdownNotificationActive(false);

                                            setDropdownProfileActive(!dropdownProfileActive); }}
                    >
                        <img src={require("../../res/logos/profile.png")} width={20} height={20} alt="profile"/>
                    </Icon>


                    <DropdownNotification ref={wrapperRefNotificationDropdown} accessToken={props.accessToken} 
                            notificationList={notificationList} deleteNotification={deleteNotification}
                            class={dropdownNotificationActive ? ' drop-active': ''} closePanel={() => setDropdownNotificationActive(false)} 
                    />
                    <DropdownProfile class={dropdownProfileActive ? ' drop-active' : ''} 
                            accessToken={props.accessToken} setAccessToken={props.setAccessToken}
                            userLogged={props.userLogged} setUserLogged={props.setUserLogged}
                    />
                </React.Fragment>
            )}

            <DropdownSearchPanel data={queryedData} isActive={dropdownSearchActive} isMobileOpen={props.isMobileOpen}
                                setDropdownActive={setDropdownSearchActive} setMobileFieldOpen={props.setSearchMobileOpen}/>
            
        </div>
    );
}