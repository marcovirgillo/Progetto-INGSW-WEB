import React, { useState, useEffect } from 'react';
import { Icon } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import "./AppBar.css"
import { Link } from 'react-router-dom'
import { Notifications } from "./../../pages/Home/TestData.js";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { address } from "./../../assets/globalVar.js";

const allCryptoUrl = `http://${address}:8080/supportedCrypto`;

function DropdownProfile(props) {
    return (
        <div className={"dropdown dropdown-profile " + props.class}>
            <ul className="dropdown-profile-list">
                <ul className="dropdown-list-item-horizontal">
                    <img src={require("../../res/images/avatar.jpg")} alt="propfile_icon"
                        width={42} height={42} style={{borderRadius: '100%'}}/>
                    <p className="dropdown-text" >piero_gay</p>
                </ul>
                <div className="dropdown-divider" />
                <ul className="dropdown-list-item-horizontal dropdown-button">      
                    <img src={require("../../res/logos/settings.png")} width={36} height={36} alt="settings"/>
                    <p className="dropdown-text">Settings</p>
                </ul>
                <ul className="dropdown-list-item-horizontal dropdown-button">
                    <img src={require("../../res/logos/logout.png")} width={34} height={34} alt="logout" />
                    <p className="dropdown-text">Logout</p>
                </ul>
            </ul>
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

    return(
        <div className={getClassName(props.isActive)}>
            <ul className="search-list">
                <p className="label">Results</p>
                {props.data.slice(0, 6).map((item, val) => (
                    <ul key={val} className="h-list-item">
                        <img src={item.logo} width={30} alt="crypto logo"/>
                        <Link to={`/crypto/${item.id}`} style={{display:'flex', flexDirection:'row'}}>
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

    useEffect(() => {
        fetch(allCryptoUrl)
            .then((res) => res.json())
            .then((result) => {setAllCryptos(result); setQueryedData(result)},
                   (error) => console.log("error"));
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
                        sx={{marginLeft: 2, marginTop: '-8px', color: 'white', display: 'none'}}
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
                    <Icon className="notification-icon" 
                            onClick={()=>{ if(dropdownProfileActive)
                                                setDropdownProfileActive(false);

                                            setDropdownNotificationActive(!dropdownNotificationActive)}}
                    >
                        <img src={require("../../res/logos/bell.png")} width={24} height={24} alt="bell"/>
                    </Icon>
                    <Icon className="profile-icon" style={{display: 'revert'}} 
                            onClick={()=>{  if(dropdownNotificationActive)
                                                setDropdownNotificationActive(false);

                                            setDropdownProfileActive(!dropdownProfileActive)}}
                    >
                        <img src={require("../../res/logos/profile.png")} width={20} height={20} alt="profile"/>
                    </Icon>

                    <DropdownNotification class={dropdownNotificationActive ? ' drop-active': ''} />
                    <DropdownProfile class={dropdownProfileActive ? ' drop-active' : ''} />
                </React.Fragment>
            )}

            <DropdownSearchPanel data={queryedData} isActive={dropdownSearchActive} setDropdownActive={setDropdownSearchActive}/>
            
        </div>
    );
}