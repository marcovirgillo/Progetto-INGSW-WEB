import React, { Component } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import { CriptoData } from "./TestData.js"
import "./Home.css"

export default function CriptoTable() {
    function getPriceClass(price) {
        let className = 'table-item ';
        className += price[0] === '+' ? 'item-green' : 'item-red';
        return className;
    }

    function getChartColor(price) {
        let className = price[0] === '+' ? 'chart-green' : 'chart-red';
        return className;
    }

    return (
        <Table className="table" sx={{maxWidth: '95%'}}>
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
                    CriptoData.map((item, val) => (
                        <TableRow key={val}>
                            <TableCell className="table-item">{item.rank}</TableCell>
                            <TableCell className="table-item">
                                <ul style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                                    <img src={item.logo} width={24} height={24} style={{marginRight: 10}}/>
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-ticker">({item.ticker})</p>
                                </ul>
                            </TableCell>
                            <TableCell className="table-item">{item.price}</TableCell>
                            <TableCell className={getPriceClass(item.change_24h)}>{item.change_24h}</TableCell>
                            <TableCell className={getPriceClass(item.change_7d)}>{item.change_7d}</TableCell>
                            <TableCell className="table-item">{item.m_cap}</TableCell>
                            <TableCell className="table-item">{item.volume}</TableCell>
                            <TableCell className="table-item">
                                <img className={getChartColor(item.change_7d)} src={item.chart} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}