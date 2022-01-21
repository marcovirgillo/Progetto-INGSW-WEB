import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import "./Profile.css"
import { address } from "../../assets/globalVar";
import { Link } from 'react-router-dom'

const NameAndImage = (props) => {
    return (
        <div className='name-image-container'>
            <ul className='name-image-list'>
                <img src={require("../../res/images/doggo.jpg")} className='account-image'/>
                <p className='account-big-name'>{props.name}</p>
            </ul>
        </div>
    );
}

const AccountInfo = (props) => {
    return (
        <div className='paper-black-account-info'>
            <div className='property-container'>
                <ul className='property-list'>
                    <p className='property-title'>Display Name</p>
                    <p className='property-content'> {props.name} </p>
                </ul>
                <p className='edit-button'> Edit </p>
            </div>

            <div className='property-container'>
                <ul className='property-list'>
                    <p className='property-title'>Email</p>
                    <p className='property-content'>{props.email} </p>
                </ul>
                <p className='edit-button'> Edit </p>
            </div>

            <div className='property-container'>
                <ul className='property-list'>
                    <p className='property-title'>Password</p>
                    <input className='password-content' type="password" readOnly value={"cryptoview"}/>
                </ul>
                <p className='edit-button'> Change </p>
            </div>
        </div>
        
    );
}

const Profile = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if(props.accessToken === "")
        navigate("/login")
    }, []);

    const logoutLink = `http://${address}:8080/logout`;

    const req_options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    };

    const parseResponse = res => {
        if(res.status === 200) {
            console.log("Logout successful");
            res.json().then((result) => console.log(result));
            props.setAccessToken("");
        }
        else {
            console.log("Error during logout");
            res.json().then((result) => console.log(result));
        }
    }

    const doLogout = () => {
        fetch(logoutLink, req_options)
            .then(res => parseResponse(res));
    }

    
    return(
        <div className="profile">
            <div className='paper-gray-account-settings'>
                <div className='paper-black-container'>
                    <div className='account-settings-wrapper'>
                        <p className="account-settings-title"> My Account </p>
                        <NameAndImage
                            name="Marco Virgillo"
                        />
                        
                        <AccountInfo 
                            name="Marco Virgillo"
                            email="marcovirgillo10x@gmail.com"
                        />
                    </div>
                    
                    <Link to="/" className='sign-out-button'> 
                        <div onClick={doLogout} > Sign out </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default Profile;
