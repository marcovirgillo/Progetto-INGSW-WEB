import React, { useEffect, useState } from 'react'
import HeaderSection from './HeaderSection'
import { Grid } from '@mui/material'
import SpecificExchangeTable from './SpecificExchangeTable'

const SpecificExchange = () => {
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



    return (
        <div className="specific-crypto">
            <div className="paper-grey">
                <div style={{paddingTop:'20px'}}/>
                <HeaderSection />
                <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <SpecificExchangeTable />
                </ul>
            </div>
            
        </div>
    );
}

export default SpecificExchange


