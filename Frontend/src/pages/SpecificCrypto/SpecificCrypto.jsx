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
    const [options, setOptions] = useState({
       
    });

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7")
            .then((res) => res.json())
            .then((result) => processData(result));
    }, []);

    function processData(res) {
        let prices = res ["prices"];
        let values = new Array();
        let times = new Array();
        prices.map((item) => {
            values.push(item [1]);
            times.push(new Date(item [0]).toLocaleString());
        })

        setCryptoPrices([{
            name: "Price",
            data: values
        }])

        setOptions({
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                type: "datetime",
                categories: times,
            },
        })
    }

    return (
        <React.Fragment>
          <Chart
            type="line"
            width="500"
            series={cryptoPrices}
            options={options}
          >
          </Chart>
        </React.Fragment>
    );
}

export default SpecificCrypto


