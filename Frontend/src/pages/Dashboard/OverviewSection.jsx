import React, { Component, useEffect, useState } from 'react'
import { Grid, Icon } from '@mui/material'
import { Link } from 'react-router-dom'
import { address } from './../../assets/globalVar.js';

const interval_fetch = 1000 * 120;

const getGainersUrl = `http://${address}:8080/gainersSection`;
const portfolioStatsUrl = `http://${address}:8080/portfolioOverview`;

export default function OverviewSection(props) {
    const [topPerformers, setTopPerformers] = useState([]);
    const [worstPerformers, setWorstPerformers] = useState([]);
    const [portfolioStats, setPortfolioStats] = useState({"balance_change_24h_percentage": 0,
    "balance": 0,
    "balance_change_btc": 0,
    "balance_change_24h": 0});

    const optionsPreferences = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    }

    useEffect(() => {
        if(props.accessToken === "") {
            setTopPerformers([]);
            setPortfolioStats([]);
        }
        else{
            fetcherGainers();
            fetcherPortfolioStats();
        }
    }, [props.accessToken]); 

    useEffect(() => {
        if(props.accessToken !== null || props.accessToken !== ""){
            fetcherGainers();
            fetcherPortfolioStats();

        }
    }, []);

    const fetcherGainers = () => {
        if(props.accessToken === null || props.accessToken === "")
            return;

        fetch(getGainersUrl, optionsPreferences)
        .then((res) => processGainers(res));
    }

    const processGainers = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => {
                    setTopPerformers(result.preferences_top_gainers);
                    setWorstPerformers(result.preferences_worst_performer);
                    },
                      (error) => console.log(error));
        }
        else if(res.status === 6001) {
            console.log("No gainers found");
        }
    }

    const fetcherPortfolioStats = () => {
        if(props.accessToken === null || props.accessToken === "")
            return;

        fetch(portfolioStatsUrl, optionsPreferences)
        .then((res) => processPortfolioStats(res));
    }

    const processPortfolioStats = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => {
                    setPortfolioStats(result);
                    },
                      (error) => console.log(error));
        }
        else if(res.status === 6001) {
            console.log("No portfolio stats");
        }
    }

    function change(change) {
        if(change > 0){
            return "+" + change.toFixed(2);
        }
        
        return change.toFixed(2)
    }

    function setClassName(change) {
        if (change > 0) {
            return "list-change-green"
        }
        return "list-change-red"
    }

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

    function lowerFormat(change) {
        return "$" + change.toFixed(6);
    }

    return (
        <Grid container sx={{margin: '20px 0px 10px 0px'}} columnSpacing={{lg:5, md:2, sm:1, xs:2}} columns={{lg:20, md:17, sm:28, xs:7}}> 
            <Grid item lg={1} md={1} sm={1} xs={1} /> 
            <Grid className="item" item lg={6} md={5} sm={12} xs={5}> 
                <div className="container stats">
                    <ul className="gainers-list">
                        <ul className="container-title">
                            <img src={require("../../res/logos/portfolio-dashboard.png")} width={32} height={32} className="container-title-icon" style={{marginRight:'20px', marginTop:'7px'}}/>
                            <div className="list-title">Your portfolio</div>
                            <div className="dashboard-spacer"></div>
                            <Link to="/portfolio"><div className="show-more-button">Show more</div></ Link>
                        </ul>
                        {
                        <React.Fragment>
                            <ul className="list-item">
                                <p className="list-name">24h Change</p>
                                <div className="spacer"> </div>
                                <p className={setClassName(portfolioStats.balance_change_24h_percentage)}>{change(portfolioStats.balance_change_24h_percentage)}%</p>
                            </ul>
                            <ul className="list-item">
                                <p className="list-name">24h BTC Change</p>
                                <div className="spacer"> </div>
                                <p className={setClassName(portfolioStats.balance_change_btc)}>{change(portfolioStats.balance_change_btc)}%</p>
                            </ul>
                            <ul className="list-item">
                                <p className="list-name">Value</p>
                                <div className="spacer"> </div>
                                <p className="list-stat">{portfolioStats.balance < 1 ? lowerFormat(portfolioStats.balance) : formatter.format(portfolioStats.balance)}</p>
                            </ul>
                        </React.Fragment>
                        }
                    </ul>
                </div>
            </Grid>
            <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} /> 
            <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} />
            <Grid item className="item" lg={6} md={5} sm={12} xs={5}> 
                <div className="container top-gainers">
                    <ul className="gainers-list">
                        <ul className="container-title">
                            <img src={require("../../res/logos/gainers-icon.png")} width={32} height={32} className="container-title-icon" style={{marginRight:'20px', marginTop:'7px'}}/>
                            <div className="list-title">Top Favourite Performers</div>
                        </ul>
                        {
                            topPerformers.map((item, val) => (
                                <ul key={val} className="list-item">
                                    <p className="list-number">{val+1}</p>
                                    <Link to={`/crypto/${item.id}`} style={{display:'flex', flexDirection:'row', alignItems: 'center'}} >
                                        <Icon sx={{width:18, height:18, fontSize:'1em'}}> 
                                            <img src={item.logo} width={18} height={18}/> 
                                        </Icon>
                                        <p className="list-name">{item.name}</p>
                                        <p className="list-ticker">{item.ticker.toUpperCase()}</p>
                                    </Link>
                                    <div className="spacer"> </div>
                                    <p className={setClassName(item.change_24h)} >{change(item.change_24h)}%</p>
                                </ul>
                            ))
                        }
                    </ul>
                </div>
            </Grid>
            <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} />
            <Grid item className="xs-spacer" sx={{display:'none'}} sm={6} xs={1} />
            <Grid className="item" item lg={6} md={5} sm={15} xs={5}>
                <div className="container worst-gainers">
                    <ul className="gainers-list">
                        <ul className="container-title">
                            <img src={require("../../res/logos/losers-icon.png")} width={32} height={32} className="container-title-icon" style={{marginRight:'20px', marginTop:'7px'}}/>
                            <div className="list-title">Worst Favourite Performers</div>
                        </ul>
                        {
                            worstPerformers.map((item, val) => (
                                <ul key={5 + val} className="list-item">
                                    <p className="list-number">{val+1}</p>
                                    <Link to={`/crypto/${item.id}`} style={{display:'flex', flexDirection:'row', alignItems: 'center'}} >
                                        <Icon sx={{width:18, height:18, fontSize:'1em'}}> <img src={item.logo} width={18} height={18}/> </Icon>
                                        <p className="list-name">{item.name}</p>
                                        <p className="list-ticker">{item.ticker.toUpperCase()}</p>
                                    </Link>
                                    <div className="spacer"> </div>
                                    <p className={setClassName(item.change_24h)}>{change(item.change_24h)}%</p>
                                </ul>
                            ))
                        }
                    </ul>
                </div>
            </Grid>
            <Grid item lg={1} md={1} sm={6} xs={1} />
        </Grid>
    )
}