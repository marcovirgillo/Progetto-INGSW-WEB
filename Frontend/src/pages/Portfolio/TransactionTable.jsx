import React, { useState, useEffect, useRef } from 'react';
import { TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import "./Portfolio.css"
import { address } from '../../assets/globalVar';
import { formatProfitDollar } from './PortfolioTable';
import ConfirmPopup from './ConfirmPopup';
import TransactionPanel from './TransactionPanel';

const transactionUrl = `http://${address}:8080/assetTransactions`
const removeTransactionUrl = `http://${address}:8080/removeTransaction`
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
    if(price === 0)
        return "--";

    if(price > 1)
        return formatter.format(price);
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
    const [popupActive, setPopupActive] = useState(false);
    const [lastSelectedTransaction, setLastSelectedTransaction] = useState({'type': ''});
    const [editTransactionActive, setEditTransactionActive] = useState(false);
   
    //itemactive è un'etichetta che dice chi è l'elemento che ha fatto il sorting
    const [itemActive, setItemActive] = useState(null);
    
    const options = {
        method: 'GET',
        headers: {
            'Authorization': props.accessToken,
            'Access-Control-Allow-Origin' : '*',
            'Cripto-Ticker': props.cripto.ticker
        }
    }

    const fetchAllTransactions = () => {
        fetch(transactionUrl, options)
            .then(res => res.json())
            .then(result => setTableData(result.transactions));
    }

    useEffect(() => {
        if(props.assetsUl.current !== null)
            props.assetsUl.current.style.display = 'none';

        fetchAllTransactions();

        return () => { if(props.assetsUl !== null) props.assetsUl.current.style.display = 'flex' }
    }, []);

    //il parametro è l'elemento del json sul quale fare l'ordinamento
    const sorting = (col) => {
        if(order === "ASC"){
            const sorted = [...tableData].sort((a,b) => 
                a[col] > b[col] ? 1 : -1     
            );
            setTableData(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...tableData].sort((a,b) => 
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
        if(price >= 0)
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

    const fetchAllData = () => {
        fetchAllTransactions();
        props.fetchChart();
        props.fetchInfo();
    }

    const parseDelete = res => {
        if(res.status === 200) {
            setPopupActive(false);
            fetchAllData();
        }
        else 
            res.json().then(result => console.log(result));
    }

    const removeCurrentTransaction = () => {
        const opt = {
            method: 'DELETE',
            headers: {
                'Authorization': props.accessToken,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                'transaction_id': lastSelectedTransaction.id
            })
        }
        
        fetch(removeTransactionUrl, opt)
            .then(res => parseDelete(res));
    }

    const getTransactionType = () => {
        if(lastSelectedTransaction.type === "")
            return;

        if(lastSelectedTransaction.type === "Buy")
            return "buy";
        else if(lastSelectedTransaction.type === "Sell")
            return "sell";
        else 
            return "transfer";
    }

    const getTransferType = () => {
        if(lastSelectedTransaction.type === "")
            return;

        if(lastSelectedTransaction.type === "Transfer In")
            return "i";
        else 
            return "o";
    }

    function getEditTransactionClass() {
        let cName = "choose-crypto-div ";
        if(editTransactionActive)
            cName = cName + " div-active";

        return cName;
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
                    <p className={getItemClassName(props.cripto.profit_dollar)}>{props.cripto.profit_percentage} % ({formatProfitDollar(props.cripto.profit_dollar)})</p>
                </ul>
            </ul>
            
            <Table className="transactions-table" sx={{maxWidth: '94%', marginTop: '30px'}}>
                <TableHead>
                    <TableRow>
                        <TableCell className="table-attribute" onClick={() => {sorting("date"); setItemActive("date")}} style={{cursor: 'pointer'}}>
                            <TableCellArrow content="Type" arrowChecker="date" />
                        </TableCell>
                        <TableCell className="table-attribute" onClick={() => {sorting("cripto_price"); setItemActive("price")}} style={{cursor: 'pointer'}}>
                            <TableCellArrow content="Price per Coin" arrowChecker="price" />
                        </TableCell>
                        <TableCell className="table-attribute" onClick={() => {sorting("quantity_usd"); setItemActive("holdings")}} style={{cursor: 'pointer'}}>
                            <TableCellArrow content="Amount" arrowChecker="holdings" />
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
                                            <li className="item-grey">{new Date(item.date).toUTCString()}</li>
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
                                        <span style={{marginLeft: '-4px'}} className="options-btn options-btn-transaction"
                                              onClick={() => {setLastSelectedTransaction(item); setEditTransactionActive(true)}}>
                                            <img src={require("../../res/logos/edit.png")} width={21} height={21} alt="edit"/>
                                        </span>
                                        <span className="options-btn options-btn-transaction"
                                              onClick={() => {setLastSelectedTransaction(item); setPopupActive(true)}}>
                                            <img src={require("../../res/logos/remove.png")} width={21} height={21} alt="remove" />
                                        </span>
                                    </TableCell>
                            </TableRow>)
                        ))
                    }
                </TableBody>
            </Table>
            
            {editTransactionActive && (
                <React.Fragment><div className="background-blurrer" />
                {/* passo tutti i dati per inizializzare i campi della transazione */}
                <TransactionPanel className={getEditTransactionClass()} 
                                editTransaction={true} date={lastSelectedTransaction.date} crypto={props.cripto}
                                quantity={lastSelectedTransaction.quantity_cripto}
                                cripto_price={lastSelectedTransaction.cripto_price}
                                transaction_id={lastSelectedTransaction.id}
                                transaction_type={getTransactionType()} transfer_type={getTransferType()}
                                accessToken={props.accessToken}
                                fetchAllData={fetchAllData}
                                closePanel={() => setEditTransactionActive(false)}
                /></React.Fragment>
            )}
            
            {popupActive && (<ConfirmPopup title="Remove Transaction" text={"Are you sure you want to remove this transaction ?"} 
                                        onConfirm={() => removeCurrentTransaction()} 
                                        onCancel={() => setPopupActive(false)}/>)}
        </div>
    )
}
