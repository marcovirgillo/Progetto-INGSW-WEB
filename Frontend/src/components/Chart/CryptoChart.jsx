import React, { Component } from 'react'
import Chart from "react-apexcharts";

export default function CryptoChart(props) {
    const format = (value) => {
        if(value >= Math.pow(10,3) && value < Math.pow(10,6))
            return value / Math.pow(10,3) + " K";
        else if(value >= Math.pow(10,6) && value < Math.pow(10,9))
            return value / Math.pow(10,6) + " M";
        else if(value >= Math.pow(10,9) && value < Math.pow(10,12))
            return value / Math.pow(10,9) + " B";
        else return value;
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