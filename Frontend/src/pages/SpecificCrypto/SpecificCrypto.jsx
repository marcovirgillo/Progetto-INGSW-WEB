import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import CryptoChart from '../../components/Chart/CryptoChart';

const SpecificCrypto = () => {
    const location = useLocation()
    const cryptoID = location.state.id; 

    const [cryptoPrices, setCryptoPrices] = useState([]);
    const [cryptoDatetime, setCryptoDatetime] = useState([]);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30")
            .then((res) => res.json())
            .then((result) => processData(result));
    }, []);

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

    // se i dati non sono stati fetchati, non fare return TODO sistemare
    if(cryptoPrices.length === 0 || cryptoDatetime.length === 0)
        return (<React.Fragment />)

    return (
        <React.Fragment>
            <CryptoChart width="80%" data={cryptoPrices} timestamps={cryptoDatetime} color="#46C95B"/>
        </React.Fragment>
    );
}

export default SpecificCrypto


