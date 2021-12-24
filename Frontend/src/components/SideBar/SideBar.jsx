import React, { Component } from 'react'
import { SidebarData } from './SidebarData';
import { Link } from 'react-router-dom'
import { Icon } from '@mui/material';

import "./SideBar.css"

const SideBarItem = (props) => {
    const isActive = window.location.pathname == props.link;
    return (
        <ul key={props.Lkey} className="side-bar-item">
            <li> <Icon sx={{marginRight: 1}}> {isActive ? props.blueLogo : props.logo} </Icon> </li>
            <li> <Link to={props.link}>{props.text}</Link> </li>
        </ul>
    );
} 

export default function SideBar() {
    return(
        <div className="side-bar">
            <ul className="side-bar-list">
                {SidebarData.map((item, val) => {
                    console.log(item);
                    console.log(val);

                    return <SideBarItem Lkey={val} logo={item.icon} blueLogo={item.blueIcon} link={item.link} text={item.title} />
                })}
            </ul>
        </div>
    );
}