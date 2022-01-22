import React, { Component } from 'react';
import Chart from 'react-apexcharts';

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

function getFormattedPrice(price) {
    if(price > 1)
        return formatter.format(price);
    else if(price === 0) {
        return "$" + 0.0;
    }
    else {
        var decimals = 0;
        var priceTmp = price;
        while(priceTmp < 1) {
            priceTmp *= 10;
            decimals++;
        }

        return "$" + price.toFixed(decimals + 2);
    }    
}

export default function PieChart(props) {
    const options = {
        chart: {
            type: 'donut',
        },
        labels: props.data.labels,
        dataLabels: {
            formatter: function(value) {
                return value.toFixed(2) + "%";
            }
        }, 
        plotOptions: {
            pie: {
                expandOnClick: false
            }
        },
        tooltip: {
            y: {
                formatter: function(value) {
                    return getFormattedPrice(value);
                }
            }
        },
        responsive: [{
            breakpoint: 800,
            options: {
                chart: {
                    width: '400px',
                    height: '240px'
                }
            }
        },
        {
            breakpoint: 600,
            options: {
                chart: {
                    width: '340px',
                    height: '200px'
                }
            }
        }]
    }

    return (
        <Chart 
            options={options}
            series={props.data.holdings}
            type="donut"
            width={props.width}
            height={props.height}
            >
        </Chart>
    )
}