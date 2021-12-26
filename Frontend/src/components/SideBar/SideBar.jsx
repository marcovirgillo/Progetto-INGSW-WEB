import React, { Component, useState } from 'react'
import { SidebarData } from './SidebarData';
import { Link } from 'react-router-dom'
import { Icon } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import "./SideBar.css"

//se il bottone è active, aggiungo la classe active per cambiare lo stile
const getClassnameForItem = (isActive) => {
    if(isActive)
        return "active side-bar-item";

    return "side-bar-item";
}

export default function SideBar(props) {
    const SideBarItem = (props) => {
        const isActive = itemActive === props.text;
    
        return (
            <ul className={getClassnameForItem(isActive)}>
                <li> <Icon sx={{marginRight: 2}}> {isActive ? props.blueLogo : props.logo} </Icon> </li>
                <li> <Link to={props.link} onClick={() => {props.setItemActive(props.text); props.setSideBarEnabled(false);}}>{props.text}</Link> </li>
            </ul>
        );
    } 

    const [itemActive, setItemActive] = useState(null);

    //questa funzione aggiunge o meno side-bar-active, in base allo stato di app.js
    //se è active, la sidebar torna visibile
    const getSideBarClassName = () => {
        return "side-bar " + props.sideBarClass;
    }

    return(
        <div className={getSideBarClassName()}>
            <div className="side-bar-logo">
                <ul className="side-bar-logo-list">
                    <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={80} width={80} /> 
                    <div className="sidebar-logo-text"> <Link to="">CryptoView</Link> </div>
                    <ArrowBackIosNewRoundedIcon className="side-bar-back-btn"
                                                onClick = {() => {props.setSideBarEnabled(false)}}
                                                sx={{color: 'white', fontSize: 32, marginLeft: 5, display: 'none'}}
                    />
                </ul>

            </div>
            <ul className="side-bar-list">
                {SidebarData.map((item, val) => (
                     <SideBarItem key={val} logo={item.icon} blueLogo={item.blueIcon} setSideBarEnabled={props.setSideBarEnabled}
                                  link={item.link} text={item.title} setItemActive={setItemActive}
                    />
                ))}
            </ul>
        </div>
    );
}