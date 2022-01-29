import React, { useEffect, useState }  from 'react'
import { useNavigate } from "react-router-dom";
import OverviewSection from './OverviewSection'
import "./Dashboard.css"
import FavouriteTable from './FavouriteTable'
import AddCrypto from './AddCrypto'
import EditAlerts from './EditAlerts'
import NewsSection from './NewsSection'
import { address } from './../../assets/globalVar.js';
import CircularProgress from '@mui/material/CircularProgress';
import { blue } from '@mui/material/colors';

const getPreferencesUrl = `http://${address}:8080/getPreferencesDashboard`;
const getAlertsUrl = `http://${address}:8080/getAlerts`;

const Dashboard = (props) => {
    const [preferred, setPreferred] = useState([]);
    const [fetched, setFetched] = useState(false);

    const [addPreferredActive, setAddPreferredActive] = useState(false);

    const [alerts, setAlerts] = useState([]);
    const [editAlertsActive, setEditAlertsActive] = useState(false);
    const [chooseCryptoActive, setChooseCryptoActive] = useState(false);
    const [addAlertActive, setAddAlertActive] = useState(false);    
    
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if(props.accessToken === "")
        navigate("/login")
    }, [props.accessToken]);

    const optionsPreferences = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    }

    useEffect(() => {
        if(props.accessToken === ""){
            setPreferred([]);
            setAlerts([]);
        }
        else{
            fetcherPreferences();
            fetcherAlerts();
        }
    }, [props.accessToken]); 

    useEffect(() => {
        if(props.accessToken !== null || props.accessToken !== ""){
            fetcherPreferences();
            fetcherAlerts();
            
        }
    }, []);

    const fetcherPreferences = () => {
        if(props.accessToken === null || props.accessToken === "")
            return;

        fetch(getPreferencesUrl, optionsPreferences)
        .then((res) => processPreferences(res));
    }

    const fetcherAlerts = () =>{
        if(props.accessToken === null || props.accessToken === "")
            return;

        console.log("fetching alerts")
        
        fetch(getAlertsUrl, optionsPreferences)
        .then((res) => processAlerts(res));
    }

    const processPreferences = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => {setPreferred(result.preferences); setFetched(true);},
                      (error) => console.log(error));
        }
        else if(res.status === 6001) {
            console.log("No preferences found");
        }
    }

    const processAlerts = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => {setAlerts(result.alerts)},
                      (error) => console.log(error));
        }
        else if(res.status === 7002) {
            console.log("No alerts found");
        }
    }

    if(fetched === false){
        return(
            <div className="dashboard">
                <div className="paper-gray">
                <div style={{paddingTop:'100px'}}/>
                <div className="loader">
                    <CircularProgress size={100} sx={{
                            color: blue[300],
                            '&.Mui-checked': {
                                color: blue[300],
                            },
                        }}
                    /> 
                </div>
            </div>
            </div>
        )
    }

    return (
        <div className="dashboard">
            {preferred.length === 0 && (
                <div className="paper-gray">
                    <div style={{paddingTop:'30px'}} />
                    <AddCrypto allCryptos={props.allCrypto} accessToken={props.accessToken} fetcherPreferences={fetcherPreferences} 
                                addCryptosClass={true} position="beforeDashboard" setAddPreferredActive={setAddPreferredActive}
                                preferred={preferred} addPreferredActive={false}
                    />
                </div>
            )}
            {preferred.length !== 0 && (
                <div className="paper-gray">
                    <h4 className="overview-label">Overview</h4>
                    <OverviewSection accessToken={props.accessToken}/>
                    <div className="button-container" style={{marginRight:'0px', marginTop:'0px', marginBottom:'0px'}}>
                        <ul className="alert-container-title" onClick={() => setEditAlertsActive(!editAlertsActive)}>
                            <img className="favourite-image" src={require("../../res/logos/alert.png")} width={35} height={35}  style={{marginRight:'10px', marginTop:'1px'}}/>
                            <p className="edit-alert">Edit Alerts</p>
                        </ul>
                        <ul className="favourite-container-title" onClick={() => setAddPreferredActive(!addPreferredActive)}>
                            <img className='plus-image' src={require("../../res/logos/plus.png")} width={35} height={35}  style={{marginRight:'10px', marginTop:'1px'}}/>
                            <p className='edit-favourites'>Add Favourites</p> 
                        </ul>
                    </div>
                    <AddCrypto 
                        allCryptos={props.allCrypto} accessToken={props.accessToken} fetcherPreferences={fetcherPreferences} addCryptosClass={addPreferredActive}  
                        position="dashboard" addPreferredActive={addPreferredActive} setAddPreferredActive={setAddPreferredActive} preferred={preferred}/>
                    <EditAlerts allCryptos={props.allCrypto} accessToken={props.accessToken} editAlertsActive={editAlertsActive} setEditAlertsActive={setEditAlertsActive}
                                alerts={alerts} setAlerts={setAlerts} allCryptos={props.allCrypto} fetcherAlerts={fetcherAlerts} showResultPopup={props.showResultPopup} />
                    <p className="dashboard-title">Your favourite assets</p>
                    <ul style={{padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <FavouriteTable accessToken={props.accessToken} preferred={preferred} setPreferred={setPreferred}/> 
                    </ul>

                    <NewsSection preferred={preferred} accessToken={props.accessToken}/>
                </div>
            )}
        </div>
    )
}

export default Dashboard;
