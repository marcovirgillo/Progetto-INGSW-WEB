import React, { Component, useState, useEffect } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import { CriptoData } from "./TestData.js"
import "./Home.css"

const api_url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";

export default function CriptoTable() {
    const [marketStats, setMarketStats] = useState([]);
    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

    //L'id della cripto è contenuto dentro il link per la sua immagine, quindi prima lo estraggo dalla stringa e poi lo inserisco nel link del chart
    function getChartUrl(image_url) {
        let part1 = image_url.substr(42, image_url.length);
        let part2 = part1.substr(0, part1.indexOf("/"));
        return `https://www.coingecko.com/coins/${part2}/sparkline`;
    }

    function getPriceClass(price) {
        let className = 'table-item ';
        className += price < 0 ? 'item-red' : 'item-green';
        return className;
    }

    function getPriceWithCurrency(price) {
        let str = formatter.format(price);
        return str.substr(0, str.length - 3);
    }

    useEffect(() => {
        fetch(api_url)
            .then((res) => res.json())
            .then((result) => setMarketStats(result),
                  (error) => alert("Error during fetch!"));
    }, []);

    return (
        <Table className="table" sx={{maxWidth: '95%', marginTop: '30px'}}>
            <TableHead>
                <TableRow>
                    <TableCell className="table-attribute">#</TableCell>
                    <TableCell className="table-attribute">Name</TableCell>
                    <TableCell className="table-attribute">Price</TableCell>
                    <TableCell className="table-attribute">24h</TableCell>
                    <TableCell className="table-attribute">7d</TableCell>
                    <TableCell className="table-attribute">Market Cap</TableCell>
                    <TableCell className="table-attribute">Volume</TableCell>
                    <TableCell className="table-attribute">7d Chart</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    marketStats.map((item, val) => (
                        <TableRow key={val}>
                            <TableCell className="table-item">{item.market_cap_rank}</TableCell>
                            <TableCell className="table-item">
                                <ul style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                                    <img src={item.image} width={24} height={24} style={{marginRight: 10}}/>
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-ticker">({item.symbol.toUpperCase()})</p>
                                </ul>
                            </TableCell>
                            <TableCell className="table-item">{formatter.format(item.current_price)}</TableCell>
                            <TableCell className={getPriceClass(item.price_change_percentage_24h)}>
                                {item.price_change_percentage_24h.toFixed(2)} %
                            </TableCell>
                            <TableCell className={getPriceClass(item.price_change_percentage_7d_in_currency)}>
                                {item.price_change_percentage_7d_in_currency.toFixed(2)} %
                            </TableCell>
                            <TableCell className="table-item">
                               {getPriceWithCurrency(item.market_cap)}
                            </TableCell>
                            <TableCell className="table-item">
                                {getPriceWithCurrency(item.total_volume)}
                            </TableCell>
                            <TableCell className="table-item">
                                <img src={getChartUrl(item.image)} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}