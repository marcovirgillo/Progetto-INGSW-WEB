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
                <ul className="inline-list btn-container" style={{marginTop: '15px'}}>
                    <p className={isBtnActive("chart")} onClick={() => setChartType("chart")}>Chart</p>
                    <p className={isBtnActive("allocation")} onClick={() => setChartType("allocation")}>Allocation</p>
                    <p className={isBtnActive("statistics")} onClick={() => setChartType("statistics")}>Statistics</p>
                </ul>
            </ul>
                <CryptoChart
                    color={greenColor} 
                    width="80%" 
                    height="200%"
                    data={cryptoPrices} 
                    timestamps={cryptoDatetime} 
                />
            </div>
        </div>
    )
}

export default Portfolio;
