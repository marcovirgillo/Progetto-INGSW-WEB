import React from 'react'
import { Grid, Icon, Typography } from '@mui/material'
import "./Home.css"
import "./../../App.css"
import { TopGainers, WorstGainers } from "./TestData.js"
import CriptoTable from './CriptoTable'
import GainersSection from './GainersSection'
import NewsSection from './NewsSection'

const Home = () => {
    return (
        <div className="home-page">
            <div className="paper-grey">
                <h4 className="news-day-label">News of the day</h4>
                <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <NewsSection />
                    <GainersSection />
                    <CriptoTable /> {/* Tabella all criptos */}
                </ul>
            </div>
        </div>


    )
}

export default Home;
