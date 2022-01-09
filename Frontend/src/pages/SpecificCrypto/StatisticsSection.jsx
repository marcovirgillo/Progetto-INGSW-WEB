import React, { useEffect, useState } from 'react'
import './SpecificCrypto.css';
import "./../../App.css";
import { Grid } from '@mui/material'
import { useLocation } from 'react-router';

const StatisticsSection = (props) => {
    const [screenSize, setScreenSize] = useState(null);
    const [volume24hData, setVolume24hData] = useState([]);

    const cryptoData = props.data;

    const location = useLocation()
    const cryptoID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);


    const volumeFetcher = () => {
        fetch(`https://api.coingecko.com/api/v3/coins/${cryptoID}/market_chart?vs_currency=usd&days=1`)
        .then((res) => res.json())
        .then((result) => setVolume24hData(result.total_volumes),
        (error) => console.log("Error fetching 24h volume"));
    }

    useEffect(() => {
        volumeFetcher();
    }, [cryptoID]);

    useEffect(() => {
        volumeFetcher();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    });

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'});
    const normalFormatter = new Intl.NumberFormat('en-US');

    function twoByTwoGrid() {
        return screenSize > 600 && screenSize <= 1536;
    }

    function mobileGrid() {
        return screenSize <= 600;
    }

    function setStyleContainer(position){
        if(screenSize > 600 && screenSize <= 1536){
            if(position==="left" || position==="first-left")
                return {borderTopLeftRadius:'15px', borderBottomLeftRadius: '15px', borderRight:'2px solid #333333'};
            else if(position==="right" || position==="last-right")
                return {borderTopRightRadius:'15px', borderBottomRightRadius: '15px'};
        }
        if(screenSize <= 600)
            return {borderRadius:'15px'};
        if(position==="first-left")
            return {borderTopLeftRadius:'15px', borderBottomLeftRadius: '15px', borderRight:'2px solid #333333'};
        if(position==="last-right")
            return {borderTopRightRadius:'15px', borderBottomRightRadius: '15px'};
        if(position==="right")
            return {borderRight:'2px solid #333333'};
        if(position==="left")
            return {borderRight:'2px solid #333333'};
    }

    function getFormattedPrice(price) {
        if(price > 1)
            return formatter.format(price);
        else 
            return "$" + price;
    }

    function change(change) {
        if(change > 0){
            return "+" + change.toFixed(2);
        }
        
        return change.toFixed(2);
    }

    const cryptoDataSize = () => {
        return cryptoData.length !== 0 && volume24hData.length !==0;
    }

    function getChangeClass(change){
        if(change>=0)
            return "green-container";
        return "red-container";
    }
    
    function getVolumeChange(){
        let yesterdayVol = volume24hData[0][1];
        let dim = volume24hData.length -1;
        let todayVol = volume24hData[dim][1];
        
        let change = 100 - ((yesterdayVol * 100) / todayVol);

        return change;
    }

    const MarketCap = () => {
        return (
            <div className="crypto-main-stats-4x" style={setStyleContainer("first-left")}>
                <div className="crypto-main-container-title">Market cap</div>
                <div className='crypto-main-container-value' style={{marginTop:'10px'}}>{getFormattedPrice(cryptoData.market_data.market_cap.usd)}</div>
                <div className='crypto-main-container-change' style={{marginTop:'15px'}}>
                    <span className={getChangeClass(cryptoData.market_data.market_cap_change_percentage_24h)} style={{marginLeft:'10px'}}>{change(cryptoData.market_data.market_cap_change_percentage_24h)}%</span>
                </div>
            </div>
        )
    }

    const ATH = () => {
        return (
            <div className="crypto-main-stats-4x" style={setStyleContainer("right")}>
                <div className="crypto-main-container-title">All Time High & Difference</div>
                <div className='crypto-main-container-value' style={{marginTop:'10px'}}>{getFormattedPrice(cryptoData.market_data.ath.usd)}</div>
                <div className='crypto-main-container-change' style={{marginTop:'15px'}}>
                    <span className={getChangeClass(cryptoData.market_data.ath_change_percentage.usd)} style={{marginLeft:'10px'}}>{change(cryptoData.market_data.ath_change_percentage.usd)}%</span>
                </div>
            </div>
        )
    }

    const Volume24h = () =>{
        return (
            <div className="crypto-main-stats-4x" style={setStyleContainer("left")}>
                <div className="crypto-main-container-title">Volume 24h</div>
                <div className='crypto-main-container-value' style={{marginTop:'10px'}}>{getFormattedPrice(cryptoData.market_data.total_volume.usd)}</div>
                <div className='crypto-main-container-change' style={{marginTop:'15px'}}>
                    <span className={getChangeClass(getVolumeChange())} style={{marginLeft:'10px'}}>{change(getVolumeChange())}%</span>
                </div>
            </div>
        )
    }

    const CirculatingSupply = () => {
        return(
            <div className="crypto-main-stats-4x"  style={setStyleContainer("last-right")}>
                <div className="crypto-main-container-title">Circulating supply</div>
                <div className='crypto-main-container-value' style={{marginTop:'10px'}}>{normalFormatter.format(cryptoData.market_data.circulating_supply)}</div>
                <div className='crypto-main-container-change' style={{marginTop:'15px'}}>
                    <span className="grey-container" style={{marginLeft:'10px'}}>{cryptoData.symbol.toUpperCase()}</span>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
        {
        cryptoDataSize() && (
            <Grid container columnSpacing={{xl:5, lg:5, md:2, sm:1, xs:2}} columns={{xl:28, lg:28, md:28, sm:28, xs:7}} > 
                <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5} style={{paddingLeft:'0px', paddingRight:'0px'}}> 
                   <MarketCap />
                </Grid>
                {mobileGrid() && (
                        <>
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                        </>
                    )
                }   
                <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5} style={{paddingLeft:'0px', paddingRight:'0px'}}> 
                    <ATH />
                </Grid>
                {twoByTwoGrid() && (
                        <>
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                        </>
                    )
                }
                {mobileGrid() && (
                        <>
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                        </>
                    )
                }   
                <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5} style={{paddingLeft:'0px', paddingRight:'0px'}}> 
                    <Volume24h />
                </Grid>
                {mobileGrid() && (
                        <>
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                            <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                        </>
                    )
                }   
                <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5} style={{paddingLeft:'0px', paddingRight:'0px'}}> 
                    <CirculatingSupply />
                </Grid>
            </Grid>
            )
        }
        </React.Fragment>
    );
}

export default StatisticsSection


