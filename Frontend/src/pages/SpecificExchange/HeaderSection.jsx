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
                        <p className="rank" style={{marginLeft:'18px', fontSize: '20px', color: 'white'}}> Rank #{exchangeData.trust_score_rank}</p>
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
                    
                        <MainDetailsSection />
                  
                </Grid>                 
            )
        }
        </React.Fragment>
    );
}

export default HeaderSection


