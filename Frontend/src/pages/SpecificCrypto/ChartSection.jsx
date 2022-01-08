import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import CryptoChart from '../../components/Chart/CryptoChart';
import './SpecificCrypto.css';
import "./../../App.css";

let crypto_prices = [];
let market_caps = [];
let volumes = [];

const ChartSection = () => {
    const [chartType, setChartType] = useState("price");
    const [chartInterval, setChartInterval] = useState("1");

    //per avere l'id della crypto da visualizzare
    const location = useLocation()
    const cryptoID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    const [chartData, setChartData] = useState([{name: 'Price', data: []}]);
    const [chartDatetime, setChartDatetime] = useState([]);

    const fetcher = () => {
        fetch(`https://api.coingecko.com/api/v3/coins/${cryptoID}/market_chart?vs_currency=usd&days=${chartInterval}`)
        .then((res) => res.json())
        .then((result) => processData(result));
    }

    useEffect(() => {
        fetcher();
    }, []);

    useEffect(() => {
        fetcher();
    }, [cryptoID]);

    //se cambia l'intervallo di tempo, fetcho i dati nuovi
    useEffect(() =>{
        fetcher();
    }, [chartInterval]);

    //ogni volta che cambia il tipo di chart (price, cap, volume), imposto i dati nuovi che erano stati già fetchati
    useEffect(checkChartType, [chartType]);

    function checkChartType() {
        if(chartType === "price") {
            setChartData([{
                name: 'Price',
                data: crypto_prices
            }]);
        }

        if(chartType === "market_cap") {
            setChartData([{
                name: 'Market Cap',
                data: market_caps
            }]);
        }

        if(chartType === "volume") {
            setChartData([{
                name: 'Volume 24h',
                data: volumes
            }]);
        }
    }

    function processData(res) {
        crypto_prices = [];
        market_caps = [];
        volumes = [];
        let prices = res["prices"];
        let caps = res["market_caps"]
        let vols = res["total_volumes"]
        let times = [];

        prices.forEach((item) => {
            if(item[1]>1)
                crypto_prices.push(item[1].toFixed(2));
            else
                crypto_prices.push(item[1].toFixed(6));

            times.push(item[0]);
        })
        

        caps.forEach((item) => {
            market_caps.push(item[1]);
        })

        vols.forEach((item) => {
            volumes.push(item[1]);
        })

        setChartDatetime(times);
        //dopo il fetch, controllo che tipo di chart era attivo
        checkChartType();
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
                <p className={isBtnChartActive("365")} onClick={() => setChartInterval("365")}>1Y</p>
                <p className={isBtnChartActive("max")} onClick={() => setChartInterval("max")}>ALL</p>
            </ul>
        )
    }

    return (
        <div className="chart-div">
            <div style={{paddingTop:'20px'}}></div>
            <ul className="btn-containers-list">
                <ul className="btn-container">
                    <p className={isBtnActive("price")} onClick={() => setChartType("price")}>Price</p>
                    <p className={isBtnActive("market_cap")} onClick={() => setChartType("market_cap")}>Market cap</p>
                    <p className={isBtnActive("volume")} onClick={() => setChartType("volume")}>Volume</p>
                </ul>
                <div className="h-spacer" />
                <ChartButtons className="chart-btns-desktop"/>
            </ul>
            <CryptoChart 
                className="chart"
                width="100%" 
                height="160%"
                data={chartData} 
                timestamps={chartDatetime} 
                color="#32C0FF"
            />  
            <ChartButtons className="chart-btns-mobile"/>
        </div>
    );
}

export default ChartSection


