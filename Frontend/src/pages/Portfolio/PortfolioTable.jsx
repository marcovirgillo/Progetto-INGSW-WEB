import React, { useState, useEffect } from 'react'
import { TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import "./Portfolio.css"
import { Link  } from 'react-router-dom'

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

function getPriceClass(price) {
    let className = 'table-item ';
    className += price < 0 ? 'item-red' : 'item-green';
    return className;
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

function formatPercentage(change) {
    if(change >= 0){
        return "+" + change.toFixed(2) + " %";
    }
    
    return change.toFixed(2) + " %";
}

export const formatProfitDollar = (price) => {
    if(price >= 0)
        return "+ " + getFormattedPrice(price);
    else {
        let priceF = "- " + getFormattedPrice(price * -1);
        return priceF;
    }
}

function DropdownOptions(props) {
    return (
        <div className={props.className}>
            <ul className="options-list">
                <ul className="option-item">
                    <img src={require("../../res/logos/plus-nocircle.png")} width={24}/>
                    <p onClick={() => {props.openAddTransaction(props.cripto); props.closeDropdown(); }}>Add Transaction</p>
                </ul>
                <ul className="option-item">
                    <img src={require("../../res/logos/transaction.png")} width={24}/>
                    <p>All Transactions</p>
                </ul>
                <ul className="option-item">
                    <img src={require("../../res/logos/remove.png")} width={24}/>
                    <p>Remove Asset</p>
                </ul>
            </ul>
        </div>
    )
}

export default function CriptoTable(props) {
    const { data } = props;
    const [order, setOrder] = useState("ASC");
    const [tableData, setTableData] = useState(data);
    //è un array di valori 1/0 che dice se la riga i della tabella ha il dropdown attivo
    const [dropdownsActive, setDropdownsActive] = useState([]);

    //itemactive è un'etichetta che dice chi è l'elemento che ha fatto il sorting
    const [itemActive, setItemActive] = useState(null);
    
    useEffect(() => {
        setTableData(data);
        resetDropdowns();
    }, [data]);

    const resetDropdowns = () => {
        let arr = [];
        for(var i = 0; i < data.length; ++i)
            arr.push(0);

        setDropdownsActive(arr);
    }

    const setThisDropdownActive = (idx) => {
        let arr = [];
        for(var i = 0; i < data.length; ++i) {
            if(i != idx)
                arr.push(0);
            else {
                if(dropdownsActive[i] === 0)
                    arr.push(1);
                else
                    arr.push(0);
            }
        }

        setDropdownsActive(arr);
    }

    const getDropdownClassName = (idx) => {
        if(dropdownsActive [idx] === 1)
            return "dropdown-options drop-opt-active";
        else
            return "dropdown-options"; 
    }

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

    return (
        <Table className="table" sx={{maxWidth: '94%', marginTop: '30px'}}>
            <TableHead>
                <TableRow>
                    <TableCell className="table-attribute">Name</TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("price"); setItemActive("price")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="Price" arrowChecker="price" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change_24h"); setItemActive("24h")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="24h" arrowChecker="24h" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("change_7d"); setItemActive("7d")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="7d" arrowChecker="7d" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("holding_dollar"); setItemActive("holding")}} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="Holdings" arrowChecker="holding" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("avg_buy_price"); setItemActive("avg-buy-price"); }} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="Avg. Buy Price" arrowChecker="avg-buy-price" />
                    </TableCell>
                    <TableCell className="table-attribute" onClick={() => {sorting("profit_dollar"); setItemActive("profit"); }} style={{cursor: 'pointer'}}>
                        <TableCellArrow content="Profit/Loss" arrowChecker="profit" />
                    </TableCell>
                    <TableCell className="table-attribute">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {tableData.length > 0 && (
                    tableData.map((item, val) => (
                        <TableRow key={val}>
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
                                <TableCell className={getPriceClass(item.change_24h)}>
                                    {formatPercentage(item.change_24h)} 
                                </TableCell>
                                <TableCell className={getPriceClass(item.change_7d)}>
                                    {formatPercentage(item.change_7d)} 
                                </TableCell>
                                <TableCell className="table-item">
                                    <ul className="table-item-list">
                                        <li>{item.holdings}</li>
                                        <li className="item-grey">{getFormattedPrice(item.holding_dollar)}</li>
                                    </ul>
                                </TableCell>
                                <TableCell className="table-item">
                                    {getFormattedPrice(item.avg_buy_price)}
                                </TableCell>
                                <TableCell className="table-item">
                                    <ul className="table-item-list">
                                        <li>{formatProfitDollar(item.profit_dollar)}</li>
                                        <li className={"profit " + getPriceClass(item.profit_dollar)}>
                                            {item.profit_percentage} %
                                        </li>
                                    </ul>
                                </TableCell>
                                <TableCell>
                                    <div className="options-btn" onClick={() => setThisDropdownActive(val)}>
                                        <img src={require("../../res/logos/3-dots.png")} width={21}/>
                                    </div>
                                    <DropdownOptions className={getDropdownClassName(val)} openAddTransaction={props.openAddTransaction} 
                                        cripto={item} closeDropdown={() => setThisDropdownActive(-1)}/>
                                </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}