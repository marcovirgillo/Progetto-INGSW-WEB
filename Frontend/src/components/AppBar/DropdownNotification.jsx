import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

function getFormattedPrice(price) {
    if(price > 1)
        return formatter.format(price);
    else {
        if(price === 0)
            return "$" + 0.0;

        return "$" + price.toFixed(getDecimalPlaces(price) + 2);
    }
}

const getDecimalPlaces = (number) => {
    let decimal = 0;
    while(number < 1) {
        decimal++;
        number *= 10;
    }

    return decimal;
}

const DropdownNotification = React.forwardRef((props, ref) => {
    function NotificationText(props) {

        const getClassName = (change) => {
            return (change >= 0 ? 'item-green' : 'item-red');
        }

        const getClassNameAlert = above => {
            return (above ? 'item-green' : 'item-red');
        }

        return (
            <span style={{color: 'white', marginLeft: '20px', display: 'flex', flexWrap: 'wrap'}}>
                <Link to={`/crypto/${props.notif.cripto_Id}`} onClick={() => props.closePanel()}> 
                    <span className="notification-cripto-name">{props.notif.cripto_Name} ({props.notif.cripto_Ticker.toUpperCase()})</span> 
                </Link>
                {props.notif.type === 'p' && (
                    <React.Fragment>
                        &nbsp;is {props.notif.price_Change >= 0 ? ' up' : ' down'}
                        <span className={getClassName(props.notif.price_Change)}>
                            &nbsp;{props.notif.price_Change} %&nbsp;
                        </span>
                        in the last&nbsp; 
                        {props.notif.price_Change_Interval === 1 ? 'hour' : '24 hours'}
                    </React.Fragment>
                )}
                {props.notif.type === 'a' && (
                    <React.Fragment>
                        &nbsp;has reached the price target &nbsp;
                        <span className={getClassNameAlert(props.notif.above)}>
                            {getFormattedPrice(props.notif.target_Price)}&nbsp;
                        </span>
                    </React.Fragment>
                )}
            </span>
        )
    }

    return (
        <div ref={ref} className={"dropdown dropdown-notification " + props.class}>
            <div className="dropdown-wrapper">
                <ul className="dropdown-notification-list">
                    {props.notificationList.length > 0 && (props.notificationList.map((item, val) => (
                        <ul key={val} style={{width: '100%', boxSizing: 'border-box', padding: '0px'}}>
                            <li className="dropdown-list-item-horizontal notification-button">
                                <img src={item.logo} width={20} height={20} style={{borderRadius: '100%'}} alt="crypyo logo"/>
                                <NotificationText notif={item} closePanel={props.closePanel}/>
                                <div className="notif-spacer" />
                                <Icon className="delete-btn" onClick={()=>{ props.deleteNotification(item.id, val, item.type)}}> 
                                    <DeleteOutlineRoundedIcon className="delete-icon" sx={{color: 'white'}}/> 
                                </Icon>
                            </li>
                            <p key={10000 + val} style={{paddingLeft: '20px', color: '#8F8F8F', marginTop: '5px', marginBottom: '20px'}}>
                                {new Date(item.notification_datestamp).toUTCString()}
                            </p>
                        </ul>
                    )))}
                    {props.notificationList.length === 0 && (
                        <p style={{color: 'white', margin: '0px 20px 0px 20px', fontWeight: '500'}}>There are no notifications</p>
                    )}
                </ul>
            </div>
        </div>
    );
})

export default DropdownNotification;