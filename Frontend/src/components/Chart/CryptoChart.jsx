import React, { Component } from 'react'
import Chart from "react-apexcharts";

export default function CryptoChart(props) {
    const options = {
        xaxis: {
            type: "datetime",
            categories: props.timestamps,
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