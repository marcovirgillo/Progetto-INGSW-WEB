import React, { useState, useEffect } from 'react'
import './AddAlert.css';

const AddAlert = (props) => {

    const [price, setPrice] = useState(0.0);

    useEffect(() => {
        if(props.cryptoData.length === 0)
            setPrice(0.0);
        else
            setPrice(props.cryptoData.market_data.current_price.usd)
    }, [props.cryptoData]); 

    function addAlertClass(){
        var name = "add-alert-div";
        if(props.addAlertActive){
            return name + " div-active";
        }
        return name;
    }

    //faccio in modo che solo i numeri possono essere digitati nell'input field
    const checkNumbers = (ev) => {
        const val = ev.target.value;
        const key = ev.key;

        if(key === " ") {
            ev.preventDefault();
            return;
        }
        else if(key === ".") {
            if(val.includes(".")) {
                ev.preventDefault();
                return;
            }
        }
        else {
            if(isNaN(ev.key)) {
                ev.preventDefault();
                return;
            }
        }
    }

    function getImage(){
        if(props.cryptoData.length === 0)
            return "";
        return props.cryptoData.image.small;
    }

    return (
        <div className="add-alert">
            {props.addAlertActive && (<div className="background-blurrer" />)}
            <div className={addAlertClass()}>
                <ul className="inline-list select-list">
                    <span style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                        <img src={getImage()} width={30} height={30} alt="crypto icon" className="alert-crypto-icon"/>
                        <span style={{color: 'white', fontSize:'20px', fontWeight:'700', paddingTop:'15px'}}>Add price Alert for {props.cryptoData.name}</span>  
                    </span>
                    <div className="h-spacer-choose-crypto"/>
                    <img src={require("../../res/logos/close.png")} width={24} height={24} alt="close add preferences" className="close-alert-icon"
                                            onClick={() => props.setAddAlertActive(false)}
                                        />
                </ul>
                <div style={{paddingTop:'40px'}} />
                <h4 className="center-alert-text" style={{color:'white'}}> Enter target price </h4>
                <div style={{paddingTop:'20px'}} />
                <div className="field price">
                <ul className="inline-list">
                    <span className="dollar">$</span>
                    <input value={price} onKeyPress={(ev) => checkNumbers(ev)} onChange={(ev) => setPrice(ev.target.value)} 
                                    onPaste={(ev) => ev.preventDefault()} type="number" lang="en"
                    />
                    </ul>
                </div>
                <div style={{paddingTop:'40px'}} />
                <h4 className="center-alert-text-info" style={{color:'white'}}>You will be notified when the price reaches {price}$</h4>
                <div style={{paddingTop:'20px'}} />
                <div className="confirm-div">
                    <div className="confirm-alert-btn">
                        <span className="btn-style">
                                <img src={require("../../res/logos/alert2.png")}  alt="alert-icon" height={25} width={25} style={{paddingRight:'5px'}}/> 
                                <div /* onClick={doLogin} */ className='btn-text'>Create Alert</div>
                        </span>
                    </div>
                </div>
                <div style={{paddingTop:'20px'}} />
            </div>
        </div>
    )
};

export default AddAlert;