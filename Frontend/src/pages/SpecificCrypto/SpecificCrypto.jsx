import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import Chart from "react-apexcharts";

const series = [
{
      name: "Price",
      data: [30, 40, 45, 50, 49, 60, 70, 91]
}];


const SpecificCrypto = () => {
    const location = useLocation()
    const cryptoID = location.state.id; 

    const [cryptoPrices, setCryptoPrices] = useState([]);
    const [cryptoDatetime, setCryptoDatetime] = useState([]);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/coins/hoge-finance/market_chart?vs_currency=usd&days=30")
            .then((res) => res.json())
            .then((result) => processData(result));
    }, []);

    function processData(res) {
        let prices = res ["prices"];
        let values = new Array();
        let times = new Array();
        prices.map((item) => {
            values.push(item [1].toFixed(6));
            times.push(item [0]);
        })

        setCryptoPrices([{
            name: "Price",
            data: values
        }])

       
        setCryptoDatetime(times);
    }
    if(cryptoPrices.length === 0 || cryptoDatetime.length === 0)
        return (<React.Fragment />)

    return (
        <React.Fragment>
          <Chart
            type="line"
            width="80%"
            series={cryptoPrices}
            options={{
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    type: "datetime",
                    categories: cryptoDatetime,
                },
                tooltip: {
                    x: {
                        format: "dd MMM yyyy HH:mm",
                    }
                }
            }}
          >
          </Chart>
        </React.Fragment>
    );
}

export default SpecificCrypto


