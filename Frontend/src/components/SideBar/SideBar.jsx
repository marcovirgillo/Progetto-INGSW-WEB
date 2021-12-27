import React, { Component, useState } from 'react'
import { SidebarData, SideBarOptionalData } from './SidebarData';
import { Link } from 'react-router-dom'
import { Icon, Divider } from '@mui/material';
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
        const isActive = window.location.pathname == props.link;
    
        return (
            <ul className={getClassnameForItem(isActive)} onClick={() => {props.setSideBarEnabled(false);}}>
                <Icon sx={{marginRight: 2}}> {isActive ? props.blueLogo : props.logo} </Icon> 
                <p>{props.text}</p> 
            </ul>
        );
    } 

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
                    <Link to={item.link} key={val}>
                        <SideBarItem key={val} logo={item.icon} blueLogo={item.blueIcon} setSideBarEnabled={props.setSideBarEnabled}
                                     link={item.link} text={item.title} 
                        />
                    </Link>
                ))}

                <div className="vert-spacer"/>
                <div className="sidebar-profile-section" style={{display: 'none'}}>
                    <div className="divider" />
                    {SideBarOptionalData.map((item, val) => (
                        <Link to={item.link} key={val}>
                            <SideBarItem key={5 + val} logo={item.icon} blueLogo={item.blueIcon} setSideBarEnabled={props.setSideBarEnabled}
                                        link={item.link} text={item.title} 
                            />
                        </Link>
                    ))}
                </div>
                
            </ul>
        </div>
    );
}