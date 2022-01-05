import React, { useEffect, useState } from 'react'
import './SpecificCrypto.css';
import "./../../App.css";
import { Grid    } from '@mui/material'
import ChartSection from './ChartSection'

import { info } from './TestData.js';

const SpecificCrypto = () => {

    console.log("RENDER")

    return (
        <div className="specific-crypto">
            <div className="paper-grey">
                <div style={{paddingTop:'20px'}}/>
                <Grid container columnSpacing={{xl:5, lg:5, md:2, sm:1, xs:2}} columns={{xl:20, lg:28, md:28, sm:7, xs:7}}> 
                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} /> 
                    <Grid className="item" item xl={6} lg={12} md={12} sm={5} xs={5}> 
                        <div className="container-header-left">
                            <ul>
                                <ul className="container-title">
                                    <img src={info.image.small} />
                                    <div className='crypto-title'>{info.name}</div>
                                    <p className='grey-container' style={{marginLeft:'10px'}}>{info.symbol.toUpperCase()}</p>
                                    <p className="p-crypto" style={{marginLeft:'15px'}}>Rank #{info.market_cap_rank}</p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'25px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/link.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>{info.links.homepage[0]}</div>
                                    </p>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/explore.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Explorers</div>
                                    </p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'10px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/github.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>GitHub</div>
                                    </p>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/chat.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Chat</div>
                                    </p>
                                </ul>
                            </ul>
                        </div>
                    </Grid>
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1} xs={1} /> {/* Spaziatura per schermi più piccoli */}
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1} xs={1} />
                    <Grid className="item" item xl={6} lg={12} md={12} sm={5} xs={5}> 
                    <div className="container-header-left">
                            <ul>
                                <ul className="container-title">
                                    <img src={info.image.small} />
                                    <div className='crypto-title'>{info.name}</div>
                                    <p className='grey-container' style={{marginLeft:'10px'}}>{info.symbol.toUpperCase()}</p>
                                    <p className="p-crypto" style={{marginLeft:'15px'}}>Rank #{info.market_cap_rank}</p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'25px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/link.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>{info.links.homepage[0]}</div>
                                    </p>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/explore.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Explorers</div>
                                    </p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'10px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/github.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>GitHub</div>
                                    </p>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/chat.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Chat</div>
                                    </p>
                                </ul>
                            </ul>
                        </div>
                    </Grid>
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1} xs={1} />
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1} xs={1} /> {/* md={8}  TO CENTER BOTTOM ONE*/}
                    <Grid className="item" item xl={6} lg={12} md={12} sm={5} xs={5}> 
                    <div className="container-header-left">
                            <ul>
                                <ul className="container-title">
                                    <img src={info.image.small} />
                                    <div className='crypto-title'>{info.name}</div>
                                    <p className='grey-container' style={{marginLeft:'10px'}}>{info.symbol.toUpperCase()}</p>
                                    <p className="p-crypto" style={{marginLeft:'15px'}}>Rank #{info.market_cap_rank}</p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'25px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/link.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>{info.links.homepage[0]}</div>
                                    </p>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/explore.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Explorers</div>
                                    </p>
                                </ul>
                            </ul>
                            <ul>
                                <ul className="container-title" style={{marginTop:'10px'}}>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/github.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>GitHub</div>
                                    </p>
                                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                                        <img src={require("../../res/logos/chat.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                                        <div className="list-title-crypto" style={{marginBottom:'2px'}}>Chat</div>
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


