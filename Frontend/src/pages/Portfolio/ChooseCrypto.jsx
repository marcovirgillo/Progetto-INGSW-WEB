import React, { useState, useEffect } from 'react'
import { address } from '../../assets/globalVar';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField } from '@mui/material';
import  ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import  ArrowDropUpRoundedIcon  from '@mui/icons-material/ArrowDropUpRounded';

const allCryptoUrl = `http://${address}:8080/supportedCryptoSorted`;

function SearchField(props) {
    return (
        <div className="app-bar-search-field">
            <img className="app-bar-search-icon" alt="search icon"
                src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="app-bar-search" type="text" placeholder="Search.." onChange={(ev) => props.queryData(ev.target.value)} />
        </div>
    );
}

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

function CryptoTransactions(props) {
    const [itemActive, setItemActive] = useState("buy");
    const [value, setValue] = React.useState(new Date());
    const [currentTransferType, setCurrentTransferType] = useState("i");
    const [selectDropdownActive, setSelectDropdownActive] = useState(false);

    //state per i valori dei field
    const [cryptoQuantField, setCryptoQuantField] = useState(0.0);
    const [cryptoPriceField, setCryptoPriceField] = useState(props.crypto.price);

    console.log(cryptoQuantField);
    console.log(cryptoPriceField);

    const getClassName = (elem) => {
        if(elem === itemActive)
            return "btn-active";
    }

    const handleChange = (newValue) => {
        console.log("a");
        setValue(newValue);
    };

    const addTransactionClicked = () => {

    }

    //faccio in modo che solo i numeri possono essere digitati nell'input field
    const checkNumbers = (ev) => {
        const val = ev.target.value;
        const key = ev.key;

        if(key === ".") {
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
        const val = ev.target.value;
        console.log(val);
        fun(ev.target.value);
    }

    const getTransactionLabel = () => {
        if(currentTransferType === "i")
            return "Transfer In";
        
        return "Transfer Out"; 
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
                                    type="number" placeholder="0.0" lang="en"
                            />
                        </ul>
                        {itemActive != "transfer" && (
                            <ul className="field price-field">
                                <p>Price per coin</p>
                                <span className="dollar-symbol">$</span>
                                <input value={cryptoPriceField} onKeyPress={(ev) => checkNumbers(ev)} onChange={(ev) => updateField(ev, setCryptoPriceField)} 
                                        type="number" lang="en"
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
                                value={value}
                                onChange={handleChange}
                                renderInput={(params) => <TextField {...params} sx={{svg: { color:'white' }}} />}
                                sx={{border: '1 px solid red'}}
                            />
                        </LocalizationProvider>
                    </ul>
                {itemActive != "transfer" && (
                    <React.Fragment>
                        <p className="total-label">Total</p>
                        <p className="total-dollar">$ 0</p>
                    </React.Fragment>
                )}
                </ul>
            </ul>
            <ul className="btn-ul">
                <div className="add-transaction-btn">
                    <p onClick={addTransactionClicked}>Add Transaction</p>
                </div>
            </ul>
           
            
        </React.Fragment>
    )
}

export default function ChooseCrypto(props) {
    const [allCryptos, setAllCryptos] = useState([]);
    const [queryedData, setQueryedData] = useState(allCryptos);
    const [transactionPanelActive, setTransactionPanelActive] = useState(false);
    const [lastSelectedCrypto, setLastSelectedCrypto] = useState({});

    const closeTransactionPanel = () => {
        props.setDialogOpen(false);
        setTimeout(() => setTransactionPanelActive(false), 100);
    }


    useEffect(() => {
        fetch(allCryptoUrl)
            .then((res) => res.json())
            .then((result) => {setAllCryptos(result); setQueryedData(result)},
                  (error) => console.log(error));
    }, []);

    const queryData = (str) => {
        let allCryptoCopy = [];

        allCryptos.forEach((item) => {
            if((item.name.toLowerCase()).includes(str.toLowerCase()) || (item.ticker.toLowerCase()).includes(str.toLowerCase()))
                allCryptoCopy.push(item);
        })

        setQueryedData(allCryptoCopy);
    }

    return (
        <div className={props.className}>
            {!transactionPanelActive && (
                <React.Fragment>
                    <ul className="inline-list select-list">
                        <h3 style={{color: 'white'}}>Select Coin</h3>
                        <div className="h-spacer-choose-crypto"/>
                        <CloseRoundedIcon className="close-btn" sx={{color: 'white', fontSize: 32, cursor: 'pointer'}} 
                            onClick={() => props.setDialogOpen(false)}/>
                    </ul>
                    <ul className="search-list">
                        <SearchField queryData={queryData}/>
                        <ul className="search-list crypto-list">
                            {queryedData.map((item, val) => (
                                <ul key={val} className="crypto-list-item" onClick={() => {setLastSelectedCrypto(item); setTransactionPanelActive(true)}}>
                                    <img src={item.logo} width={30} alt="crypto logo"/>  
                                    <p>{item.name}</p>
                                    <p className="ticker">{item.ticker.toUpperCase()}</p>
                                    <div className="h-spacer-choose-crypto" />
                                    <ArrowForwardIosRoundedIcon sx={{color: 'white', marginRight: '5px'}}/>
                                </ul>
                            ))}
                        </ul>
                    </ul>
                </React.Fragment>
            )}
            {transactionPanelActive && (
                <CryptoTransactions crypto={lastSelectedCrypto} closePanel={closeTransactionPanel} />
            )}
        </div>
    )
}