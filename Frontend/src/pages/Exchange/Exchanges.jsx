import React from 'react'
import ExchangesTable from './ExchangesTable'
import NewsSection from '../Home/NewsSection'

const Exchanges = () => {
    return (
        <div className="exchanges-page">
            <div className="paper-grey">
                <h4 className="news-day-label">Exchanges news of the day</h4>
                <NewsSection />
                <p className="exchanges-title">Top Cryptocurrency Exchanges</p>
                <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <ExchangesTable /> {/* Tabella all criptos */}
                </ul>
            </div>
        </div>
    )
}

export default Exchanges;
