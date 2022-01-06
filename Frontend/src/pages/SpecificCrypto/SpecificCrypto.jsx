import React, { useEffect, useState } from 'react'
import './SpecificCrypto.css';
import "./../../App.css";
import { Grid    } from '@mui/material'
import ChartSection from './ChartSection'

import { info } from './TestData.js';

const SpecificCrypto = () => {
    const [screenSize, setScreenSize] = useState(null);

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    });

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});

    function getFormattedPrice(price) {
        if(price > 1)
            return formatter.format(price);
        else 
            return "$" + price;
    }

    function getChangeClass(change){
        if(change>=0)
            return "green-container";
        return "red-container";
    }

    function getChangeClassWithoutContainer(change){
        if(change>=0)
            return "p-crypto-green";
        return "p-crypto-red";
    }

    function change(change) {
        if(change > 0){
            return "+" + change.toFixed(2);
        }
        
        return change.toFixed(2);
    }

    console.log("RENDER")

    return (
        <div className="specific-crypto">
            <div className="paper-grey">
                <div style={{paddingTop:'20px'}}/>
                <Grid container columnSpacing={{xl:5, lg:5, md:2, sm:1, xs:2}} columns={{xl:20, lg:28, md:28, sm:7, xs:7}} style={{marginLeft:'7px'}}> 
                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} /> 
                    <Grid className="item" item xl={6} lg={12} md={12} sm={5} xs={5}> 
                        <div className="container-header">
                            <ul>
                                <ul className="container-title">
                                    <img src={info.image.small} />
                                    <div className='crypto-title'>{info.name}</div>
                                    <p className='grey-container' style={{marginLeft:'10px'}}>{info.symbol.toUpperCase()}</p>
                                    <p className="p-crypto" style={{marginLeft:'15px'}}>{screenSize>600 ? 'Rank' : ''} #{info.market_cap_rank}</p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'25px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/link.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>{info.links.homepage[0]}</div>
                                    </p>
                                   
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'10px'}}>
                                <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/explore.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Explorers</div>
                                    </p>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/github.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>GitHub</div>
                                    </p>
                                </ul>
                            </ul>
                        </div>
                    </Grid>
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1}  xs={1}/> {/* Spaziatura per schermi più piccoli */}
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1}  />
                    <Grid className="item" item xl={6} lg={12} md={12} sm={5} xs={5}> 
                        <div className='prices-info-container'>
                            <ul>
                                <p className="p-crypto" style={{color:'#ABABAB'}}>{info.name} {info.symbol.toUpperCase()} Price</p>
                                <ul className="container-title">
                                    <div className='crypto-title'>{getFormattedPrice(info.current_price.usd)}</div>
                                    <p className={getChangeClass(info.price_change_percentage_24h)} style={{marginLeft:'10px'}}>{change(info.price_change_percentage_24h)}%</p>
                                    <p className="p-crypto" style={{marginLeft:'15px'}}>24h</p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title">
                                    <p className="p-crypto" style={{color:'#ABABAB', marginLeft:'18px', marginTop:'0px'}}>{info.current_price.btc} BTC</p>
                                    <p className={getChangeClassWithoutContainer(info.price_change_percentage_24h_in_currency.btc)} style={{marginLeft:'18px', marginTop:'0px'}}>{change(info.price_change_percentage_24h_in_currency.btc)}%</p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'-20px'}}>
                                    <p className="p-crypto" style={{color:'#ABABAB', marginLeft:'18px', marginTop:'0px'}}>{info.current_price.eth} ETH</p>
                                    <p className={getChangeClassWithoutContainer(info.price_change_percentage_24h_in_currency.eth)} style={{marginLeft:'18px', marginTop:'0px'}}>{change(info.price_change_percentage_24h_in_currency.eth)}%</p>
                                </ul>
                            </ul>
                        </div>
                    </Grid>
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1} xs={1} />
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1} xs={1} /> {/* md={8}  TO CENTER BOTTOM ONE*/}
                    <Grid className="item" item xl={6} lg={12} md={12} sm={5} xs={5}> 
                    <div className='community-info-container'>
                            <ul>
                                <p className="p-crypto" style={{color:'#ABABAB'}}>Community</p>
                                <ul className="container-title" style={{marginTop:'20px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/twitter.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Twitter</div>
                                    </p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'15px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/telegram.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Telegram</div>
                                    </p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'15px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/reddit.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Reddit</div>
                                    </p>
                                </ul>
                            </ul>
                        </div>
                    </Grid>
                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} />
                </Grid>
                <div style={{paddingTop:'20px'}}/>
                <ChartSection />
            </div>
            
        </div>
    );
}

export default SpecificCrypto


