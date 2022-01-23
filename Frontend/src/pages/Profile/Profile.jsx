import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import "./Profile.css"
import { address } from "../../assets/globalVar";
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { set } from 'date-fns/esm';

function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)){
            return false;
        }
    }

    return true;
}

const NameAndImage = (props) => {
    const getProfilePic = () => {
        if(props.user.avatar === null)
            return require("../../res/images/profile-dark.png");
        else 
            return "data:image/png;base64," + props.user.avatar;
    }

    return (
        <div className='name-image-container'>
            <ul className='name-image-list'>
                <img src={getProfilePic()} className='account-image'/>
                <p className='account-big-name'>{props.user.username}</p>
            </ul>
        </div>
    );
}

const AccountInfo = (props) => {

    const [usernameInputField, setUsernameInputField] = useState(props.user.username);
    const [emailInputField, setEmailInputField] = useState(props.user.email);
    const [passwordInputField, setPasswordInputField] = useState(props.user.password);
    const [newPasswordInputField, setNewPasswordInputField] = useState("");
    const [confirmNewPasswordInputField, setConfirmNewPasswordInputField] = useState("");

    const [usernameEditable, setUsernameEditable] = useState(false);
    const [emailEditable, setEmailEditable] = useState(false);
    const [passwordEditable, setPasswordEditable] = useState(false);

    const [errorLabelActive, setErrorLabelActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getErrorLabelClassname = () => {
        if(errorLabelActive)
            return "error-label label-active";
        else
            return "error-label";
    }

    const showError = (msg) => {
        setErrorLabelActive(true);
        setErrorMessage(msg);
        setTimeout(() => {setErrorLabelActive(false); setErrorMessage("")}, 3500);
    }


    const accountInfoConstraints = () => {
        if(usernameEditable === true && usernameInputField === ""){
            showError("Error! Username field is empty");
            
            return false;
        }

        if(emailEditable === true && emailInputField === "") {
            showError("Error! Email field is empty");
            return false;
        }

        if(passwordEditable === true && !passwordInputField.match(/^(?=.*\d)(?=.*[@.?#$%^&+=!])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
            showError("Error! Please check the input fields and retry");
            return false;
        }
        
        return true;
    }

    const saveChanges = () => {

        if(accountInfoConstraints() === false) {
            return;
        }
        else {    
            setUsernameEditable(false);
            setEmailEditable(false);
            setPasswordEditable(false);
        }

        /*console.log(usernameInputField);
        console.log(emailInputField);
        console.log(passwordInputField);*/
    }

    const showPasswordFileds = () => {
        return (
            <React.Fragment>
                <div className="background-blurrer" />
                <div className='password-fields-container'>
                    <input type="password" className='property-content-editable' placeholder='Old password' onChange={(e)=>setPasswordInputField(e.target.value)}/>
                    <input type="password" className='password-content-editable' placeholder='New password' onChange={(e)=>setPasswordInputField(e.target.value)}/>
                    <input type="password" className='password-content-editable' placeholder='Retype new password' onChange={(e)=>setPasswordInputField(e.target.value)}/>

                </div>
            </React.Fragment>
        );
    }


    return (
        <div className='paper-black-account-settings'>
            <div className='properties-container'>
                <div className='property-container'>
                    <ul className='property-list'>
                        <p className='property-title'>Username</p>
                        {usernameEditable ? <input type="text" className='property-content-editable' defaultValue={usernameInputField} onChange={(e)=>setUsernameInputField(e.target.value)}/> 
                            : <p className='property-content'> {usernameInputField} </p>}
                    </ul>
                    {usernameEditable === false && <p className='edit-button' onClick={()=> setUsernameEditable(true)}> Edit </p>}
                </div>

                <div className='property-container'>
                    <ul className='property-list'>
                    <p className='property-title'>Email</p>
                        {emailEditable ? <input type="text" className='property-content-editable' defaultValue={emailInputField} onChange={(e)=>setEmailInputField(e.target.value)}/> 
                            : <p className='property-content'> {emailInputField} </p>}
                    </ul>
                    {emailEditable === false && <p className='edit-button' onClick={()=> setEmailEditable(true)}> Edit </p>}
                </div>

                <div className='property-container'>
                    <ul className='property-list'>
                        <p className='property-title'>Password</p>
                        <input type="password" defaultValue={"cryptoview"} className='password-content'/>
                    </ul>
                    <p className='edit-button' onClick={()=> {setPasswordEditable(true); showPasswordFileds(); }}> Edit </p>
                </div>
            </div>

            {(usernameEditable === true || emailEditable === true) && (
                <div className='save-button' onClick={()=>saveChanges()}> Save </div>
            )}

            {errorLabelActive === true && (
                <div className={getErrorLabelClassname()}>
                    <p>{errorMessage}</p>
                </div>
            )}
       
        </div>
        
    );
}

const Profile = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        console.log("props profile", props);
        if(props.accessToken === "" || isEmptyObject(props.userLogged))
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
                           user={props.userLogged}
                        />
                        
                        <AccountInfo 
                            user={props.userLogged}
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
