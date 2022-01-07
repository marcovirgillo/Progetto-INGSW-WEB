import React, { useEffect, useState } from 'react'
import './SpecificCrypto.css';
import "./../../App.css";
import ChartSection from './ChartSection'
import HeaderSection from './HeaderSection'
import StatisticsSection from './StatisticsSection'
import { Grid } from '@mui/material'
import { useLocation } from 'react-router';

const SpecificCrypto = () => {
    const [screenSize, setScreenSize] = useState(null);
    const [cryptoData, setCryptoData] = useState([]);

    const location = useLocation()
    const cryptoID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    const fetcher = () => {
        fetch(`https://api.coingecko.com/api/v3/coins/${cryptoID}`)
        .then((res) => res.json())
        .then((result) => setCryptoData(result),
        (error) => console.log("Error fetching crypto"));
    }

    useEffect(() => {
        fetcher();
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

    return (
        <div className="specific-crypto">
            <div className="paper-grey">
                <div style={{paddingTop:'20px'}}/>
                <HeaderSection data={cryptoData}/>
                <div style={{paddingTop:'20px'}}/>
                {
                    screenSize>600 && (
                        <StatisticsSection data={cryptoData} />
                    )
                }
                <ChartSection />
                <div style={{paddingTop:'50px'}}/>
                {
                    screenSize<=600 && (

                        <StatisticsSection data={cryptoData} />
                    )
                }
            </div>
            
        </div>
    );
}

export default SpecificCrypto


