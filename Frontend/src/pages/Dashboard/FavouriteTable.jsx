import React, { Component, useState, useEffect } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow, Icon } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { useInterval } from '../../components/Hooks.js';
import { Link, Navigate  } from 'react-router-dom'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { address } from './../../assets/globalVar.js';

const removePreferenceUrl = `http://${address}:8080/removePreference`;

export default function CriptoTable(props) {
    const [preferred, setPreferred] = useState([]);
    const [order, setOrder] = useState("ASC");
    const [itemActive, setItemActive] = useState(null);

    useEffect(() => {
        if(props.preferred === undefined)
            setPreferred([]);
        else{
            setPreferred(props.preferred);
        }
    }, [props.preferred]); 

    let optionsRemovePreference = {
        method: 'DELETE',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken,
        },
        body: {}
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
            console.log("Preference removed successfully!");
        }
        else {
            res.json().then(result => console.log(result));
        }
    }

    const sorting = (col) => {
        if(order === "ASC"){
            const sorted = [...preferred].sort((a,b) => 
                a[col] > b[col] ? 1 : -1     
            );
            setPreferred(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...preferred].sort((a,b) => 
                a[col] < b[col] ? 1 : -1     
            );
            setPreferred(sorted)
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

    function handleRemovePreference(ticker){
        removePreference(ticker);
        var array  = [...preferred].filter(item => item.ticker != ticker);
        props.setPreferred(array);

        //Fare anche props.setPreferred per aggiornare tutta dashboard
    }

    return (
        <Table className="table" sx={{maxWidth: '95%', marginTop: '30px'}}>
            <TableHead>
                <TableRow>
                    <TableCell className="table-attribute"><span style={{marginLeft:'40px'}}>#</span></TableCell>
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
                    preferred.map((item, val) => (
                            <TableRow key={val}>
                                    <TableCell className="table-item">
                                        <ul style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                                            <img src={require("../../res/logos/remove.png")} width={24} height={24} alt="remove preference" className="delete-dashboard-icon"
                                                onClick={() => handleRemovePreference(item.ticker)}
                                            />
                                            <span style={{paddingLeft:'7px'}}>{val+1}</span>
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
