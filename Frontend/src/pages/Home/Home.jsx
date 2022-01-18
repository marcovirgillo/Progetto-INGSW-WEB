import React, { useEffect, useState }  from 'react'
import "./Home.css"
import "./../../App.css"
import CriptoTable from './CriptoTable'
import GainersSection from './GainersSection'
import NewsSection from './NewsSection'

const Home = (props) => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="home-page">            
            <div className="paper-gray">
                <h4 className="news-day-label">News of the day</h4>
                <NewsSection />
                <p className="cripto-title">Today's Cryptocurrency Prices by Market Cap</p>
                <GainersSection />
                <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <CriptoTable accessToken={props.accessToken}/> {/* Tabella all criptos */}
                </ul>
            </div>
        </div>
    )
}

export default Home;
