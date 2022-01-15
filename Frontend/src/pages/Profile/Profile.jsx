import React from 'react'
import { useNavigate } from "react-router-dom";

const Profile = (props) => {

    const navigate = useNavigate();

    if(props.logged == false){
        navigate("/login")
    }

    return (
        <div>
            Deve consentire il logout anche qui
        </div>
    )
}

export default Profile;
