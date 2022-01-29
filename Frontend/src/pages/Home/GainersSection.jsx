import React, { Component, useEffect, useState } from 'react'
import { Grid, Icon } from '@mui/material'
import { Link } from 'react-router-dom'
import "./Home.css"
import { address } from './../../assets/globalVar.js';

export default function GainersSection() {
    const [topPerformers, setTopPerformers] = useState([]);
    const [worstPerformers, setWorstPerformers] = useState([]);
    const [marketStats, setMarketStats] = useState([]);

    //Serve per fetchare da spring
    useEffect(() => {
        fetch(`http://${address}/topGainers`)
            .then(res => res.json())
            .then((result) => setTopPerformers(result),
                  (error) => console.log("Error fetching top gainers"));

        fetch(`http://${address}/worstPerformers`)
            .then(res => res.json())
            .then((result) => setWorstPerformers(result),
                  (error) => console.log("Error fetching worst performers"));

         fetch(`http://${address}/marketStats`)
        .then(res => res.json())
        .then((result) => setMarketStats(result),
            (error) => console.log("Error fetching market stats")); 
    }, []);

    function change(change) {
        if(change > 0){
            return "+" + change.toFixed(2);
        }
        
        return change.toFixed(2)  
    }

    return (
        <Grid container sx={{margin: '20px 0px 10px 0px'}} columnSpacing={{lg:5, md:2, sm:1, xs:2}} columns={{lg:20, md:17, sm:28, xs:7}}> {/* columnSpacing imposto lo spazio fra ogni colonna sulla base della larghezza dello schermo, columns suddivide la pagina in un numero di colonne specificato sempre sulla base della larghezza dello schermo */}
            <Grid item lg={1} md={1} sm={1} xs={1} /> {/* Grid item imposta un margine di 1 per ogni larghezza di schermo */}
            <Grid className="item" item lg={6} md={5} sm={12} xs={5}> {/* Top gainer card che occupa un numero di colonne specificato sulla base della larghezza dello schermo */}
                <div className="container stats">
                    <ul className="gainers-list">
                        <ul className="container-title">
                            <img src={require("../../res/logos/stats-icon.png")} width={32} height={32} className="container-title-icon" style={{marginRight:'20px', marginTop:'7px'}}/>
                            <div className="list-title">Market Statistics</div>
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
            <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} /> {/* Spaziatura per schermi più piccoli */}
            <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} />
            <Grid item className="item" lg={6} md={5} sm={12} xs={5}> {/* Worst gainers card che occupa un numero di colonne specificato sulla base della larghezza dello schermo */}
                <div className="container top-gainers">
                    <ul className="gainers-list">
                        <ul className="container-title">
                            <img src={require("../../res/logos/gainers-icon.png")} width={32} height={32} className="container-title-icon" style={{marginRight:'20px', marginTop:'7px'}}/>
                            <div className="list-title">Top Performers</div>
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
                                    <p className="list-change-green">{change(item.change_24h)}%</p>
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
                            <div className="list-title">Worst Performers</div>
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
                                    <p className="list-change-red">{change(item.change_24h)}%</p>
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