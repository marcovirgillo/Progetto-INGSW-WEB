import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import './SpecificCrypto.css';
import "./../../App.css";
import { Grid    } from '@mui/material'
import { info } from './TestData.js';

const HeaderSection = () => {
    const [screenSize, setScreenSize] = useState(null);
    const [cryptoData, setCryptoData] = useState([]);

    const location = useLocation()
    const cryptoID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    const fetcher = () => {
        fetch(`https://api.coingecko.com/api/v3/coins/${cryptoID}`)
        .then((res) => res.json())
        .then((result) => setCryptoData(result),
        (error) => alert("Error fetching crypto"));
    }

    useEffect(() => {
        fetcher();
    }, []);

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

    const cryptoDataSize = () => {
        return cryptoData.length !== 0;
    }

    const CommunitySection = () => {
        return (
            <div className='community-info-container'>
                 <ul>
                     <p className="p-crypto" style={{color:'#ABABAB'}}>Community</p>
                     <ul className="container-title" style={{marginTop:'20px'}}>
                         <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                             <img src={require("../../res/logos/twitter.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                             <a href={`https://twitter.com/${cryptoData.links.twitter_screen_name}`}> <span className="list-title-crypto" style={{marginBottom:'2px'}}>Twitter</span> </a>
                         </p>
                     </ul>
                 </ul>
                 <ul>
                     <ul className="container-title" style={{marginTop:'15px'}}>
                         <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                             <img src={require("../../res/logos/telegram.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                             <a href={`https://t.me/${cryptoData.links.telegram_channel_identifier}`}> <span className="list-title-crypto" style={{marginBottom:'2px'}}>Telegram</span> </a>
                         </p>
                     </ul>
                 </ul>
                 <ul>
                     <ul className="container-title" style={{marginTop:'15px'}}>
                         <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                             <img src={require("../../res/logos/reddit.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                             <a href={cryptoData.links.subreddit_url}> <span className="list-title-crypto" style={{marginBottom:'2px'}}>Reddit</span> </a>
                         </p>
                     </ul>
                 </ul>
            </div>
        )
    }

    const PriceDataSection = () => {
        return (
            <div className='prices-info-container'>
                <ul>
                    <p className="p-crypto" style={{color:'#ABABAB'}}>{cryptoData.name} {cryptoData.symbol.toUpperCase()} Price</p>
                    <ul className="container-title">
                        <div className='crypto-title'>{getFormattedPrice(cryptoData.market_data.current_price.usd)}</div>
                        <p className={getChangeClass(cryptoData.market_data.price_change_percentage_24h)} style={{marginLeft:'10px'}}>{change(cryptoData.market_data.price_change_percentage_24h)}%</p>
                        <p className="p-crypto" style={{marginLeft:'15px'}}>24h</p>
                    </ul>
                </ul>
                <ul>
                    <ul className="container-title">
                        <p className="p-crypto" style={{color:'#ABABAB', marginLeft:'18px', marginTop:'0px'}}>{cryptoData.market_data.current_price.btc} BTC</p>
                        <p className={getChangeClassWithoutContainer(cryptoData.market_data.price_change_percentage_24h_in_currency.btc)} style={{marginLeft:'18px', marginTop:'0px'}}>{change(cryptoData.market_data.price_change_percentage_24h_in_currency.btc)}%</p>
                    </ul>
                </ul>
                <ul>
                    <ul className="container-title" style={{marginTop:'-20px'}}>
                        <p className="p-crypto" style={{color:'#ABABAB', marginLeft:'18px', marginTop:'0px'}}>{cryptoData.market_data.current_price.eth} ETH</p>
                        <p className={getChangeClassWithoutContainer(cryptoData.market_data.price_change_percentage_24h_in_currency.eth)} style={{marginLeft:'18px', marginTop:'0px'}}>{change(cryptoData.market_data.price_change_percentage_24h_in_currency.eth)}%</p>
                    </ul>
                </ul>
            </div>
        )
    }

    const MainDetailsSection = () => {
        return (
            <div className="container-header">
                <ul>
                    <ul className="container-title">
                        <img src={cryptoData.image.small} />
                        <div className='crypto-title'>{cryptoData.name}</div>
                        <p className='grey-container' style={{marginLeft:'10px'}}>{cryptoData.symbol.toUpperCase()}</p>
                        <p className="p-crypto" style={{marginLeft:'15px'}}>{screenSize>600 ? 'Rank' : ''} #{cryptoData.market_cap_rank}</p>
                    </ul>
                </ul>
                <ul>
                    <ul className="container-title" style={{marginTop:'25px'}}>
                        <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                            <img src={require("../../res/logos/link.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                            <a href={cryptoData.links.homepage[0]}> <span className="list-title-crypto" style={{marginBottom:'2px'}}>{cryptoData.links.homepage[0]}</span> </a>
                        </p>
                    
                    </ul>
                </ul>
                <ul>
                    <ul className="container-title" style={{marginTop:'10px'}}>
                    <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                            <img src={require("../../res/logos/explore.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                            <a href={cryptoData.links.blockchain_site[0]}> <span className="list-title-crypto" style={{marginBottom:'2px'}}>Explorer</span> </a>
                        </p>
                        <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                            <img src={require("../../res/logos/github.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                            <a href={cryptoData.links.repos_url.github[0]}> <span className="list-title-crypto" style={{marginBottom:'2px'}}>GitHub</span> </a>
                        </p>
                    </ul>
                </ul>
            </div>
        )
    }

    return (
        <React.Fragment>
        {
            cryptoDataSize() && (
                <Grid container columnSpacing={{xl:5, lg:5, md:2, sm:1, xs:2}} columns={{xl:20, lg:28, md:28, sm:28, xs:7}} > 
                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} /> 
                    <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5}> 
                        <MainDetailsSection />
                    </Grid>
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1}  xs={1}/> {/* Spaziatura per schermi più piccoli */}
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1}  />
                    <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5}> 
                    {
                        screenSize<600 ? <CommunitySection /> : <PriceDataSection />
                    }
                    </Grid>
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1} xs={1} />
                    {
                        screenSize >= 600 && (
                            <Grid item className="xs-spacer-crypto" sx={{display:'none'}} sm={1} xs={1} />
                        )
                    }
                    <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5}> 
                    
                    {
                        screenSize<600 ? <PriceDataSection /> : <CommunitySection />
                    }
                    </Grid>
                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} />
                </Grid>
            )
        }
    </React.Fragment>
    );
}

export default HeaderSection


