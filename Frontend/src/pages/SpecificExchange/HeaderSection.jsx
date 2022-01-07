import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { Grid    } from '@mui/material'

const HeaderSection = () => {
    const [screenSize, setScreenSize] = useState(null);
    const [exchangeData, setExchangeData] = useState([]);

    const location = useLocation()
    const exchangeID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    const fetcher = () => {
        console.log(exchangeID);
        fetch(`https://api.coingecko.com/api/v3/exchanges/${exchangeID}`)
        .then((res) => res.json())
        .then((result) => setExchangeData(result),
        (error) => alert("Error fetching exchange"));
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

    const exchangeDataSize = () => {
        return exchangeData.length !== 0;
    }

    const MainDetailsSection = () => {
        return (
            <div className="container-header">
                <ul>
                    <ul className="container-title">
                        <img src={exchangeData.image} />
                        <div className='crypto-title'>{exchangeData.name}</div>
                        <p className='grey-container' style={{marginLeft:'10px'}}>{exchangeData.name}</p>
                        <p className="p-crypto" style={{marginLeft:'15px'}}>{screenSize>600 ? 'Rank' : ''} #{exchangeData.trust_score_rank}</p>
                    </ul>
                </ul>
                <ul>
                    <ul className="container-title" style={{marginTop:'25px'}}>
                        <p className='specific-crypto-primary-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
                            <img src={require("../../res/logos/link.png")} width={26} height={26} style={{marginRight:'10px'}}/>
                            <a href={exchangeData.url}> <span className="list-title-crypto" style={{marginBottom:'2px'}}>{exchangeData.url}</span> </a>
                        </p>
                    
                    </ul>
                </ul>
                
            </div>
        )
    }



    return (
        <React.Fragment>
        {
            exchangeDataSize() && (
                <Grid container columnSpacing={{xl:5, lg:5, md:2, sm:1, xs:2}} columns={{xl:20, lg:28, md:28, sm:28, xs:7}} > 
                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} /> 
                    <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5}> 
                        <MainDetailsSection />
                    </Grid>  
                </Grid>                 
            )
        }
        </React.Fragment>
    );
}

export default HeaderSection


