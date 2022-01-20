import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { Navigate } from 'react-router-dom';
import './SpecificCrypto.css';
import "./../../App.css";
import { Grid    } from '@mui/material'
import { info } from './TestData.js';
import { useNavigate } from "react-router-dom";
import { address } from './../../assets/globalVar.js';

const getPreferencesUrl = `http://${address}:8080/getPreferences`;
const addPreferenceUrl = `http://${address}:8080/addPreference`;
const removePreferenceUrl = `http://${address}:8080/removePreference`;

let ispreferred;
const HeaderSection = (props) => {
    const [screenSize, setScreenSize] = useState(null);

    const [preferred, setPreferred] = useState([]);

    const optionsPreferences = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    }

    let optionsAddPreference = {
        method: 'PUT',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken,
        },
        body: {}
    }

    let optionsRemovePreference = {
        method: 'DELETE',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken,
        },
        body: {}
    }

    const addPreference = (ticker_) => {
        const body = {
            'ticker': ticker_
        }

        optionsAddPreference.body = JSON.stringify(body);

        fetch(addPreferenceUrl, optionsAddPreference)
            .then(res => parseResponse(res));
    }

    const removePreference = (ticker_) => {
        const body = {
            'ticker': ticker_
        }

        optionsRemovePreference.body = JSON.stringify(body);

        fetch(removePreferenceUrl, optionsRemovePreference)
            .then(res => parseResponse(res));
    }

    const parseResponse = res => {
        if(res.status === 200) {
            console.log("Preference added/removed successfully!");
        }
        else if(res.status === 5020) {
            console.log("Preference already existed")
        } else {
            res.json().then(result => console.log(result));
        }
    }

    useEffect(() => {
        if(props.accessToken === "")
            setPreferred([]);
        else{
            fetcherPreferences();
        }
    }, [props.accessToken]); 

    useEffect(() => {
        if(props.accessToken !== null && props.accessToken !== ""){
            console.log("Fetching preferences")
            fetcherPreferences();
        }
    }, []);

    const fetcherPreferences = () => {
        if(props.accessToken === null || props.accessToken === "")
            return;

        fetch(getPreferencesUrl, optionsPreferences)
        .then((res) => processPreferences(res));
    }

    const processPreferences = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => setPreferred(result.preferences),
                      (error) => console.log(error));
        }
        else if(res.status === 6001) {
            console.log("No preferences found");
        }
    }

    const cryptoData = props.data;

    const navigate = useNavigate();

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

    function getNormalFormat(value){
        if(value.toString().search("e") === -1)
            return value;
        
        return value.toFixed(value.toString().split('-')[1]);
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
                    <div className="container-title-price">
                        <div className='crypto-title' style={{marginLeft:'0px'}}>{getFormattedPrice(cryptoData.market_data.current_price.usd)}</div>
                        <p className={getChangeClass(cryptoData.market_data.price_change_percentage_24h)} style={{marginLeft:'10px'}}>{change(cryptoData.market_data.price_change_percentage_24h)}%</p>
                        <p className="p-crypto" style={{marginLeft:'15px'}}>24h</p>
                    </div>
                </ul>
                <ul>
                    <ul className="container-title">
                        <p className="p-crypto" style={{color:'#ABABAB', marginLeft:'18px', marginTop:'0px'}}>{getNormalFormat(cryptoData.market_data.current_price.btc)} BTC</p>
                        <p className={getChangeClassWithoutContainer(cryptoData.market_data.price_change_percentage_24h_in_currency.btc)} style={{marginLeft:'18px', marginTop:'0px'}}>{change(cryptoData.market_data.price_change_percentage_24h_in_currency.btc)}%</p>
                    </ul>
                </ul>
                <ul>
                    <ul className="container-title" style={{marginTop:'-20px'}}>
                        <p className="p-crypto" style={{color:'#ABABAB', marginLeft:'18px', marginTop:'0px'}}>{getNormalFormat(cryptoData.market_data.current_price.eth)} ETH</p>
                        <p className={getChangeClassWithoutContainer(cryptoData.market_data.price_change_percentage_24h_in_currency.eth)} style={{marginLeft:'18px', marginTop:'0px'}}>{change(cryptoData.market_data.price_change_percentage_24h_in_currency.eth)}%</p>
                    </ul>
                </ul>
            </div>
        )
    }

    function handleStar(){
        if(props.accessToken === ""){
            return navigate("/login");
        }

        if(ispreferred){
            removePreference(cryptoData.symbol);
            var array  = [...preferred].filter(item => item.id != cryptoData.symbol);
            setPreferred(array);
        }
        else{
            addPreference(cryptoData.symbol);
            var newPref = {id: cryptoData.symbol};
            var array = [...preferred];
            array.push(newPref);
            setPreferred(array);
        }
    }

    function isSupported(){
        let crypto = props.allCrypto.find(({ticker}) => ticker === cryptoData.symbol);
        
        if(crypto !== undefined){
            return true;
        }
        
        return false;        
    }

    function isPreferred(){
        if(props.accessToken === "" || props.accessToken === null)
            return false;
        
        let found = preferred.find(({id}) => id === cryptoData.symbol); 

        if(found !== undefined){
            ispreferred = true;
            return true;
        }

        ispreferred = false;
        return false;
    }

    function link(link_){
        if(link_.indexOf(".com") === -1)
            return link_;
            
        let link = link_.substring(0, link_.indexOf(".com")); //Cutting useless stuff after .com
        link += ".com";
        return link;
    }

    const MainDetailsSection = () => {
        return (
            <div className="container-header">
                <div>
                    <div className="container-title-test" style={{maxWidth:'80vh'}}>
                        {isSupported() && 
                            (
                                isPreferred() ? <img src={require("../../res/logos/star-checked.png")} width={36} height={36}  style={{paddingRight:'15px', cursor:'pointer'}} onClick={() => handleStar()} /> : 
                                                <img src={require("../../res/logos/star-unchecked.png")} width={36} height={36} style={{paddingRight:'15px', cursor:'pointer'}} onClick={() => handleStar()}/>
                            )
                        }
                        <img src={cryptoData.image.small} />
                        <div className='crypto-title'>{cryptoData.name}</div>
                        <p className='grey-container' style={{marginLeft:'10px'}}>{cryptoData.symbol.toUpperCase()}</p>
                        <p className="p-crypto" style={{marginLeft:'15px'}}>Rank #{cryptoData.market_cap_rank}</p>
                    </div>
                </div>
                <ul>
                    <ul className="container-title" style={{marginTop:'25px'}}>
                        <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                            <img src={require("../../res/logos/link.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                            <a href={link(cryptoData.links.homepage[0])}> <span className="list-title-crypto" style={{marginBottom:'2px'}}>{link(cryptoData.links.homepage[0])}</span> </a>
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
                    <Grid item xl={1} lg={2} md={2} sm={2} xs={1} /> 
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
                    <Grid item className="xs-spacer-crypto" sx={{display:'none'}} lg={0} md={0} sm={1} xs={1} />
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
                    <Grid item xl={1} lg={2} md={2} sm={2} xs={1} />
                </Grid>
            )
        }
    </React.Fragment>
    );
}

export default HeaderSection


