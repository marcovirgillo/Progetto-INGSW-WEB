import React, { Component } from 'react';
import { Icon } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import "./AppBar.css"

function SearchField() {
    return (
        <div className="app-bar-search-field">
            <img className="app-bar-search-icon" src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="app-bar-search" type="text" placeholder="Cerca.."/>
        </div>
    )
}

export default function AppBar(props) {
    return (
        <div className="app-bar">
            <Icon className="menu-button" 
                   sx={{marginLeft: 2, marginTop: '-8px', color: 'white', display: 'none'}}
                   onClick={() => {props.setSideBarEnabled(true)}} > 
                   <MenuRoundedIcon style={{fontSize:32}} /> 
            </Icon>
            <Icon className="app-bar-logo" sx={{display: 'none'}}>
                <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={42} width={42}/>
            </Icon>
            <SearchField />
            <div className="spacer" />
            <Icon className="notification-icon">
                <img src={require("../../res/logos/bell.png")} width={24} height={24}/>
            </Icon>
            <Icon className="profile-icon" style={{display: 'revert'}}>
                <img src={require("../../res/logos/profile.png")} width={20} height={20}/>
            </Icon>
        </div>
    );
}