import React from 'react'
import OverviewSection from './OverviewSection'
import "./Dashboard.css"
import FavouriteTable from './FavouriteTable'
import NewsSection from './NewsSection'

const Dashboard = () => {
    return (
        <div className="dashboard-page">
            <div className="paper-gray">
                <h4 className="overview-label">Overview</h4>
                <OverviewSection />
                <p className="dashboard-title">Your favourite assets</p>
                <div className="button-container" style={{marginRight:'0px', marginTop:'0px', marginBottom:'0px'}}>
                    <ul className="alert-container-title">
                        <img className="favourite-image" src={require("../../res/logos/notifiche.png")} width={35} height={35}  style={{marginRight:'20px', marginTop:'1px'}}/>
                        <p className="edit-alert">View Alerts</p>
                    </ul>
                    <ul className="favourite-container-title">
                        <img className='plus-image' src={require("../../res/logos/plus.png")} width={35} height={35}  style={{marginRight:'20px', marginTop:'1px'}}/>
                        <p className='edit-favourites'>Edit Favourites</p> 
                    </ul>
                </div>
                <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <FavouriteTable /> 
                </ul>

                <NewsSection />
            </div>
        </div>
    )
}

export default Dashboard;
