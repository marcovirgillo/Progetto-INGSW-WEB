import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import CryptoChart from '../../components/Chart/CryptoChart';
import './SpecificCrypto.css';
import "./../../App.css";

const SpecificCrypto = () => {
    const [chartType, setChartType] = useState("price");
    const [chartInterval, setChartInterval] = useState("1");

    //per avere l'id della crypto da visualizzare
    const location = useLocation()
    const cryptoID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    //FARE STATE UNICO
    const [cryptoPrices, setCryptoPrices] = useState([]);
    const [cryptoMarketcaps, setCryptoMarketCaps] = useState([]);
    const [cryptoVolumes, setCryptoVolumes] = useState([]);

    const [cryptoDatetime, setCryptoDatetime] = useState([]);

    let prices = [];
    let market_caps = [];
    let volumes = [];

    function fetcher(){
        fetch(`https://api.coingecko.com/api/v3/coins/${cryptoID}/market_chart?vs_currency=usd&days=${chartInterval}`)
        .then((res) => res.json())
        .then((result) => processData(result, chartType));

        console.log("Fetched", chartInterval)
    }

    useEffect(() => {
            fetcher();
    }, []);

    useEffect(() =>{
        console.log("INTERVAL: ", chartInterval);
        fetcher();
    }, [chartInterval])

    

    function processData(res) {
        prices = res["prices"];
        market_caps = res["market_caps"]
        volumes = res["total_volumes"]
        let values = [];
        let times = [];

        prices.map((item) => {
            if(item[1]>1)
                values.push(item [1].toFixed(2));
            else
                values.push(item[1].toFixed(6));
            times.push(item [0]);
        })
        setCryptoPrices([{
            name: "Price",
            data: values
        }])

        values = [];
        market_caps.map((item) => {
            values.push(item [1].toFixed(2));
        })

        setCryptoMarketCaps([{
            name: "Market cap",
            data: values
        }])

        values = [];

        volumes.map((item) => {
            values.push(item [1].toFixed(2));
        })

        setCryptoVolumes([{
            name: "Volume",
            data: values
        }])

        setCryptoDatetime(times);  

        console.log("SETTED ", chartInterval)
    }

    function isBtnActive(name) {
        return (name === chartType ? 'btn-active' : '');
    }

    function isBtnChartActive(name) {
        return (name === chartInterval ? 'btn-active' : '');
    }

    function intervalHandler(interval){
        setChartInterval(interval);
        console.log("SET ", interval)
   /*      fetcher(); */
    }

    function handleChartType(type){
        setChartType(type)
    }

    const ChartButtons = (props) => {
        return (
            <ul className={"btn-container chart-btn-controller " + props.className}>
                <p className={isBtnChartActive("1")} onClick={() => intervalHandler("1")}>24h</p>
                <p className={isBtnChartActive("7")} onClick={() => intervalHandler("7")}>7D</p>
                <p className={isBtnChartActive("30")} onClick={() => intervalHandler("30")}>30D</p>
                <p className={isBtnChartActive("90")} onClick={() => intervalHandler("90")}>90D</p>
                <p className={isBtnChartActive("365")} onClick={() => intervalHandler("365")}>1Y</p>
                <p className={isBtnChartActive("max")} onClick={() => intervalHandler("max")}>ALL</p>
            </ul>
        )
    }

    function getDesiredData(){
        switch(chartType){
            case 'price':
                return prices;
            case 'market_cap':
                return market_caps;
            case 'volume':
                return volumes;
        }
    }


    // se i dati non sono stati fetchati, non fare return TODO sistemare
    if(cryptoPrices.length === 0 || cryptoDatetime.length === 0)
        return (<React.Fragment />)


    console.log("RENDER")

    return (
        <div className="specific-crypto">
            <div className="paper-grey">
                <div className="chart-div">
                    <ul className="btn-containers-list">
                        <ul className="btn-container">
                            <p className={isBtnActive("price")} onClick={() => handleChartType("price")}>Price</p>
                            <p className={isBtnActive("market_cap")} onClick={() => setChartType("market_cap")}>Market cap</p>
                            <p className={isBtnActive("volume")} onClick={() => setChartType("volume")}>Volume</p>
                        </ul>
                        <div className="h-spacer" />
                        <ChartButtons className="chart-btns-desktop"/>
                    </ul>
                    <CryptoChart 
                        className="chart"
                        width="100%" 
                        data={getDesiredData()} 
                        timestamps={cryptoDatetime} 
                        color="#32C0FF"
                    />  
                    <ChartButtons className="chart-btns-mobile"/>
                </div>
            </div>
            
        </div>
    );
}

export default SpecificCrypto


