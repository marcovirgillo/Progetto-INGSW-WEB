import React from 'react'
import ExchangesTable from './ExchangesTable'
import NewsExchangesSection from './NewsExchangeSection'

const Exchanges = () => {
    return (
        <div className="exchanges-page">
            <div className="paper-grey">
                <h4 className="news-day-label">Exchanges news of the day</h4>
                <NewsExchangesSection />
                <p className="exchanges-title">Top Cryptocurrency Exchanges</p>
                <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <ExchangesTable /> 
                </ul>
            </div>
        </div>
    )
}

export default Exchanges;
