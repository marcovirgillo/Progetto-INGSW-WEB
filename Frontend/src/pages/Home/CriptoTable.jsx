import React, { Component, useState, useEffect, useReducer } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow, Icon } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import "./Home.css"
import { useInterval } from '../../components/Hooks.js';
import { Link, useNavigate  } from 'react-router-dom'
import { address } from './../../assets/globalVar.js';

import { Preferred } from './TestData.js';

//https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const interval_fetch = 1000 * 120; //60 secondi

const getPreferencesUrl = `https://${address}/getPreferences`;
const addPreferenceUrl = `https://${address}/addPreference`;
const removePreferenceUrl = `https://${address}/removePreference`;

export default function CriptoTable(props) {
    const [cryptoTable, setCryptoTable] = useState([]);
    const [order, setOrder] = useState("ASC");
    const [itemActive, setItemActive] = useState(null);

    const [preferred, setPreferred] = useState([]);

    const optionsPreferences = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    }

    let optionsAddPreference = {
        method: 'PUT',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken,
        },
        body: {}
    }

    let optionsRemovePreference = {
        method: 'DELETE',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken,
        },
        body: {}
    }

    const addPreference = (ticker_) => {
        const body = {
            'ticker': ticker_
        }

        optionsAddPreference.body = JSON.stringify(body);

        fetch(addPreferenceUrl, optionsAddPreference)
            .then(res => parseResponse(res));
    }

    const removePreference = (ticker_) => {
        const body = {
            'ticker': ticker_
        }

        optionsRemovePreference.body = JSON.stringify(body);

        fetch(removePreferenceUrl, optionsRemovePreference)
            .then(res => parseResponse(res));
    }

    const parseResponse = res => {
        if(res.status === 200) {
            console.log("Preference added/removed successfully!");
        }
         else {
            res.json().then(result => console.log(result));
        }
    }

    useEffect(() => {
        if(props.accessToken === "")
            setPreferred([]);
        else{
            fetcherPreferences();
        }
    }, [props.accessToken]); 

    useEffect(() => {
        if(props.accessToken !== null && props.accessToken !== ""){
            console.log("Fetching preferences")
            fetcherPreferences();
        }
    }, []);

    const fetcherPreferences = () => {
        if(props.accessToken === null || props.accessToken === "")
            return;

        fetch(getPreferencesUrl, optionsPreferences)
        .then((res) => processPreferences(res));
    }

    const processPreferences = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => setPreferred(result.preferences),
                      (error) => console.log(error));
        }
        else if(res.status === 490) {
            console.log("No preferences found");
        }
    }

    const sorting = (col) => {
        if(order === "ASC"){
            const sorted = [...cryptoTable].sort((a,b) => 
                a[col] > b[col] ? 1 : -1     
            );
            setCryptoTable(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...cryptoTable].sort((a,b) => 
                a[col] < b[col] ? 1 : -1     
            );
            setCryptoTable(sorted)
            setOrder("ASC")
        }
    }

    const isArrowActive = (order, type) => {
        if(itemActive == type) {
            if(order == "DSC")
                return <ArrowDropUpRoundedIcon/>;

            return <ArrowDropDownRoundedIcon />;
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

    function getPriceClass(price) {
        let className = 'table-item ';
        className += price < 0 ? 'item-red' : 'item-green';
        return className;
    }

    function getPriceWithCurrency(price) {
        let str = formatter.format(price);
        return str.substring(0, str.length - 3);
    }

    function getFormattedPrice(price) {
        if(price > 1)
            return formatter.format(price);
        else 
            return "$" + price;
    }

    function change(change) {
        if(change > 0){
            return "+" + change.toFixed(2);
        }
        
        return change.toFixed(2);
    }

    const TableCellArrow = props => {
        return (
            <span className="table-header-list">
                { props.content }
                { isArrowActive(order, props.arrowChecker) }
            </span>
        )
    }

    const fetchData = () => {
        fetch(`https://${address}/getTop100`)
            .then((res) => res.json())
            .then((result) => setCryptoTable(result),
                  (error) => console.log("Error fetching top 100 cryptos"));
    };

    useEffect(fetchData, []);

    useInterval(() => fetchData, interval_fetch);

    function findPreferred(name){
        if(preferred === undefined)
            return false;
        var item  = preferred.find(item => item.id === name);
        if(item != undefined) {
            return true;
        }
        return false;
    }

    const navigate = useNavigate();

    function handlePreferred(flag, crypto){
        if(props.accessToken === "" || props.accessToken === null){
            navigate("/login");
            return;
        }
        if(flag === false){
            removePreference(crypto);
            var array  = [...preferred].filter(item => item.id != crypto);
            setPreferred(array);
        }
        else{
            addPreference(crypto);
            var newPref = {id: crypto};
            var array = [...preferred];
            array.push(newPref);
            setPreferred(array);
        }
    }

    return (
        <Table className="table" sx={{maxWidth: '95%', marginTop: '30px'}}>
            <TableHead>
                <TableRow>
                    <TableCell className="table-attribute"onClick={() => {sorting("rank"); setItemActive("rank")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="#" arrowChecker="rank" />
                    </TableCell>
                    <TableCell className="table-attribute">Name</TableCell>
                    <TableCell className="table-attribute"onClick={() => {sorting("price"); setItemActive("price")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="Price" arrowChecker="price" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change_1h"); setItemActive("1h")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="1h" arrowChecker="1h" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change_24h"); setItemActive("24h")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="24h" arrowChecker="24h" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change_7d"); setItemActive("7d")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="7d" arrowChecker="7d" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("market_cap"); setItemActive("market-cap")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="Market Cap" arrowChecker="market-cap" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("volume"); setItemActive("total-volume"); }} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="Volume" arrowChecker="total-volume" />
                    </TableCell>
                    <TableCell className="table-attribute">7d Chart</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    cryptoTable.map((item, val) => (
                            <TableRow key={val}>
                                    <TableCell className="table-item">
                                        <ul style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                                            {findPreferred(item.ticker) ? 
                                                <img src={require("../../res/logos/star-checked.png")} width={18} height={18}  style={{paddingRight:'15px', cursor:'pointer', paddingBottom:'5px'}} onClick={() => handlePreferred(false, item.ticker)}/> :
                                                <img src={require("../../res/logos/star-unchecked.png")} width={18} height={18} style={{paddingRight:'15px', cursor:'pointer', paddingBottom:'5px'}} onClick={() => handlePreferred(true, item.ticker)}/>
                                            }
                                            {item.rank}
                                        </ul>
                                    </TableCell>
                                    <TableCell className="table-item">
                                        <ul style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                                            <img src={item.logo} width={24} height={24} style={{marginRight: 10}}/>
                                            <Link to={`/crypto/${item.id}`} className="item-name">
                                                <p>{item.name}</p>
                                            </Link>
                                            <p className="item-ticker" style={{textAlign: 'center'}}>({item.ticker.toUpperCase()})</p>
                                        </ul>
                                    </TableCell>
                                    <TableCell className="table-item">
                                        {getFormattedPrice(item.price)}
                                    </TableCell>
                                    <TableCell className={getPriceClass(item.change_1h)}>
                                        {change(item.change_1h)} %
                                    </TableCell>
                                    <TableCell className={getPriceClass(item.change_24h)}>
                                        {change(item.change_24h)} %
                                    </TableCell>
                                    <TableCell className={getPriceClass(item.change_7d)}>
                                        {change(item.change_7d)} %
                                    </TableCell>
                                    <TableCell className="table-item">
                                    {getPriceWithCurrency(item.market_cap)}
                                    </TableCell>
                                    <TableCell className="table-item">
                                        {getPriceWithCurrency(item.volume)}
                                    </TableCell>
                                    <TableCell className="table-item">
                                        <img src={item.chart7d} />
                                    </TableCell>
                            </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}