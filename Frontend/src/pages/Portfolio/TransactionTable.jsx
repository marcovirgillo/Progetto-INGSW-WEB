import React, { useState, useEffect } from 'react';
import { TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import "./Portfolio.css"
import { address } from '../../assets/globalVar';
import { formatProfitDollar } from './PortfolioTable';

const transactionUrl = `http://${address}:8080/assetTransactions`
const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});


function IndicatorRectangle(props) {
    let classname = 'rectangle ';
    classname = classname + (props.price_change >= 0 ? 'rectangle-green' : 'rectangle-red');

    return(
        <div className={classname}>
            {props.price_change.toFixed(2)} %
        </div>
    );
}

function BackButton(props) {
    return (
        <div className="back-btn" onClick={props.onClick}>
            <ArrowBackIosRoundedIcon style={{color: 'white', width: '28'}} />
            <p>Back</p>
        </div>
    )
}

function getFormattedPrice(price) {
    if(price > 1)
        return formatter.format(price);
    else if(price === 0) {
        return "$" + 0.0;
    }
    else {
        var decimals = 0;
        var priceTmp = price;
        while(priceTmp < 1) {
            priceTmp *= 10;
            decimals++;
        }

        return "$" + price.toFixed(decimals + 2);
    } 
}

export default function TransactionTable(props) {
    const [order, setOrder] = useState("ASC");
    const [tableData, setTableData] = useState([]);
   
    //itemactive è un'etichetta che dice chi è l'elemento che ha fatto il sorting
    const [itemActive, setItemActive] = useState(null);
    
    const options = {
        method: 'GET',
        headers: {
            'Authorization': props.accessToken,
            'Cripto-Ticker': props.cripto.ticker
        }
    }

    useEffect(() => {
        if(props.assetsUl.current !== null)
            props.assetsUl.current.style.display = 'none';

        fetch(transactionUrl, options)
            .then(res => res.json())
            .then(result => {setTableData(result.transactions)});

        return () => { if(props.assetsUl !== null) props.assetsUl.current.style.display = 'flex' }
    }, []);

    //il parametro è l'elemento del json sul quale fare l'ordinamento
    const sorting = (col) => {
        if(order === "ASC"){
            const sorted = [...props.data].sort((a,b) => 
                a[col] > b[col] ? 1 : -1     
            );
            setTableData(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...props.data].sort((a,b) => 
                a[col] < b[col] ? 1 : -1     
            );
            setTableData(sorted)
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

    const TableCellArrow = props => {
        return (
            <span className="table-header-list">
                { props.content }
                { isArrowActive(order, props.arrowChecker) }
            </span>
        )
    }

    const getItemClassName = (price) => {
        if(price > 0)
            return 'item-green';
        else
            return 'item-red';
    }

    const getTransactionTypeImage = (type) => {
        if(type === 'Buy')
            return require("../../res/logos/buy.png");
        if(type === 'Sell')
            return require("../../res/logos/sell.png");

        if(type === 'Transfer In' || type === "Transfer Out")
            return require("../../res/logos/transfer.png");

        return "";
    }

    return (
        <div className="all-transactions-div">
            <BackButton onClick={props.closeTable}/>
            <p className="cripto-label">{props.cripto.name} Balance</p>
            <ul style={{display: 'flex', alignItems: 'center', padding: 0}}>
                <img src={props.cripto.logo} alt="logo" widtrh={46} height={46}/>
                <p className="current-balance">{getFormattedPrice(props.cripto.holding_dollar)}</p>
                <IndicatorRectangle price_change={props.cripto.change_24h} />
            </ul>
            <ul className="stats-list">
                <ul className="cripto-info-item">
                    <p className="title">Quantity</p>
                    <p className="value">{props.cripto.holdings}</p>
                </ul>
                <ul className="cripto-info-item">
                    <p className="title">Avg. Buy Price</p>
                    <p className="value">{getFormattedPrice(props.cripto.avg_buy_price)}</p>
                </ul>
                <ul id="last-child" className="cripto-info-item">
                    <p className="title">Total profit/loss</p>
                    <p className={getItemClassName()}>{props.cripto.profit_percentage} % ({formatProfitDollar(props.cripto.profit_dollar)})</p>
                </ul>
            </ul>
            
            <Table className="transactions-table" sx={{maxWidth: '94%', marginTop: '30px'}}>
                <TableHead>
                    <TableRow>
                        <TableCell className="table-attribute">Type</TableCell>
                        <TableCell className="table-attribute" onClick={() => {sorting("price"); setItemActive("price")}} style={{cursor: 'pointer'}}>
                            <TableCellArrow content="Price" arrowChecker="price" />
                        </TableCell>
                        <TableCell className="table-attribute" onClick={() => {sorting("change_24h"); setItemActive("24h")}} style={{cursor: 'pointer'}}>
                            <TableCellArrow content="Amount" arrowChecker="24h" />
                        </TableCell>
                        <TableCell className="table-attribute">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.length > 0 && (
                        tableData.map((item, val) => (
                            <TableRow key={val}>
                                    <TableCell className="table-item" style={{display: 'flex', alignItems: 'center'}}>
                                        <img src={getTransactionTypeImage(item.type)} width={25} height={25} style={{marginRight: 10}}/>
                                        <ul className="table-item-list">
                                            <li>{item.type}</li>
                                            <li className="item-grey">{item.date}</li>
                                        </ul>
                                    </TableCell>
                                    <TableCell className="table-item">
                                        {getFormattedPrice(item.cripto_price)}
                                    </TableCell>
                                    <TableCell className="table-item">
                                        <ul className="table-item-list">
                                            <li className="item-grey">{getFormattedPrice(item.quantity_usd)}</li>
                                            <li>{item.quantity}</li>
                                        </ul>
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>
                            </TableRow>)
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}
