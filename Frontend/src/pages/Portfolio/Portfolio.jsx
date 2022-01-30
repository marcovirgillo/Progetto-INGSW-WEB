import React, { useEffect, useState, useRef } from 'react'
import CryptoChart from '../../components/Chart/CryptoChart';
import { PlaceholderBalanceChange, PlaceholderInfo } from './Data.js';
import PortfolioTable, { formatProfitDollar } from './PortfolioTable';
import "./../../App.css";
import "./Portfolio.css";
import plus_icon from "./../../res/logos/plus.png";
import { address } from '../../assets/globalVar';
import ChooseCrypto from './ChooseCrypto';
import { useNavigate } from "react-router-dom";
import CreatePortfolio from './CreatePortfolio';
import PieChart from '../../components/Chart/PieChart';
import PortfolioStatistics from './PortfolioStatistics';
import CircularProgress from '@mui/material/CircularProgress';
import { blue } from '@mui/material/colors';

const greenColor = "#46C95B";
const redColor = "#E05757";

const portfolioChartUrl = `https://${address}/portfolioValue`;
const portfolioInfoUrl = `https://${address}/portfolioInfo`;

//è il rettangolo che mostra l'andamento percentuale delle 24h
function IndicatorRectangle(props) {
    let classname = 'rectangle ';
    classname = classname + (props.price_change >= 0 ? 'rectangle-green' : 'rectangle-red');

    return(
        <div className={classname}>
            {props.price_change} %
        </div>
    );
}

const Portfolio = (props) => {
    const [chartType, setChartType] = useState("chart");
    const [chartInterval, setChartInterval] = useState("1");

    const [chartData, setChartData] = useState([{name: 'Price', data: []}]);
    const [chartDatetime, setChartDatetime] = useState([]);
    const [portfolioInfo, setPortfolioInfo] = useState(PlaceholderInfo);
    const [portfolioChange, setPortfolioChange] = useState(PlaceholderBalanceChange);
    const [chooseCryptoPageActive, setChooseCryptoPageActive] = useState(false);
    //è l'ultima cripto scelta, attraverso la tabella o il pannello aggiungi transazione
    const [lastSelectedCrypto, setLastSelectedCrypto] = useState({});
    const [transactionPanelActive, setTransactionPanelActive] = useState(false);
    const [portfolioExists, setPortfolioExists] = useState(true);
    const [infoFetched, setInfoFetched] = useState(false);

    const myAssetsUl = useRef(null);

    const navigate = useNavigate();

    const optionsChart = {
        method: 'GET',
        headers : {
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken,
            'timeStamp': chartInterval
        }
    }

    const optionsInfo = {
        method: 'GET',
        headers : {
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken,
        }
    }

    const processInfo = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => setPortfolioInfo(result),
                      (error) => console.log(error));
        }

        if(res.status === 461) {
            console.log("Portfolio doesn't exists");
            setPortfolioExists(false);
        }
        else 
            setPortfolioExists(true);

        setInfoFetched(true);
    }

    const processValue = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => processData(result),
                    (error) => console.log(error));
        }

        if(res.status === 461) {
            console.log("Portfolio doesn't exists");
            setPortfolioExists(false);
        }
        else 
            setPortfolioExists(true);
    }

    const fetcherChart = () => {
        if(props.accessToken === null || props.accessToken === "")
            return;

        fetch(portfolioChartUrl, optionsChart)
            .then((res) => processValue(res));
    }

    const fetcherInfo = () => {
        if(props.accessToken === null || props.accessToken === "")
            return;

        fetch(portfolioInfoUrl, optionsInfo)
            .then((res) => processInfo(res));
    }

    useEffect(() => {
        if(props.accessToken === null || props.accessToken === ""){
            navigate("/login");
        }
        else {
            setInfoFetched(false);
            fetcherInfo();
        }
    }, [props.accessToken]);

    //se cambia l'intervallo di tempo, fetcho i dati nuovi
    useEffect(() =>{
        fetcherChart();
    }, [chartInterval]);

    function processData(res) {
        let portfolioValues = [];
        let portfolioTimes = [];

        res.data.forEach((item) => {
            if(item["value"] > 1)
                portfolioValues.push(item["value"].toFixed(2));
            else
                portfolioValues.push(item["value"].toFixed(6));

            portfolioTimes.push(item["time"]);
        })
        
        setChartDatetime(portfolioTimes);

        setChartData([{
            name: 'Value',
            data: portfolioValues}]);

        setPortfolioChange({
            balance_change_24h_percentage: res.balance_change_24h_percentage,
            balance_change_24h: res.balance_change_24h
        });
    }

    function getClassNameChange(price) {
        return (price >= 0 ? 'label-green' : 'label-red');
    }

    function getCryptoDialogClass() {
        let cName = "choose-crypto-div ";
        if(chooseCryptoPageActive)
            cName = cName + " div-active";

        return cName;
    }

    function isBtnActive(name) {
        return (name === chartType ? 'btn-active' : '');
    }

    function isBtnChartActive(name) {
        return (name === chartInterval ? 'btn-active' : '');
    }

    const ChartButtons = (props) => {
        return (
            <ul className={"btn-container chart-btn-controller " + props.className}>
                <p className={isBtnChartActive("1")} onClick={() => setChartInterval("1")}>24h</p>
                <p className={isBtnChartActive("7")} onClick={() => setChartInterval("7")}>7D</p>
                <p className={isBtnChartActive("30")} onClick={() => setChartInterval("30")}>30D</p>
                <p className={isBtnChartActive("90")} onClick={() => setChartInterval("90")}>90D</p>
                <p className={isBtnChartActive("360")} onClick={() => setChartInterval("360")}>1Y</p>
            </ul>
        )
    }

    const ButtonAddNewAsset = (props) => {
        return (
            <div className="add-new-btn">
                <ul className="inline-list" onClick={() => props.setCryptoDialogOpen(true)}>
                    <img src={plus_icon} width={24} height={24} alt="icon"/>
                    <p className="white-label btn-label">Add New</p>
                </ul>
            </div>
        );
    }

    //data una cripto, apre direttamente il pannello aggiungi nuova cripto
    const openAddTransaction = (cripto) => {
        setTransactionPanelActive(true);
        setLastSelectedCrypto(cripto);
        setChooseCryptoPageActive(true);
    }

    const updateData = () => {
        fetcherChart();
        fetcherInfo();
    }

    //prendo le mie cripto e processo i dati per il pie chart
    const parsePortfolioAssets = () => {
        let chart_data = {
            'labels': [],
            'holdings': [],
        }
        
        portfolioInfo.assets.forEach((item, val) => {
            chart_data.labels.push(item.ticker.toUpperCase());
            chart_data.holdings.push(item.holding_dollar);
        })

        return chart_data;
    }

    if(infoFetched === false) {
        return (
            <div className="portfolio">
                <div className="paper-grey">
                    <div style={{display: 'flex', justifyContent: 'center', paddingTop: '100px', paddingBottom: '80px'}}>
                        <CircularProgress size={100} 
                            sx={{color: blue[300], '&.Mui-checked': { color: blue[300] } }}
                        /> 
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="portfolio">
                {!portfolioExists && (<CreatePortfolio updateData={updateData} accessToken={props.accessToken} showResultPopup={props.showResultPopup}/>)}
                {portfolioExists && (
                    <div className="paper-grey">
                        <h4 className="name-label">{portfolioInfo.portfolio_name}</h4>
                        <ul className="portfolio-list">
                            <h3 className="current-balance-label">Current Balance</h3>
                            <ul className="inline-list">
                                <p className="current-balance">
                                    {formatProfitDollar(portfolioInfo.balance).substring(2)}
                                </p>
                                <IndicatorRectangle price_change={portfolioChange.balance_change_24h_percentage}/>
                            </ul>
                            <ul className="inline-list">
                                <p className={getClassNameChange(portfolioChange.balance_change_24h)}>
                                    {formatProfitDollar(portfolioChange.balance_change_24h)}
                                </p>
                                <p className="label-24h">24h</p>
                            </ul>
                        </ul>
                        <div className="chart-div" style={{marginTop: '20px'}}>
                            <ul className="btn-containers-list">
                                <ul className="btn-container">
                                    <p className={isBtnActive("chart")} onClick={() => setChartType("chart")}>Chart</p>
                                    <p className={isBtnActive("allocation")} onClick={() => setChartType("allocation")}>Allocation</p>
                                    <p className={isBtnActive("statistics")} onClick={() => setChartType("statistics")}>Statistics</p>
                                </ul>
                                <div className="h-spacer" />
                                { chartType === 'chart' && (<ChartButtons className="chart-btns-desktop"/>) }
                            </ul>
                            {chartType === "chart" && chartData [0].data.length > 1 && (
                            <CryptoChart className="chart"
                                color={portfolioChange.balance_change_24h >= 0 ? greenColor : redColor} 
                                width="100%" 
                                height="120%"
                                data={chartData} 
                                timestamps={chartDatetime} 
                                showYlines={true}
                            />
                            )}
                            { chartType === 'chart' && (<ChartButtons className="chart-btns-mobile"/>) }
                            { chartType === 'allocation' && portfolioInfo.assets.length > 0 && (
                                <ul style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                    <PieChart width="500px" height="300px" data={parsePortfolioAssets()} />
                                </ul>
                            )}
                            { chartType === 'statistics' && portfolioInfo.assets.length > 0 && (
                                <PortfolioStatistics data={portfolioInfo.assets} />
                            )}
                        </div>
                        <ul ref={myAssetsUl} className="assets-list">
                            <p className="white-label assets-label">My Assets</p>
                            <div className="h-spacer-assets" />
                            <ButtonAddNewAsset setCryptoDialogOpen={setChooseCryptoPageActive}/>
                        </ul>
                        <ul style={{display: 'flex', flexDirection: 'columns', padding: 0, margin: 0,
                                    justifyContent: 'center', alignItems: 'center'}}>
                            <PortfolioTable accessToken={props.accessToken} 
                                    fetchChart={fetcherChart} fetchInfo={fetcherInfo} 
                                    showResultPopup={props.showResultPopup}
                                    data={portfolioInfo.assets} 
                                    openAddTransaction={openAddTransaction} assetsUl={myAssetsUl}/>
                        </ul>

                        <ChooseCrypto accessToken={props.accessToken} 
                            fetchChart={fetcherChart} fetchInfo={fetcherInfo} lastSelectedCrypto={lastSelectedCrypto}
                            className={getCryptoDialogClass()} setDialogOpen={setChooseCryptoPageActive} 
                            setLastSelectedCrypto={setLastSelectedCrypto} allCrypto={props.allCrypto}
                            transactionPanelActive={transactionPanelActive} setTransactionPanelActive={setTransactionPanelActive} 
                            dialogActive={chooseCryptoPageActive}
                            showResultPopup={props.showResultPopup}/>
                    </div>
                )}
        </div>
    )
}

export default Portfolio;