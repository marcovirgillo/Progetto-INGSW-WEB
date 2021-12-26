import React, { Component } from 'react';
import { Icon } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import "./AppBar.css"


export default function AppBar(props) {
    return (
        <div className="app-bar">
            <Icon className="menu-button" 
                   sx={{marginLeft: 2, marginTop: '-8px', color: 'white', display: 'none'}}
                   onClick={() => {props.setSideBarEnabled(true)}} > 
                   <MenuRoundedIcon style={{fontSize:32}} /> 
            </Icon>
            <input className="app-bar-search" type="text" placeholder="Cerca.."/>
            <div className="spacer" />
        </div>
    );
}