import React, { useState, useEffect } from 'react'
import { address } from '../../assets/globalVar';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

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

export default function ChooseCrypto(props) {
    const [allCryptos, setAllCryptos] = useState([]);
    const [queryedData, setQueryedData] = useState(allCryptos);

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
                        <ul key={val} className="crypto-list-item">
                            <img src={item.logo} width={30} alt="crypto logo"/>  
                            <p>{item.name}</p>
                            <p className="ticker">{item.ticker.toUpperCase()}</p>
                            <div className="h-spacer-choose-crypto" />
                            <ArrowForwardIosRoundedIcon sx={{color: 'white', marginRight: '5px'}}/>
                        </ul>
                    ))}
                </ul>
            </ul>
        </div>
    )
}