import React, { Component, useEffect, useState } from 'react'
import { Grid, Icon } from '@mui/material'
import { Link } from 'react-router-dom'
import { address } from './../../assets/globalVar.js';

const interval_fetch = 1000 * 120;

const getGainersUrl = `http://${address}:8080/gainersSection`;

export default function OverviewSection(props) {
    const [topPerformers, setTopPerformers] = useState([]);
    const [worstPerformers, setWorstPerformers] = useState([]);
    const [marketStats, setMarketStats] = useState([]); // cambiare per la sezione porfolio

    const optionsPreferences = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    }

    useEffect(() => {
        if(props.accessToken === "")
            setTopPerformers([]);
        else{
            fetcherGainers();
        }
    }, [props.accessToken]); 

    useEffect(() => {
        if(props.accessToken !== null || props.accessToken !== ""){
            fetcherGainers();

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

    return (
        <Grid container sx={{margin: '20px 0px 10px 0px'}} columnSpacing={{lg:5, md:2, sm:1, xs:2}} columns={{lg:20, md:17, sm:28, xs:7}}> 
            <Grid item lg={1} md={1} sm={1} xs={1} /> 
            <Grid className="item" item lg={6} md={5} sm={12} xs={5}> 
                <div className="container stats">
                    <ul style={{paddingLeft: '50px'}}>
                        <ul className="container-title">
                            <img src={require("../../res/logos/portfolio-dashboard.png")} width={32} height={32} className="container-title-icon" style={{marginRight:'20px', marginTop:'7px'}}/>
                            <div className="list-title">Your portfolio</div>
                            <div className="dashboard-spacer"></div>
                            <Link to="/portfolio"><div className="show-more-button">Show more</div></ Link>
                        </ul>
                        {
                            marketStats.map((item, val) => (
                                <ul key={val} className="list-item">
                                    <p className="list-name">{item.name}</p>
                                    <div className="spacer"> </div>
                                    <p className="list-stat">{item.value}</p>
                                </ul>
                            ))
                        }
                    </ul>
                </div>
            </Grid>
            <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} /> 
            <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} />
            <Grid item className="item" lg={6} md={5} sm={12} xs={5}> 
                <div className="container top-gainers">
                    <ul style={{paddingLeft: '50px'}}>
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
                                    <p className={setClassName(item.change)} >{change(item.change)}%</p>
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
                    <ul style={{paddingLeft: '50px'}}>
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
                                    <p className={setClassName(item.change)}>{change(item.change)}%</p>
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