import React, { Component } from 'react'
import Chart from "react-apexcharts";

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

function getFormattedPrice(price) {
    if(price > 1)
        return formatter.format(price);
    else 
        return "$" + price;
}

export default function CryptoChart(props) {
    const format = (value) => {
        if(value >= Math.pow(10,3) && value < Math.pow(10,6))
            return value / Math.pow(10,3) + " K";

        if(value >= Math.pow(10,6) && value < Math.pow(10,9))
            return value / Math.pow(10,6) + " M";

        if(value >= Math.pow(10,9) && value < Math.pow(10,12))
            return value / Math.pow(10,9) + " B";

        if(value >= Math.pow(10,12) && value < Math.pow(10,15))
            return value / Math.pow(10,12) + " T";

        return value;
    }

    const options = {
        xaxis: {
            type: "datetime",
            categories: props.timestamps,
        },
        yaxis: {
            labels: {
                formatter: (value) => format(value),
            },
        },
        tooltip: {
            x: {
                format: "dd MMM yyyy HH:mm",
            } ,
            y: {
                formatter: function(value, series) {
                    return getFormattedPrice(value);
                }
              }
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                type: "vertical",
                opacityTo: 0,
                stops: [60, 100]
            },
        }, 
        stroke: {
            curve: 'smooth',
            width: 2
        },
        colors: [props.color]
    }

    return (
        <Chart 
            options={options}
            series={props.data}
            type="area"
            width={props.width}
            height={props.height}
            >
        </Chart>
    )
}