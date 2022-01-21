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
const editTransactionUrl = `http://${address}:8080/updateTransaction`;

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
    /* se ricevo i dati della transazione dalle props, li inizializzo con quel valore, altrimenti li inizializzo normalmente */
    const [itemActive, setItemActive] = useState(props.transaction_type || "buy");
    const [dateValue, setDateValue] = useState(props.date ? new Date(props.date) : new Date());
    const [currentTransferType, setCurrentTransferType] = useState(props.transfer_type || "i");
    const [selectDropdownActive, setSelectDropdownActive] = useState(false);
    const [errorLabelActive, setErrorLabelActive] = useState(false);
    const [errorLabelMessage, setErrorLabelMessage] = useState("");

    //state per i valori dei field
    const [cryptoQuantField, setCryptoQuantField] = useState(props.quantity || 0.0);
    const [cryptoPriceField, setCryptoPriceField] = useState(props.cripto_price || props.crypto.price);
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

    const addTransactionClicked = () => {
        let transaction_type = itemActive[0];

        //se è attivo il pannello transazioni, imposto il type come current transfer type
        if(itemActive === "transfer")
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
           showErrorMessage("Error! Please try again later");
        }
    }

    const editTransaction = () => {
        let transaction_type = itemActive[0];

        //se è attivo il pannello transazioni, imposto il type come current transfer type
        if(itemActive === "transfer")
            transaction_type = currentTransferType;
    
        try {
            const body = {
                'data': {
                    'ticker': props.crypto.ticker,
                    'type': transaction_type,
                    'quantity': cryptoQuantField,
                    'price_usd_crypto': cryptoPriceField,
                    'total_usd_spent': total,
                    'transaction_date': dateValue.toISOString().split("T")[0],
                    'transaction_time': dateValue.toISOString().split("T")[1]
                },
                'id': props.transaction_id
            }

            options.body = JSON.stringify(body);
            
            fetch(editTransactionUrl, options)
                .then(res => parseResponse(res));
        } catch(error) {
           showErrorMessage("Error! Please try again later");
        }
    }

    const parseResponse = res => {
        if(res.status === 200) {
            //se esiste questo metodo, fetcho portfolio info, chart e dati della cripto del qual ho modificato una transazione
            if(props.fetchAllData) {
                props.fetchAllData();
            }
            else {
                props.fetchInfo();
                props.fetchChart();
            }

            props.closePanel();
        }
        else if(res.status === 5020) {
            res.json().then(result => console.log(result));
            showErrorMessage("Error, please check the input fields and retry!");
        } else if (res.status === 5030) {
            showErrorMessage("Insufficient crypto amount, please retry!");
        } else {
            res.json().then(result => console.log(result));
        }
    }

    const showErrorMessage = (msg) => {
        setErrorLabelMessage(msg);
        setErrorLabelActive(true);
        setTimeout(() =>{ setErrorLabelMessage(""); setErrorLabelActive(false)}, 3500);
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
        <div className={props.className}>
            <ul className="inline-list select-list">
                <h3 style={{color: 'white'}}>{props.editTransaction ? "Edit Transaction" : "Add Transaction"}</h3>
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
                        {itemActive !== "transfer" && (
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
                {itemActive !== "transfer" && (
                    <React.Fragment>
                        <p className="total-label">Total</p>
                        <p className="total-dollar">$ {total}</p>
                    </React.Fragment>
                )}
                </ul>
            </ul>
            <ul className="btn-ul">
                <div className="add-transaction-btn">
                    <p onClick={props.editTransaction ? editTransaction : addTransactionClicked}>Add Transaction</p>
                </div>
                <div className={getErrorLabelClassname()}>
                        <p>{errorLabelMessage}</p>
                </div>
            </ul>
        </div>
    )
}