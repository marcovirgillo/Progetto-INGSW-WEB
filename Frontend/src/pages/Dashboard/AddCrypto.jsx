import React, { useState, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox';
import { blue } from '@mui/material/colors';
import { address } from './../../assets/globalVar.js';

const addPreferencesUrl = `http://${address}:8080/addPreferences`;

function SearchField(props) {
    return (
        <div className="search-field">
            <img className="search-icon-x" alt="search icon"
                src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="search-container-x" type="text" placeholder="Search.." onChange={(ev) => props.queryData(ev.target.value)} />
        </div>
    );
}

let selected = [];

const AddCrypto = (props) => {
    const [queryedData, setQueryedData] = useState(props.allCryptos);
    const [updateChecked, setUpdateChecked] = useState(false);

    useEffect(() => {
        setQueryedData(props.allCryptos)
    }, [props.allCryptos]); 

    let optionsAddPreference = {
        method: 'PUT',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*', 
            'Authorization': props.accessToken,
        },
        body: {}
    }

    const addPreferences = () => {
        if(selected.length === 0){
            console.log("No preferences selected!")
            return;
        }
        const body = selected;

        optionsAddPreference.body = JSON.stringify(body);

        fetch(addPreferencesUrl, optionsAddPreference)
            .then(res => parseResponse(res));

        props.setAddPreferredActive(false);
    }

    const parseResponse = res => {
        if(res.status === 200) {
            console.log("Preferences added successfully!");
            props.fetcherPreferences();
        }
         else {
            res.json().then(result => console.log(result));
        }
    }


    const queryData = (str) => {
        let allCryptoCopy = [];
    
        props.allCryptos.forEach((item) => {
            if((item.name.toLowerCase()).includes(str.toLowerCase()) || (item.ticker.toLowerCase()).includes(str.toLowerCase()))
                allCryptoCopy.push(item);
        })
    
        setQueryedData(allCryptoCopy);
    }

    const handleChange = (crypto) => {
        var item  = selected.find(item => item.ticker === crypto);
        if(item === undefined)
            selected.push({ticker: crypto});
        else{
            var array  = [...selected].filter(item => item.ticker != crypto);
            selected = array;
        }
        
        setUpdateChecked(!updateChecked);
    };

    function isSelected(crypto){
        var item  = selected.find(item => item.ticker === crypto);
        if(item === undefined)
            return false;
        return true;
    }

    function AddCryptoClass(){
        if(props.position==="beforeDashboard"){
            if(props.addCryptosClass)
                return "choose-crypto-div div-active";
            else
                return "choose-crypto-div";
        }
        if(props.position==="dashboard"){
            if(props.addCryptosClass)
                return "choose-crypto-div-dashboard div-active"  
            else
                return "choose-crypto-div-dashboard";
        }

    }

    return (
        <div>
        <React.Fragment>
            {props.addPreferredActive && (<div className="background-blurrer-dashboard" />)}
                <div className={AddCryptoClass()}>
                    <ul className="inline-list select-list">
                        <span style={{color: 'white', fontSize:'20px', fontWeight:'700', paddingTop:'15px'}}>Select your favourite assets</span>
                        <div className="h-spacer-choose-crypto"/>
                        <img src={require("../../res/logos/close.png")} width={24} height={24} alt="close add preferences" className="close-dashboard-icon"
                                                onClick={() => props.setAddPreferredActive(false)}
                                            />
                    </ul>
                    <ul className="search-list">
                        <div style={{paddingTop:'30px'}} />
                        <SearchField queryData={queryData}/>
                        <ul className="search-list crypto-list">
                            {queryedData.map((item, val) => (
                                <ul key={val} className="crypto-list-item">
                                    <img src={item.logo} width={30} alt="crypto logo"/>  
                                    <p>{item.name}</p>
                                    <p className="ticker">{item.ticker.toUpperCase()}</p>
                                    <div className="h-spacer-choose-crypto" />
                                    {/* <ArrowForwardIosRoundedIcon sx={{color: 'white', marginRight: '5px'}}/> */}
                                    <Checkbox
                                       /*  {...label} */
                                        checked={isSelected(item.ticker)}
                                        sx={{
                                            color: blue[300],
                                            '&.Mui-checked': {
                                                color: blue[300],
                                            },
                                        }}
                                       onChange={() => handleChange(item.ticker)} 
                                    />
                                </ul>
                            ))}
                        </ul>
                    </ul>
                    <div className="login-field" >
                        <span className="login-button-style" style={{fontSize:'15px', height:'45px', alignItems:'center'}}>
                            <div onClick={() => addPreferences()} className='login-button-text' style={{fontSize:'16px', paddingTop:'12px'}}>Confirm preferences</div>
                        </span>
                    </div>
                    <div style={{paddingTop:'30px'}} />
                </div>
            </React.Fragment>
        </div>
    )
};

export default AddCrypto;
