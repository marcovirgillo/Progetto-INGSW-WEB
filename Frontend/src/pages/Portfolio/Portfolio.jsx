import React, { useEffect, useState } from 'react'
import CryptoChart from '../../components/Chart/CryptoChart';
import { PortfolioData } from './Data.js';
import "./../../App.css";
import "./Portfolio.css";

const greenColor = "#46C95B";
const redColor = "#E05757";

function IndicatorRectangle(props) {
    let classname = 'rectangle ';
    classname = classname + (props.price_change[0] === '+' ? 'rectangle-green' : 'rectangle-red');

    return(
        <div className={classname}>
            {props.price_change}
        </div>
    );
}

const Portfolio = () => {
    const [cryptoPrices, setCryptoPrices] = useState([]);
    const [cryptoDatetime, setCryptoDatetime] = useState([]);

    const [chartType, setChartType] = useState("chart");
    const [chartInterval, setChartInterval] = useState("24h");

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30")
            .then((res) => res.json())
            .then((result) => processData(result));
    }, []);

    function getClassNameChange(price) {
        return (price[0] === '+' ? 'label-green' : 'label-red');
    }

    function processData(res) {
        let prices = res ["prices"];
        let values = new Array();
        let times = new Array();
        prices.map((item) => {
            values.push(item [1].toFixed(2));
            times.push(item [0]);
        })

        setCryptoPrices([{
            name: "Price",
            data: values
        }])

       
        setCryptoDatetime(times);
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
                <p className={isBtnChartActive("24h")} onClick={() => setChartInterval("24h")}>24h</p>
                <p className={isBtnChartActive("7d")} onClick={() => setChartInterval("7d")}>7D</p>
                <p className={isBtnChartActive("30d")} onClick={() => setChartInterval("30d")}>30D</p>
                <p className={isBtnChartActive("90d")} onClick={() => setChartInterval("90d")}>90D</p>
                <p className={isBtnChartActive("all")} onClick={() => setChartInterval("all")}>ALL</p>
            </ul>
        )
    }


    return (
        <div className="portfolio">
            <div className="paper-grey">
            <h4 className="name-label">{PortfolioData.portfolio_name}</h4>
            <ul className="portfolio-list">
                <h3 className="current-balance-label">Current Balance</h3>
                <ul className="inline-list">
                    <p className="current-balance">{PortfolioData.balance}</p>
                    <IndicatorRectangle price_change={PortfolioData.balance_change_24h_percentage}/>
                </ul>
                <ul className="inline-list">
                    <p className={getClassNameChange(PortfolioData.balance_change_24h)}>{PortfolioData.balance_change_24h}</p>
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
                <CryptoChart className="chart"
                    color={greenColor} 
                    width="100%" 
                    height="120%"
                    data={cryptoPrices} 
                    timestamps={cryptoDatetime} 
                />
                { chartType === 'chart' && (<ChartButtons className="chart-btns-mobile"/>) }
            </div>
            </div>
        </div>
    )
}

export default Portfolio;
