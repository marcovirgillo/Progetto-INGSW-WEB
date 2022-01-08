import React, { useEffect, useState } from 'react'
import './SpecificCrypto.css';
import "./../../App.css";
import ChartSection from './ChartSection'
import HeaderSection from './HeaderSection'
import StatisticsSection from './StatisticsSection'
import { Grid } from '@mui/material'
import { useLocation } from 'react-router';
import { TableBody, Table, TableCell, TableHead, TableRow, Icon } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { Link } from 'react-router-dom'
import { address } from './../../assets/globalVar.js';

const SpecificCrypto = () => {
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [cryptoData, setCryptoData] = useState([]);
    const [exchanges, setExchanges] = useState([]);

    const [order, setOrder] = useState("ASC");

    const [itemActive, setItemActive] = useState(null);

/*     const sorting = (col) => {
        if(order === "ASC"){
            const sorted = [...cryptoMarkets].sort((a,b) => 
                a[col] > b[col] ? 1 : -1     
            );
            setCryptoMarkets(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...cryptoMarkets].sort((a,b) => 
                a[col] < b[col] ? 1 : -1     
            );
            setCryptoMarkets(sorted)
            setOrder("ASC")
        }
    } */

    const location = useLocation()
    const cryptoID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    const fetcher = () => {
        fetch(`https://api.coingecko.com/api/v3/coins/${cryptoID}`)
        .then((res) => res.json())
        .then((result) => setCryptoData(result),
        (error) => console.log("Error fetching crypto"));
    }

    const exchangesFetcher = () => {
        fetch(`http://${address}:8080/getTop100Exchanges`) 
        .then((res) => res.json())
        .then((result) => setExchanges(result),
        (error) => console.log("Error fetching exchanges in specific crypto"));
    }

    useEffect(() => {
        fetcher();
        exchangesFetcher();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        /* handleResize(); */
        
        return () => window.removeEventListener('resize', handleResize);
    });

    const isArrowActive = (order, type) => {
        if(itemActive == type) {
            if(order == "DSC")
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

    function fetchedData(){
        return cryptoData.length !== 0 && exchanges.length !== 0;
    }

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

    function getFormattedPrice(price) {
        if(price > 1)
            return formatter.format(price);
        else 
            return "$" + price;
    }

    function renderItemTicker(market){
        if(market == '0XC02AAA39B223FE8D0A0E5C4F27EAD9083C756CC2')
            return  'WETH';
        if(market.startsWith("0X"))
            return cryptoData.symbol.toUpperCase();
        return market;
    }

    function getImageOfExchange(exchange_id){
        let exchange = exchanges.find(({id}) => id === exchange_id);
        
        if(exchange != undefined)
            return exchange.logo;
        
        return require("../../res/logos/change.png");
    }

    function getTrustScoreClass(trust_score){
        if(trust_score === "green")
            return "trust-score-container-green";
        if(trust_score === "yellow")
            return "trust-score-container-yellow"
        if(trust_score === "red")
            return "trust-score-container-red";
        
        return "trust-score-container-yellow"
    }

    return (
        <div className="specific-crypto">
            <div className="paper-grey">
                <div style={{paddingTop:'20px'}}/>
                <HeaderSection data={cryptoData}/>
                <div style={{paddingTop:'20px'}}/>
                {
                    screenSize>600 && (
                        <StatisticsSection data={cryptoData} />
                    )
                }
                <p className="cripto-title">{cryptoData.name} Interactive Chart</p>
                <ChartSection />
                {
                    screenSize<=600 && (
                        <StatisticsSection data={cryptoData} />
                    )
                } 
                <p className="cripto-title">{cryptoData.name} Markets</p>
                <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Table className="table" sx={{maxWidth: '93%', marginTop: '10px'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell className="table-attribute">Pair</TableCell>
                                <TableCell className="table-attribute">Market</TableCell>
                                <TableCell className="table-attribute" /* onClick={() => {sorting("price"); setItemActive("price")}} */ style={{cursor: 'pointer'}}>
                                    <TableCellArrow content="Last price" arrowChecker="price" />
                                </TableCell>
                                <TableCell className="table-attribute" /* onClick={() => {sorting("price"); setItemActive("price")}} */ style={{cursor: 'pointer'}}>
                                    <TableCellArrow content="Volume" arrowChecker="volume" />
                                </TableCell>
                                <TableCell className="table-attribute" /* onClick={() => {sorting("price"); setItemActive("price")}} */ style={{cursor: 'pointer', width:'15%'}}>
                                    <TableCellArrow content="Trust score" arrowChecker="trust score" />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {   
                            fetchedData() && (
                                ((cryptoData.tickers).slice(0,20)).map((item, val) => (
                                <TableRow key={val}>
                                    <TableCell className="table-item">
                                        {renderItemTicker(item.base)}/{renderItemTicker(item.target)}
                                    </TableCell>
                                    <TableCell className="table-item">
                                        <ul style={{display:'flex', margin:0, padding:0, flexDirection: 'row', alignItems:'center'}}>
                                            <img src= {getImageOfExchange(item.market.identifier)} width={24} height={24} style={{marginRight: 10}}/>
                                            <a href={item.trade_url} className="item-name"  >
                                                <p>{item.market.name}</p>
                                            </a>
                                        </ul>
                                    </TableCell>
                                    <TableCell className="table-item">{getFormattedPrice(item.converted_last.usd)}</TableCell>
                                    <TableCell className="table-item">{getFormattedPrice(item.converted_volume.usd)}</TableCell>
                                    <TableCell className="table-item">
                                    <div>
                                        <span className={getTrustScoreClass(item.trust_score)} style={{marginLeft:'35px'}}></span>
                                    </div>
                                    </TableCell>
                                </TableRow>
                                ))
                            )
                        }
                        </TableBody>
                    </Table>
                </ul>
            </div>
            
        </div>
    );
}

export default SpecificCrypto


