import { FOCUSABLE_SELECTOR } from '@testing-library/user-event/dist/utils';
import React, { Component } from 'react'
import Chart from "react-apexcharts";

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

function getFormattedPrice(price) {
    if(price > 1)
        return formatter.format(price);
    else {
        if(price === 0)
            return "$" + 0.0;

        return "$" + price.toFixed(getDecimalPlaces(price) + 2);
    }
}

const getDecimalPlaces = (number) => {
    let decimal = 0;
    while(number < 1) {
        decimal++;
        number *= 10;
    }

    return decimal;
}

export default function CryptoChart(props) {
    const format = (value) => {
        if(value === 0)
            return 0.0;

        if(value >= Math.pow(10,3) && value < Math.pow(10,6))
            return value / Math.pow(10,3) + " K";

        if(value >= Math.pow(10,6) && value < Math.pow(10,9))
            return value / Math.pow(10,6) + " M";

        if(value >= Math.pow(10,9) && value < Math.pow(10,12))
            return value / Math.pow(10,9) + " B";

        if(value >= Math.pow(10,12) && value < Math.pow(10,15))
            return value / Math.pow(10,12) + " T";

        if(value < 1){
            return value.toFixed(getDecimalPlaces(value) + 2);
        }

        return value.toFixed(2);
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
        grid: {  
            xaxis: {
              lines: {
                show: false  
               }
             },  
            yaxis: {
              lines: { 
                show: props.showYlines  
               }
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