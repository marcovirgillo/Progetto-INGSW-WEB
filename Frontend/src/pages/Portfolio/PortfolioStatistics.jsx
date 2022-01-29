import React, { useEffect, useState } from 'react';

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

function getFormattedPrice(price) {
    if(price === undefined)
        return 0;

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

function formatPrice(price) {
    if(price === undefined)
        return "$ 0.0";
    
    if(price >= 0)
        return "+ " +  getFormattedPrice(price);
    else 
        return "- " + getFormattedPrice(price * -1);
}

const getClassName = (price) => {
    if(price >= 0)
        return "item-green";
    return "item-red"
}

export default function PortfolioStatistics(props) {
    const [topPerformers, setTopPerformers] = useState({});
    const [worstPerformers, setWorstPerformers] = useState({});
    const [totalProfit, setTotalProfit] = useState(0.0);

    useEffect(() => parseData(props.data), [props.data]);

    const parseData = (data) => {
        let totalProfit = 0;
        let posMax = 0;
        let posMin = 0;
        
        props.data.forEach((item, idx) => {
            totalProfit += item.profit_dollar;

            if(item.profit_dollar > data[posMax].profit_dollar)
                posMax = idx;

            if(item.profit_dollar < data[posMin].profit_dollar)
                posMin = idx;
        });

        setTopPerformers(data[posMax]);
        setWorstPerformers(data[posMin]);
        setTotalProfit(totalProfit);
    }

    if(topPerformers.profit_dollar === undefined)
        return (<React.Fragment />)
    
    return (
        <div className="portfolio-statistics">
            <ul className="statistics-list">
                <li className="statistics-list-item">
                    <p className="label">Total profit</p>
                    <p className={getClassName(totalProfit)}>{formatPrice(totalProfit)}</p>
                </li>
                <li className="statistics-list-item">
                    <p className="label">Best Performer</p>
                    <ul className="statistics-inner-list">
                        <img src={topPerformers.logo} width={34} height={34}></img>
                        <p className={getClassName(topPerformers.profit_dollar)}>
                            {formatPrice(topPerformers.profit_dollar)} 
                        </p>
                        <p className={getClassName(topPerformers.profit_dollar)}>
                            ({topPerformers.profit_percentage.toFixed(2)} %)
                        </p>
                    </ul>
                </li>
                <li className="statistics-list-item">
                    <p className="label">Worst Performer</p>
                    <ul className="statistics-inner-list">
                        <img src={worstPerformers.logo} width={34} height={34}></img>
                        <p className={getClassName(worstPerformers.profit_dollar)}>
                            {formatPrice(worstPerformers.profit_dollar)}
                        </p>
                        <p className={getClassName(worstPerformers.profit_dollar)}>
                            ({worstPerformers.profit_percentage.toFixed(2)} %)
                        </p>
                    </ul>
                </li>
            </ul>
        </div>
    )
}