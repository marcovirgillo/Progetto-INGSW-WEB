import React, { useState, useEffect } from 'react';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField } from '@mui/material';
import  ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import  ArrowDropUpRoundedIcon  from '@mui/icons-material/ArrowDropUpRounded';
import { address } from '../../assets/globalVar';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const addTransactionUrl = `http://${address}:8080/addTransaction`;

function CustomSelectDropown(props) {
    const getClassName = () => {
        if(props.isActive)
            return "custom-dropdown-select drop-select-active";

        return "custom-dropdown-select"
    }

    const itemClicked = (item) => {
        props.setItemClicked(item);
        props.setActive(false);
    }

    return (
        <div className={getClassName()}>
            <p onClick={() => itemClicked("i")}>Transfer In</p>
            <p onClick={() => itemClicked("o")}>Transfer Out</p>
        </div>
    )
}

export default function TransactionPanel(props) {
    const [itemActive, setItemActive] = useState("buy");
    const [dateValue, setDateValue] = React.useState(new Date());
    const [currentTransferType, setCurrentTransferType] = useState("i");
    const [selectDropdownActive, setSelectDropdownActive] = useState(false);
    const [errorLabelActive, setErrorLabelActive] = useState(false);

    //state per i valori dei field
    const [cryptoQuantField, setCryptoQuantField] = useState(0.0);
    const [cryptoPriceField, setCryptoPriceField] = useState(props.crypto.price);
    const [total, setTotal] = useState(0);

    useEffect(() => setTotal(cryptoPriceField * cryptoQuantField), [cryptoPriceField]);
    useEffect(() => setTotal(cryptoPriceField * cryptoQuantField), [cryptoQuantField]);

    const getClassName = (elem) => {
        if(elem === itemActive)
            return "btn-active";
    }

    const handleChange = (newValue) => {
        setDateValue(newValue);
    };

    let options = {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken,
        },
        body: {}
    }

    const showError = () => {
        setErrorLabelActive(true);
        setTimeout(() => setErrorLabelActive(false), 3500);
    }

    const addTransactionClicked = () => {
        let transaction_type = itemActive[0];

        if(itemActive === "transaction")
            transaction_type = currentTransferType;
    
        try {
            const body = {
                'ticker': props.crypto.ticker,
                'type': transaction_type,
                'quantity': cryptoQuantField,
                'price_usd_crypto': cryptoPriceField,
                'total_usd_spent': total,
                'transaction_date': dateValue.toISOString().split("T")[0],
                'transaction_time': dateValue.toISOString().split("T")[1]
            }

            options.body = JSON.stringify(body);

            fetch(addTransactionUrl, options)
                .then(res => parseResponse(res));
        } catch(error) {
           showError();
        }
    }

    const parseResponse = res => {
        if(res.status === 200) {
            console.log("Transaction added !");
            props.fetchInfo();
            props.fetchChart();
            props.closePanel();
        }
        else if(res.status === 5020) {
            showError();
        } else {
            res.json().then(result => console.log(result));
        }
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

    const updateField = (ev, fun) => {
        fun(ev.target.value);
    }

    const getTransactionLabel = () => {
        if(currentTransferType === "i")
            return "Transfer In";
        
        return "Transfer Out"; 
    }

    const getErrorLabelClassname = () => {
        if(errorLabelActive)
            return "error-label label-active";
        else
            return "error-label";
    }

    return (
        <React.Fragment>
            <ul className="inline-list select-list">
                <h3 style={{color: 'white'}}>Add Transaction</h3>
                <div className="h-spacer-choose-crypto"/>
                <CloseRoundedIcon className="close-btn" sx={{color: 'white', fontSize: 32, cursor: 'pointer'}} 
                    onClick={() => props.closePanel()}/>
            </ul>
            <ul className="transaction-div-list">
                <ul className="btn-container transactions-btn-container">
                    <p className={getClassName("buy")} onClick={() => setItemActive("buy")}>Buy</p>
                    <p className={getClassName("sell")} onClick={() => setItemActive("sell")}>Sell</p>
                    <p className={getClassName("transfer")} onClick={() => setItemActive("transfer")}>Transfer</p>
                </ul>
                <ul className="crypto-list-item transaction-item">
                    <img src={props.crypto.logo} width={30} alt="crypto logo"/>  
                    <p>{props.crypto.name}</p>
                    <p className="ticker">{props.crypto.ticker.toUpperCase()}</p>
                </ul>
                    <ul className="field-container">
                        <ul className="field">
                            <p>Quantity</p>
                            <input value={cryptoQuantField} onKeyPress={(ev) => checkNumbers(ev)} onChange={(ev) => updateField(ev, setCryptoQuantField)}  
                                    onPaste={(ev) => ev.preventDefault()} type="number" placeholder="0.0" lang="en"
                            />
                        </ul>
                        {itemActive != "transfer" && (
                            <ul className="field price-field">
                                <p>Price per coin</p>
                                <span className="dollar-symbol">$</span>
                                <input value={cryptoPriceField} onKeyPress={(ev) => checkNumbers(ev)} onChange={(ev) => updateField(ev, setCryptoPriceField)} 
                                       onPaste={(ev) => ev.preventDefault()} type="number" lang="en"
                                />
                            </ul>
                        )}
                        {itemActive === "transfer" && (
                           <ul className="field">
                                <p>Transfer Type</p>
                                <div className="custom-select" onClick={() => setSelectDropdownActive(!selectDropdownActive)}>
                                    <p>{getTransactionLabel()}</p> 
                                    <div className="h-spacer-choose-crypto" />
                                    {selectDropdownActive && (<ArrowDropUpRoundedIcon />)}
                                    {!selectDropdownActive && (<ArrowDropDownRoundedIcon />)}
                                </div>
                                <CustomSelectDropown isActive={selectDropdownActive} setItemClicked={setCurrentTransferType}
                                                     setActive={setSelectDropdownActive} />
                            </ul>
                        )}
                    </ul>
            </ul>
            <ul className="bottom-container">
                <ul className="wrapper">
                    <ul className="field">
                        <p>Transaction Date</p>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                disableFuture
                                value={dateValue}
                                onChange={handleChange}
                                renderInput={(params) => <TextField {...params} sx={{svg: { color:'white' }}} />}
                            />
                        </LocalizationProvider>
                    </ul>
                {itemActive != "transfer" && (
                    <React.Fragment>
                        <p className="total-label">Total</p>
                        <p className="total-dollar">$ {total}</p>
                    </React.Fragment>
                )}
                </ul>
            </ul>
            <ul className="btn-ul">
                <div className="add-transaction-btn">
                    <p onClick={addTransactionClicked}>Add Transaction</p>
                    <div className={getErrorLabelClassname()}>
                        <p>Error, please check the input fields and retry!</p>
                    </div>
                </div>
            </ul>
           
            
        </React.Fragment>
    )
}