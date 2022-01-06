import React, { Component, useState, useEffect } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow, Icon } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { useInterval } from '../../components/Hooks.js';
import { Link, Navigate  } from 'react-router-dom'
import "./Exchanges.css"
import { address } from './../../assets/globalVar.js';

//https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const interval_fetch = 1000 * 120; //60 secondi

export default function ExchangesTable() {
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
        if(itemActive == type) {
            if(order == "DSC")
                return <ArrowDropUpRoundedIcon/>;
                

            return <ArrowDropDownRoundedIcon />;
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

    function setColor(price) {
        let className = 'table-item ';
        if (price >= 8)
            return className += 'item-green-exchange';
        if (price >= 6)
            return className += 'item-yellow-exchange';

        return className += 'item-red-exchange';
    }

    function getPriceWithCurrency(price) {
        let str = formatter.format(price);
        return str.substring(0, str.length - 3);
    }

    const fetchData = () => {
        fetch(`http://${address}:8080/getTop100Exchanges`)
            .then((res) => res.json())
            .then((result) => setExchangesTable(result),
                  (error) => alert("Error fetching top 100 exchanges"));
    };

    useEffect(fetchData, []);

    useInterval(() => fetchData, interval_fetch);


    return (
        <Table className="table" sx={{maxWidth: '95%', marginTop: '30px'}}>
            <TableHead>
                <TableRow>
                    <TableCell className="table-attribute">#</TableCell>
                    <TableCell className="table-attribute">Exchange</TableCell>
                    <TableCell className="table-attribute"onClick={() => {sorting("trust_score"); setItemActive("trust_score")}} style={{cursor: 'pointer'}}>
                    {  <span className="table-header-list">
                            Trust score
                            { isArrowActive(order, "trust_score") }
                         </span> }
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change"); setItemActive("volume_24h")}} style={{cursor: 'pointer'}}>
                       {  <span className="table-header-list">
                            Volume (24h)
                            { isArrowActive(order, "volume_24h") }
                         </span> }
                        
                    </TableCell>
                    <TableCell className="table-attribute"> Country </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("yearEstabilished"); setItemActive("yearEstabilished")}} style={{cursor: 'pointer'}}>
                        {  <span className="table-header-list">
                                Year established
                                {isArrowActive(order, "yearEstabilished")}
                            </span> }
                    </TableCell>
                    <TableCell className="table-attribute">7d Chart</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    exchangesTable.map((item, val) => (
                            <TableRow key={val}>
                                    <TableCell className="table-item-exchange">{item.rank}</TableCell>
                                    <TableCell className="table-item-exchange">
                                        <ul style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                                            <img src={item.logo} width={24} height={24} style={{marginRight: 10}}/>
                                            <Link to={`/crypto/${item.name}`} state={{ id: item.id }} className="item-name-exchange">
                                                <p>{item.name}</p>
                                            </Link>
                                        </ul>
                                    </TableCell>
                                    <TableCell className="table-item-exchange">
                                        <div class="trust-bar-exchange">
                                            <div class={setColor(item.trust_score)}> <div className="trust_score"> {item.trust_score} </div> </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="table-item-exchange">
                                        {getPriceWithCurrency(item.volume)}
                                    </TableCell>
                                    <TableCell className="table-item-exchange">
                                        {item.country} 
                                    </TableCell>
                                    <TableCell className="table-item-exchange">
                                       {item.yearEstabilished}
                                    </TableCell>
                                    <TableCell className="table-item-exchange">
                                        <img src={item.chart_7d} />
                                    </TableCell>
                            </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}