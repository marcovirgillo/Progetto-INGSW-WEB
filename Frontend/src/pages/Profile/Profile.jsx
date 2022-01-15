import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const Profile = (props) => {
    const navigate = useNavigate();


    useEffect(() => {
        if(props.accessToken === "")
        navigate("/login")
    }, []);
    
    return (
        <div>
            Deve consentire il logout anche qui
        </div>
    )
}

export default Profile;
