import React from 'react'
import { Grid, Icon } from '@mui/material'
import "./Home.css"
import "./../../App.css"
import { TopGainers, WorstGainers } from "./TestData.js"
import CriptoTable from './CriptoTable'

const Home = () => {
    return (
        <div className="home-page">
            <div className="paper-grey">
                <Grid container columnSpacing={{lg:5, md:2, sm:1, xs:2}} columns={{lg:20, md:17, sm:28, xs:7}}> {/* columnSpacing imposto lo spazio fra ogni colonna sulla base della larghezza dello schermo, columns suddivide la pagina in un numero di colonne specificato sempre sulla base della larghezza dello schermo */}
                    <Grid item lg={1} md={1} sm={1} xs={1} /> {/* Grid item imposta un margine di 1 per ogni larghezza di schermo */}
                    <Grid className="item" item lg={6} md={5} sm={12} xs={5}> {/* Top gainer card che occupa un numero di colonne specificato sulla base della larghezza dello schermo */}
                        <div className="container top-gainers">
                            <ul style={{paddingTop: '2px'}}>
                                <p className="list-title">Top Gainers </p>

                                {
                                    TopGainers.map((item, val) => (
                                        <ul key={val} className="list-item">
                                            <p className="list-number">{val+1}</p>
                                            <Icon> <img src={item.img} width={18} height={18}/> </Icon>
                                            <p className="list-name">{item.name}</p>
                                            <p className="list-ticker">{item.ticker}</p>
                                            <div className="spacer"> </div>
                                            <p className="list-change-green">+ {item.change}</p>
                                        </ul>
                                    ))
                                }
                            </ul>
                        </div>
                    </Grid>
                    <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} /> {/* Spaziatura per schermi più piccoli */}
                    <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} />
                    <Grid item className="item" lg={6} md={5} sm={12} xs={5}> {/* Worst gainers card che occupa un numero di colonne specificato sulla base della larghezza dello schermo */}
                        <div className="container worst-gainers">
                            <ul style={{paddingTop: '2px'}}>
                                <p className="list-title">Worst Gainers </p>

                                {
                                    WorstGainers.map((item, val) => (
                                        <ul key={val} className="list-item">
                                            <p className="list-number">{val+1}</p>
                                            <Icon> <img src={item.img} width={18} height={18}/> </Icon>
                                            <p className="list-name">{item.name}</p>
                                            <p className="list-ticker">{item.ticker}</p>
                                            <div className="spacer"> </div>
                                            <p className="list-change-red"> {item.change}</p>
                                        </ul>
                                    ))
                                }
                            </ul>
                        </div>
                    </Grid>
                    <Grid item className="xs-spacer" sx={{display:'none'}} sm={1} xs={1} />
                    <Grid item className="xs-spacer" sx={{display:'none'}} sm={6} xs={1} />
                    <Grid className="item" item lg={6} md={5} sm={15} xs={5}>
                        <div style={{backgroundColor: 'yellow', borderRadius: '10px', width:'100%', height:'100%'}}>
                            <ul>
                                Top Gainers
                            </ul>
                        </div>
                    </Grid>
                    <Grid item lg={1} md={1} sm={6} xs={1} />
                </Grid>
                <CriptoTable /> {/* Tabella all criptos */}
            </div>
        </div>


    )
}

export default Home;
