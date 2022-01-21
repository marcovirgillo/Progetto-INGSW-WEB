import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import "./Profile.css"

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
    
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
    
    return(
        <div className="account-settings-page">
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

                    <p className='sign-out-button'> Sign out </p>
                </div>
            </div>

        </div>
    );
}

export default Profile;
