import React, { useEffect, useState } from 'react'
import './SpecificCrypto.css';
import "./../../App.css";
import ChartSection from './ChartSection'
import HeaderSection from './HeaderSection'
import { Grid } from '@mui/material'

const SpecificCrypto = () => {
    const [screenSize, setScreenSize] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    });

    function twoByTwoGrid() {
        return screenSize > 600 && screenSize <= 1536;
    }

    function mobileGrid() {
        return screenSize <= 600;
    }

    return (
        <div className="specific-crypto">
            <div className="paper-grey">
                <div style={{paddingTop:'20px'}}/>
                <HeaderSection />
                <div style={{paddingTop:'20px'}}/>
                <Grid container columnSpacing={{xl:5, lg:5, md:2, sm:1, xs:2}} columns={{xl:28, lg:28, md:28, sm:28, xs:7}} > 
                    <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                    <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5}> 
                        
                    </Grid>
                    {mobileGrid() && (
                            <>
                                <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                                <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                            </>
                        )
                    }   
                    <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5}> 
                    
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
                    <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5}> 
                        
                    </Grid>
                    {mobileGrid() && (
                            <>
                                <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                                <Grid item xl={2} lg={2} md={2} sm={2} xs={1} /> 
                            </>
                        )
                    }   
                    <Grid className="item" item xl={6} lg={12} md={12} sm={12} xs={5}> 
                        
                    </Grid>
                </Grid>
                <ChartSection />
            </div>
            
        </div>
    );
}

export default SpecificCrypto


