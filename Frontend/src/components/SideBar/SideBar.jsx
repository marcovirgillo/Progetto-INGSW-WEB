import React, { Component, useState } from 'react'
import { SidebarData } from './SidebarData';
import { Link } from 'react-router-dom'
import { Icon } from '@mui/material';

import "./SideBar.css"

const getClassnameForItem = (isActive) => {
    if(isActive)
        return "active side-bar-item";

    return "side-bar-item";
}

export default function SideBar() {
    const SideBarItem = (props) => {
        const isActive = itemActive === props.text;
    
        return (
            <ul className={getClassnameForItem(isActive)}>
                <li> <Icon sx={{marginRight: 2}}> {isActive ? props.blueLogo : props.logo} </Icon> </li>
                <li> <Link to={props.link} onClick={() => props.setItemActive(props.text)}>{props.text}</Link> </li>
            </ul>
        );
    } 

    const [itemActive, setItemActive] = useState(null);

    return(
        <div className="side-bar">
            <div className="side-bar-logo">
                <ul className="side-bar-logo-list">
                    <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={80} width={80} /> 
                    <div className="sidebar-logo-text"> <Link to="">CryptoView</Link> </div>
                </ul>
                
            </div>
            <ul className="side-bar-list">
                {SidebarData.map((item, val) => (
                     <SideBarItem key={val} logo={item.icon} blueLogo={item.blueIcon} link={item.link} text={item.title} setItemActive={setItemActive}/>
                ))}
            </ul>
        </div>
    );
}