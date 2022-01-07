import React, { useEffect, useState } from 'react'
import CryptoChart from '../../components/Chart/CryptoChart';
import { PlaceholderBalanceChange, PlaceholderInfo, PortfolioData } from './Data.js';
import PortfolioTable, { formatProfitDollar } from './PortfolioTable';
import "./../../App.css";
import "./Portfolio.css";
import plus_icon from "./../../res/logos/plus.png";
import { address } from '../../assets/globalVar';

const greenColor = "#46C95B";
const redColor = "#E05757";

const portfolioChartUrl = `http://${address}:8080/portfolioValue`;
const portfolioInfoUrl = `http://${address}:8080/portfolioInfo`;

function IndicatorRectangle(props) {
    let classname = 'rectangle ';
    classname = classname + (props.price_change >= 0 ? 'rectangle-green' : 'rectangle-red');

    return(
        <div className={classname}>
            {props.price_change} %
        </div>
    );
}

const Portfolio = () => {
    const [chartType, setChartType] = useState("chart");
    const [chartInterval, setChartInterval] = useState("1");

    const [chartData, setChartData] = useState([{name: 'Price', data: []}]);
    const [chartDatetime, setChartDatetime] = useState([]);
    const [portfolioInfo, setPortfolioInfo] = useState(PlaceholderInfo);
    const [portfolioChange, setPortfolioChange] = useState(PlaceholderBalanceChange);
    const [authToken, setAuthToken] = useState("");

    let myheaders = {
        "authToken": authToken,
        "timeStamp": chartInterval
    }

    const fetcherChart = () => {
        fetch(portfolioChartUrl, {
            method: 'GET',
            headers: myheaders
        })
        .then((res) => res.json())
        .then((result) => processData(result),
              (error) => console.log("error"));
    }

    const fetcherInfo = () => {
        fetch(portfolioInfoUrl)
        .then((res) => res.json())
        .then((result) => setPortfolioInfo(result),
              (error) => console.log("error"));
    }

    useEffect(() => {
        fetcherChart();
        fetcherInfo();
    }, []);

    //se cambia l'intervallo di tempo, fetcho i dati nuovi
    useEffect(() =>{
        fetcherChart();
    }, [chartInterval]);

    function processData(res) {
        let portfolioValues = [];
        let portfolioTimes = [];

        res.data.forEach((item) => {
            if(item["value"]>1)
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
                <p className={isBtnChartActive("max")} onClick={() => setChartInterval("max")}>ALL</p>
            </ul>
        )
    }

    const ButtonAddNewAsset = () => {
        return (
            <div className="add-new-btn">
                <ul className="inline-list">
                    <img src={plus_icon} width={24} height={24} alt="icon"/>
                    <p className="white-label btn-label">Add New</p>
                </ul>
            </div>
        );
    }

    return (
        <div className="portfolio">
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
                    {chartData [0].data.length > 1 && (
                    <CryptoChart className="chart"
                        color={portfolioChange.balance_change_24h >= 0 ? greenColor : redColor} 
                        width="100%" 
                        height="120%"
                        data={chartData} 
                        timestamps={chartDatetime} 
                    />
                    )}
                    { chartType === 'chart' && (<ChartButtons className="chart-btns-mobile"/>) }
                </div>
                <ul className="assets-list">
                    <p className="white-label assets-label">My Assets</p>
                    <div className="h-spacer-assets" />
                    <ButtonAddNewAsset />
                </ul>
                <ul style={{display: 'flex', flexDirection: 'columns', padding: 0, margin: 0,
                            justifyContent: 'center', alignItems: 'flex-start'}}>
                    <PortfolioTable data={portfolioInfo.assets}/>
                </ul>
            </div>
        </div>
    )
}

export default Portfolio;