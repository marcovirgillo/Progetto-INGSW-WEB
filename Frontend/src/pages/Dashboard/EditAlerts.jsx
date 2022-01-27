import React, { useState, useEffect } from 'react';
import './EditAlerts.css';
import './Dashboard.css';
import SelectCryptoAlert from './SelectCryptoAlert';
import { address } from '../../assets/globalVar';

function SearchField(props) {
    return (
        <div className="search-field"  style={{marginLeft:'-15px'}}>
            <img className="search-icon-x" alt="search icon"
                src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="search-container-x" type="text" placeholder="Search.." onChange={(ev) => props.queryData(ev.target.value)} />
        </div>
    );
}

const removeAlertUrl = `http://${address}:8080/removeAlert`;

const EditAlerts = (props) => {
    const [queryedData, setQueryedData] = useState(props.alerts);

    const [selectCryptoActive, setSelectCryptoActive] = useState(false);

    const [screenSize, setScreenSize] = useState(null);

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    });

    useEffect(() => {
        setQueryedData(props.alerts)
    }, [props.alerts]); 

    const queryData = (str) => {
        let alertsCopy = [];
    
        props.alerts.forEach((item) => {
            if((item.name.toLowerCase()).includes(str.toLowerCase()) || (item.ticker.toLowerCase()).includes(str.toLowerCase()))
            alertsCopy.push(item);
        })
    
        setQueryedData(alertsCopy);
    }

    function editAlertsClass(){
        var name = "edit-alerts-div";
        if(props.editAlertsActive){
            return name + " div-active";
        }
        return name;
    }

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
    
    function handleSelectCryptoAlert(){
        props.setEditAlertsActive(false);
        setSelectCryptoActive(true);
    }

    function handleRemoveAlert(id){
        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': props.accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'id': id
            })
        }

        fetch(removeAlertUrl, options)
            .then(res => parseResponse(res));

        var array  = [...props.alerts].filter(item => item.id != id);
        props.setAlerts(array);
        props.showResultPopup("Alert removed successfully!");
    }

    const parseResponse = (res) => {
        if(res.status === 200) {
            console.log("Alert removed");
        }
        else {
            res.json().then(result => console.log(result));
        }
            
    }

    return(
        <div className="edit-alerts">
            {props.editAlertsActive && (<div className="background-blurrer-edit-alerts" />)}
                <SelectCryptoAlert selectCryptoActive={selectCryptoActive} setSelectCryptoActive={setSelectCryptoActive} 
                                    allCryptos={props.allCryptos} accessToken={props.accessToken} alerts={props.alerts} setAlerts={props.setAlerts} fetcherAlerts={props.fetcherAlerts}
                                    showResultPopup={props.showResultPopup}/>
                <div className={editAlertsClass()}>
                    <ul className="inline-list select-list">
                        <span style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                            <img src={require("../../res/logos/alert2.png")} width={30} height={30} alt="crypto icon" className="alert-crypto-icon"/>
                            <span style={{color: 'white', fontSize:'20px', fontWeight:'700', paddingTop:'15px'}}>Your alerts</span>  
                        </span>
                        <div className="h-spacer-choose-crypto"/>
                        <img src={require("../../res/logos/close.png")} width={24} height={24} alt="close add preferences" className="close-alert-icon"
                              onClick={() => props.setEditAlertsActive(false)}
                        />
                    </ul>
                    <div style={{paddingTop:'15px'}} />
                    <ul className="inline-list select-list">
                        <div className="list-item">
                            <SearchField queryData={queryData}/>
                            <div className="h-spacer-choose-crypto" />
                            {queryedData.length !== 0 && (
                                <img src={require("../../res/logos/plus-nocircle.png")} width={30} height={30} alt="remove alert" 
                                     className="create-allert-button" onClick={() => handleSelectCryptoAlert()}
                                />
                            )}
                        </div>
                    </ul>
                    <div style={{paddingTop:'15px'}} />
                    <ul className="search-list">
                        <ul className="search-list crypto-list" style={{paddingTop:'0px'}}>
                            {queryedData.map((item, val) => (
                                <ul key={val} className="crypto-list-item">
                                     <img src={require("../../res/logos/remove.png")} /* style={{marginRight:'10px'}} */ width={24} height={24} alt="remove alert" className="delete-dashboard-icon"
                                                onClick={() => handleRemoveAlert(item.id)}
                                            />
                                    <img src={item.image_url} style={{paddingLeft:'5px'}} width={30} alt="crypto logo"/>  
                                    <p className="name">{item.name}</p>
                                    {screenSize > 600 && (
                                        <p className="ticker">{item.ticker.toUpperCase()}</p>
                                    )}
                                    <div className="h-spacer-choose-crypto" />
                                    <p className="alert-price"> {getFormattedPrice(item.price)}</p>
                                    {item.above ? <img src={require("../../res/logos/alert-up.png")} width={30} alt="alert up" className="updown-alert"/> :
                                                  <img src={require("../../res/logos/alert-down.png")} width={30} alt="alert down" className="updown-alert"/>  }
                                </ul>
                            ))}
                            {queryedData.length === 0 && (
                                <ul className="crypto-list-item">
                                    <div className="h-spacer-choose-crypto" />
                                    <p style={{fontSize:'18px', fontWeight:'600'}}>Please consider creating an allert</p>
                                    <div className="h-spacer-choose-crypto" />
                                    <img src={require("../../res/logos/plus.png")} style={{marginRight:'10px'}} width={24} height={24} alt="remove alert" className="create-allert-icon"
                                                onClick={() => handleSelectCryptoAlert()}  
                                            />
                                </ul>
                            )}
                        </ul>
                    </ul>
                </div>
        </div>
    )
}

export default EditAlerts;
