import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './Profile.css';
import { blue } from '@mui/material/colors';

const Profile = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if(props.accessToken === "")
        navigate("/login")
    }, []);
    
    return(
        <div className="profile">
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
            devo consentire logout qua
        </div>
        
    )
}

export default Profile;
