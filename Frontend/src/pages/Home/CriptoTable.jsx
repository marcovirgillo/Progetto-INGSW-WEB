import React, { Component } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import { CriptoData } from "./TestData.js"
import "./Home.css"

export default function CriptoTable() {
    /*Il margine è temporaneo, va sistemato con flexbox*/
    return (
        <Table className="table" sx={{maxWidth: '95%', marginLeft: '20px', marginTop: '20px'}}>
            <TableHead>
                <TableRow>
                    <TableCell className="table-item">#</TableCell>
                    <TableCell className="table-item">Name</TableCell>
                    <TableCell className="table-item">Price</TableCell>
                    <TableCell className="table-item">24h</TableCell>
                    <TableCell className="table-item">7d</TableCell>
                    <TableCell className="table-item">Market Cap</TableCell>
                    <TableCell className="table-item">Volume</TableCell>
                    <TableCell className="table-item">7d Chart</TableCell>
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
                                    <p>{item.name}</p>
                                </ul>
                            </TableCell>
                            <TableCell className="table-item">{item.price}</TableCell>
                            <TableCell className="table-item">{item.change_24h}</TableCell>
                            <TableCell className="table-item">{item.change_7d}</TableCell>
                            <TableCell className="table-item">{item.m_cap}</TableCell>
                            <TableCell className="table-item">{item.volume}</TableCell>
                            <TableCell className="table-item">
                                <img src={item.chart} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}