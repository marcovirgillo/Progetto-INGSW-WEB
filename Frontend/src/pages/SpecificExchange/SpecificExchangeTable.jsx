import React, { useState, useEffect } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { useInterval } from '../../components/Hooks.js';
import { useLocation } from 'react-router';
import { address } from './../../assets/globalVar.js';

const interval_fetch = 1000 * 120;

export default function ExchangesTable() {
    const [cryptoTable, setCryptoTable] = useState([]);
    const [exchangesTable, setExchangesTable] = useState([]);
    const [order, setOrder] = useState("ASC");
    const [itemActive, setItemActive] = useState(null);

    const sorting = (col) => {
        if(order === "ASC"){
            const sorted = [...exchangesTable].sort((a,b) => 
                a[col] > b[col] ? 1 : -1     
            );
            setExchangesTable(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...exchangesTable].sort((a,b) => 
                a[col] < b[col] ? 1 : -1     
            );
            setExchangesTable(sorted)
            setOrder("ASC")
        }
    }

    const isArrowActive = (order, type) => {
        if(itemActive === type) {
            if(order === "DSC")
                return <ArrowDropUpRoundedIcon/>;
            return <ArrowDropDownRoundedIcon />;
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

    function getPriceWithCurrency(price) {
        let str = formatter.format(price);
        return str.substring(0, str.length - 3);
    }

    const [exchangeData, setExchangeData] = useState([]);

    const location = useLocation()
    const exchangeID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    const fetcher = () => {
        fetch(`https://api.coingecko.com/api/v3/exchanges/${exchangeID}/tickers`)
        .then((res) => res.json())
        .then((result) => setExchangeData(result.tickers),
        (error) => alert("Error fetching exchange"));
        
    }

    useEffect(() => {
        fetcher();
    }, []);

    const fetchData = () => {
        fetch(`http://${address}:8080/getTop100`)
            .then((res) => res.json())
            .then((result) => setCryptoTable(result),
                  (error) => alert("Error fetching top 100 cryptos"));
    };

    useEffect(fetchData, []);

    useInterval(() => fetchData, interval_fetch);

    function check(string) {
        if (string === undefined)
            return string
        string = string.replace(/-/, ' ')
        return string.toUpperCase()
    }

    function getImageOfCrypto(ticker_id){
        ticker_id = ticker_id.toLowerCase()
        let crypto = cryptoTable.find(({ticker}) => ticker === ticker_id);
        
        if(crypto !== undefined)
            return crypto.logo;
        
        return require("../../res/logos/change.png");
    }

    function changeColor(color) {
        return 'table-item item-' + color + '-exchange';
    }

    return (
        <Table className="table" sx={{maxWidth: '95%', marginTop: '30px'}}>
            <TableHead>
                <TableRow>
                    <TableCell className="table-attribute">Coin</TableCell>
                    <TableCell className="table-attribute">Pair</TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change"); setItemActive("last_price")}} style={{cursor: 'pointer'}}>
                       {  <span className="table-header-list">
                            Last price
                            { isArrowActive(order, "last_price") }
                         </span> }
                        
                    </TableCell>
                    <TableCell className="table-attribute"> Volume </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change"); setItemActive("spread")}} style={{cursor: 'pointer'}}>
                        {  <span className="table-header-list">
                                Spread
                                {isArrowActive(order, "spread")}
                            </span> }
                    </TableCell>
                    <TableCell className="table-attribute">Trust score</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    exchangeData.map((item, val) => (
                            <TableRow key={val}>
                                    <TableCell className="table-item-exchange-specific">
                                        <div className="image-coin">
                                            <img src= {getImageOfCrypto(item.base)} width={24} height={24} style={{marginRight: 10}}/>{item.coin_id}  / <img src= {getImageOfCrypto(item.target)} width={24} height={24} style={{marginRight: 10, marginLeft:5}}/>{item.target_coin_id}
                                        </div>
                                    </TableCell>
                                    <TableCell className="table-item-exchange-specific">
                                        {item.base.startsWith("0X") ? item.coin_id.toUpperCase() : item.base} / {item.target.startsWith("0X") ? check(item.target_coin_id) : item.target}
                                    </TableCell>
                                    <TableCell className="table-item-exchange-specific">
                                        {getPriceWithCurrency(item.converted_last.usd)}
                                    </TableCell>
                                    <TableCell className="table-item-exchange-specific">
                                        {getPriceWithCurrency(item.converted_volume.usd)}
                                    </TableCell>
                                    <TableCell className="table-item-exchange-specific">
                                        {item.bid_ask_spread_percentage}%
                                    </TableCell>
                                    <TableCell className="table-item-exchange-specific">
                                        <div className="trust-bar-exchange">
                                            <div className={changeColor(item.trust_score)}> <div className="trust_score"> </div> </div>
                                        </div>
                                    </TableCell>
                            </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}