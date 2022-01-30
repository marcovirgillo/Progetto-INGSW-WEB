import React, { useEffect, useState } from 'react'
import './SpecificCrypto.css';
import "./../../App.css";
import ChartSection from './ChartSection'
import HeaderSection from './HeaderSection'
import StatisticsSection from './StatisticsSection'
import { useLocation } from 'react-router';
import { useNavigate } from "react-router-dom";
import { TableBody, Table, TableCell, TableHead, TableRow, Icon } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import AddAlert from './AddAlert';
import { address } from './../../assets/globalVar.js';

const SpecificCrypto = (props) => {
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [cryptoData, setCryptoData] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [markets, setMarkets] = useState([]);

    const [addAlertActive, setAddAlertActive] = useState(false);

    const [order, setOrder] = useState("DSC");
    const [itemActive, setItemActive] = useState(null);

    const sorting = (col) => {
        if(order === "ASC"){
            const sorted = [...markets].sort((a,b) => 
                a[col] > b[col] ? 1 : -1     
            );
            setMarkets(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...markets].sort((a,b) => 
                a[col] < b[col] ? 1 : -1     
            );
            setMarkets(sorted)
            setOrder("ASC")
        }
    }

    const sortingVolume = (col,id) =>{
        if(order === "ASC"){
            const sorted = [...markets].sort((a,b) => 
                a[col][id] > b[col][id] ? 1 : -1     
            );
            setMarkets(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...markets].sort((a,b) => 
                a[col][id] < b[col][id] ? 1 : -1     
            );
            setMarkets(sorted)
            setOrder("ASC")
        }
    }

    const location = useLocation()
    const cryptoID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    const fetcher = () => {
        fetch(`https://api.coingecko.com/api/v3/coins/${cryptoID}`)
        .then((res) => res.json())
        .then((result) => setData(result), 
        (error) => console.log("Error fetching crypto"));
    }

    function setData(data){
        setCryptoData(data);
        setMarkets(data.tickers);
    }

    const exchangesFetcher = () => {
        fetch(`https://${address}/getTop100Exchanges`) 
        .then((res) => res.json())
        .then((result) => setExchanges(result),
        (error) => console.log("Error fetching exchanges in specific crypto"));
    }

    const fetchData = () => {
        fetcher();
        exchangesFetcher();
    }

    useEffect(fetchData, []);
    useEffect(fetchData, [cryptoID]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
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

    function renderItemTicker(market, base, item){
        if(market == '0XC02AAA39B223FE8D0A0E5C4F27EAD9083C756CC2')
            return  'WETH';
        if(market.startsWith("0X"))
            return cryptoData.symbol.toUpperCase();
        if(market.length > 20){
            if(base === "base" && item.coin_id != undefined)
                return item.coin_id;
            if(base === "target" && item.target_coin_id != undefined)
                return item.target_coin_id;
        }
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

    function getDescription(desc){
        let tmp = document.createElement("DIV");
        tmp.innerHTML = desc;
        return tmp.textContent || tmp.innerText || "";
    }

    function descriptionStyle(){
        if(screenSize>600)
            return {fontSize:'15px', marginRight:'55px', fontWeight:'500', color:'#DBDBDB'};
        return {fontSize:'13px', marginRight:'55px', fontWeight:'500', color:'#DBDBDB'};
    }

    function isSupported(){
        let crypto = props.allCrypto.find(({ticker}) => ticker === cryptoData.symbol);
        
        if(crypto !== undefined){
            return true;
        }
        
        return false;        
    }

    const MarketsSection = () => {
        return (
            <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Table className="table" sx={{maxWidth: '93%', marginTop: '10px'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-attribute">Pair</TableCell>
                            <TableCell className="table-attribute">Market</TableCell>
                            <TableCell className="table-attribute" onClick={() => {sorting("last"); setItemActive("last")}} style={{cursor: 'pointer'}}>
                                <TableCellArrow content="Last price" arrowChecker="last" />
                            </TableCell>
                            <TableCell className="table-attribute" onClick={() => {sortingVolume("converted_volume","usd"); setItemActive("volume")}} style={{cursor: 'pointer'}}>
                                <TableCellArrow content="Volume" arrowChecker="volume" />
                            </TableCell>
                            <TableCell className="table-attribute">Trust score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {   
                        fetchedData() && (
                            ((markets).slice(0,20)).map((item, val) => (
                            <TableRow key={val}>
                                <TableCell className="table-item">
                                    {renderItemTicker(item.base, "base", item)}/{renderItemTicker(item.target, "target", item)}
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
        )
    }

    const navigate = useNavigate();

    function handleAllert(){
        if(props.accessToken === "" || props.accessToken === null){
            navigate("/login");
            return;
        }
        setAddAlertActive(!addAlertActive)
    }

    return (    
        <div className="specific-crypto">
            <div className="paper-grey">
                <div style={{paddingTop:'20px'}}/>
                <HeaderSection data={cryptoData} accessToken={props.accessToken} allCrypto={props.allCrypto} />
                <AddAlert cryptoData={cryptoData} addAlertActive={addAlertActive} closePanel={() => setAddAlertActive(false)} accessToken={props.accessToken} showResultPopup={props.showResultPopup}/>
                {
                    screenSize>600 && (
                        <React.Fragment>
                            <div style={{paddingTop:'20px'}}/>
                            <StatisticsSection data={cryptoData} />
                        </React.Fragment>
                    )
                }
                {isSupported() && (
                    <div className="button-container" style={{marginRight:'0px', marginTop:'0px', marginBottom:'0px'}}>
                        <ul className="alert-container-title" onClick={() => handleAllert()}>
                            <img className="favourite-image" src={require("../../res/logos/alert.png")} width={35} height={35}  style={{marginRight:'10px', marginTop:'1px'}}/>
                            <p className="edit-alert">Add Alert</p>
                        </ul>
                    </div>
                )}
                <p className="cripto-title">{cryptoData.name} Interactive Chart</p>
                <ChartSection />
                {   
                    screenSize<=600 && (
                        <StatisticsSection data={cryptoData} />
                    )
                } 
                <div style={{paddingTop:'20px'}}/>
                <p className="cripto-title">About {cryptoData.name}</p>
                {fetchedData() && (
                    <p className="cripto-description" style={descriptionStyle()}>{getDescription(cryptoData.description.en)}</p>
                )}
                <div style={{paddingTop:'20px'}}/>
                <p className="cripto-description">{cryptoData.name} Markets</p>
                <MarketsSection />
            </div>
        </div>
    );
}

export default SpecificCrypto


