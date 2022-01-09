import React, { useState, useEffect } from 'react'
import { address } from '../../assets/globalVar';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField } from '@mui/material';

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

function CryptoTransactions(props) {
    const [itemActive, setItemActive] = useState("buy");
    const [value, setValue] = React.useState(new Date());

    const getClassName = (elem) => {
        if(elem === itemActive)
            return "btn-active";
    }

    const handleChange = (newValue) => {
        setValue(newValue);
      };

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
                        <input type="number" placeholder="0.0" lang="en"/>
                    </ul>
                    <ul className="field price-field">
                        <p>Price per coin</p>
                        <span className="dollar-symbol">$</span>
                        <input type="number" lang="en" defaultValue={props.crypto.price}/>
                    </ul>
                </ul>
            </ul>
            <ul className="picker-ul">
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
            </ul>
            <p className="total-label">Total</p>
            <p className="total-dollar">$ 0</p>
            <ul className="btn-ul">
                <div className="add-transaction-btn">
                    <p>Add Transaction</p>
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