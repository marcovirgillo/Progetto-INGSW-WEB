import React, { Component, useState, useEffect } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow, Icon } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { CriptoData } from "./TestData.js"
import "./Home.css"
import { useInterval } from '../../components/Hooks.js';
import { Link, Navigate  } from 'react-router-dom'
import { address } from './../../assets/globalVar.js';

//https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const interval_fetch = 1000 * 120; //60 secondi

export default function CriptoTable() {
    const [cryptoTable, setCryptoTable] = useState([]);
    const [order, setOrder] = useState("ASC");
    const [itemActive, setItemActive] = useState(null);

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
                return <ArrowDropDownRoundedIcon/>;

            return <ArrowDropUpRoundedIcon />;
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

    //L'id della cripto è contenuto dentro il link per la sua immagine, quindi prima lo estraggo dalla stringa e poi lo inserisco nel link del chart
    function getChartUrl(image_url) {
        let part1 = image_url.substr(42, image_url.length);
        let part2 = part1.substring(0, part1.indexOf("/"));
        return `https://www.coingecko.com/coins/${part2}/sparkline`;
    }

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
        
        return change.toFixed(2)  
    }

    function handleOnClick(id){
        return <Navigate 
                    to={{
                    pathname: "/profile"                
                }}  
             />
    }

    const fetchData = () => {
        fetch(`http://${address}:8080/getTop100`)
            .then((res) => res.json())
            .then((result) => setCryptoTable(result),
                  (error) => alert("Error fetching top 100 cryptos"));
    };

    useEffect(fetchData, []);

    useInterval(() => fetchData, interval_fetch);


    return (
        <Table className="table" sx={{maxWidth: '95%', marginTop: '30px'}}>
            <TableHead>
                <TableRow>
                    <TableCell className="table-attribute">#</TableCell>
                    <TableCell className="table-attribute">Name</TableCell>
                    <TableCell className="table-attribute"onClick={() => {sorting("price"); setItemActive("price")}} style={{cursor: 'pointer'}}>
                    {  <span className="table-header-list">
                            Price
                            { isArrowActive(order, "price") }
                         </span> }
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change"); setItemActive("24h")}} style={{cursor: 'pointer'}}>
                       {  <span className="table-header-list">
                            24h
                            { isArrowActive(order, "24h") }
                         </span> }
                        
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change_7d"); setItemActive("7d")}} style={{cursor: 'pointer'}}>
                        {  <span className="table-header-list">
                                7d
                                { isArrowActive(order, "7d")}
                            </span> }
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("market_cap"); setItemActive("market-cap")}} style={{cursor: 'pointer'}}>
                        {  <span className="table-header-list">
                                Market Cap
                                {isArrowActive(order, "market-cap")}
                            </span> }
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("volume"); setItemActive("total-volume"); }} style={{cursor: 'pointer'}}>
                        {  <span className="table-header-list">
                                 Volume
                                {isArrowActive(order, "total-volume")}
                            </span> }
                    </TableCell>
                    <TableCell className="table-attribute">7d Chart</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    cryptoTable.map((item, val) => (
                            <TableRow key={val}>
                                    <TableCell className="table-item">{item.rank}</TableCell>
                                    <TableCell className="table-item">
                                        <ul style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                                            <img src={item.logo} width={24} height={24} style={{marginRight: 10}}/>
                                            <Link to={`/crypto/${item.name}`} state={{ id: item.id }} className="item-name">
                                                <p>{item.name}</p>
                                            </Link>
                                            <p className="item-ticker" style={{textAlign: 'center'}}>({item.ticker})</p>
                                        </ul>
                                    </TableCell>
                                    <TableCell className="table-item">
                                        {getFormattedPrice(item.price)}
                                    </TableCell>
                                    <TableCell className={getPriceClass(item.change)}>
                                        {change(item.change)} %
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
                                        <img src={getChartUrl(item.logo)} />
                                    </TableCell>
                            </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}