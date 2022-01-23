import React, { useState, useEffect, useRef } from 'react';
import { address } from '../../assets/globalVar';
import { Link } from 'react-router-dom';
import { Icon } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

const DropdownNotification = React.forwardRef((props, ref) => {
    function NotificationText(props) {

        const getClassName = (change) => {
            return (change >= 0 ? 'item-green' : 'item-red')
        }

        return (
            <span style={{color: 'white', marginLeft: '20px', display: 'flex', flexWrap: 'wrap'}}>
                <Link to={`/crypto/${props.notif.cripto_Id}`} onClick={() => props.closePanel()}> 
                    <span className="notification-cripto-name">{props.notif.cripto_Name} ({props.notif.cripto_Ticker.toUpperCase()})</span> 
                </Link>
                &nbsp;is {props.notif.price_Change >= 0 ? ' up' : ' down'}
                <span className={getClassName(props.notif.price_Change)}>
                    &nbsp;{props.notif.price_Change} %&nbsp;
                </span>
                <span>in the last&nbsp;</span> 
                {props.notif.price_Change_Interval === 1 ? 'hour' : '24 hours'}
            </span>
        )
    }

    return (
        <div ref={ref} className={"dropdown dropdown-notification " + props.class}>
            <div className="dropdown-wrapper">
                <ul className="dropdown-notification-list">
                    {props.notificationList.length > 0 && (props.notificationList.map((item, val) => (
                        <React.Fragment>
                            <li className="dropdown-list-item-horizontal notification-button">
                                <img src={item.logo} width={20} height={20} style={{borderRadius: '100%'}} alt="crypyo logo"/>
                                <NotificationText notif={item} closePanel={props.closePanel}/>
                                <div className="notif-spacer" />
                                <Icon className="delete-btn" onClick={()=>{ props.deleteNotification(item.id, val)}}> 
                                    <DeleteOutlineRoundedIcon className="delete-icon" sx={{color: 'white'}}/> 
                                </Icon>
                            </li>
                            <p style={{paddingLeft: '20px', color: '#8F8F8F', marginTop: '5px', marginBottom: '20px'}}>
                                {new Date(item.notification_datestamp).toUTCString()}
                            </p>
                        </React.Fragment>
                    )))}
                    {props.notificationList.length === 0 && (
                        <p style={{color: 'white', margin: '0px 20px 0px 20px'}}>There are no notifications</p>
                    )}
                </ul>
            </div>
        </div>
    );
})

export default DropdownNotification;