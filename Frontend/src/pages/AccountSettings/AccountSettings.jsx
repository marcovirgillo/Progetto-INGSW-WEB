import React, { useEffect, useState}  from 'react'
import "./AccountSettings.css"

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

            <div className='property-container-center'>
                <ul className='property-list'>
                    <p className='property-title'>Email</p>
                    <p className='property-content'>{props.email} </p>
                </ul>
                <p className='edit-button'> Edit </p>
            </div>

            <div className='property-container-bottom'>
                <ul className='property-list'>
                    <p className='property-title'>Password</p>
                    <input className='password-content' type="password" readOnly value={"cryptoview"}/>
                </ul>
                <p className='edit-button'> Change </p>
            </div>
        </div>
        
    );
}


export default function AccountSettings() {

    return(
        <div className="account-settings">
            <div className="paper-gray">
                <div className='settings-page'>
                    <div className='account-wrapper'>
                        <p className="settings-title">  Your account settings </p>
                        <NameAndImage
                            name="Marco Virgillo Frocio"
                        />
                        
                        <AccountInfo 
                            name="Marco Virgillo"
                            email="marcovirgillo10x@gmail.com"
                        />
                    </div>
                </div>
            </div>
        </div>
        
        

    )
}