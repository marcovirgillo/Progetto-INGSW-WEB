import React, { Component, useState } from 'react';
import { Icon } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import "./AppBar.css"
import { Link } from 'react-router-dom'

function DropdownProfile(props) {
    return (
        <div className={"dropdown-profile " + props.class}>
            <ul className="dropdown-profile-list">
                <ul className="dropdown-list-item-horizontal">
                    <img src={require("../../res/images/avatar.jpg")} width={42} height={42} style={{borderRadius: '100%'}}/>
                    <p className="dropdown-text" >piero_gay</p>
                </ul>
                <div className="dropdown-divider" />
                <ul className="dropdown-list-item-horizontal dropdown-button">      
                    <img src={require("../../res/logos/settings.png")} width={36} height={36}/>
                    <p className="dropdown-text">Settings</p>
                </ul>
                <ul className="dropdown-list-item-horizontal dropdown-button">
                    <img src={require("../../res/logos/logout.png")} width={34} height={34} />
                    <p className="dropdown-text">Logout</p>
                </ul>
            </ul>
        </div>
    );
}

function SearchField() {
    return (
        <div className="app-bar-search-field">
            <img className="app-bar-search-icon" src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="app-bar-search" type="text" placeholder="Cerca.."/>
        </div>
    );
}

function SearchFieldMobile(props) {
    return (
        <div className="app-bar-search-field-mobile">
            <img className="app-bar-search-icon" src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="app-bar-search-mobile" type="text" placeholder="Cerca.."/>
            <div className="spacer" />
            <CloseRoundedIcon className="close-btn" sx={{color: 'white', fontSize: 32}} onClick={() => {props.setSearchMobileOpen(false)}}/>
        </div>
    );
}

export default function AppBar(props) {
    const [dropdownProfileActive, setDropdownProfileActive] = useState(false);

    return (
        <div className="app-bar">
            {props.isSearchFieldOpen && (
                <SearchFieldMobile setSearchMobileOpen={props.setSearchMobileOpen} />
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
                    <SearchField />
                    <div className="spacer" />
                    <Icon className="search-icon" style={{display: 'none'}} onClick={() => {props.setSearchMobileOpen(true)}}>
                        <img src={require("../../res/logos/search.png")} width={20} height={20}/>
                    </Icon>
                    <Icon className="notification-icon">
                        <img src={require("../../res/logos/bell.png")} width={24} height={24}/>
                    </Icon>
                    <Icon className="profile-icon" style={{display: 'revert'}} onClick={()=>{setDropdownProfileActive(!dropdownProfileActive)}}>
                        <img src={require("../../res/logos/profile.png")} width={20} height={20}/>
                    </Icon>
                    <DropdownProfile class={dropdownProfileActive ? ' drop-active' : ''} />
                </React.Fragment>
            )}
        </div>
    );
}