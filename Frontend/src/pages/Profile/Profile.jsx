import React, { useEffect, useRef } from 'react'
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

    const [image, setImage] = useState(null);
    const inputImage = useRef(null);
    
    const onImageClick = () => {
        inputImage.current.click();
    }

    const handleOnChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            convertToBase64(e.target.files[0]);
        }
    }

    const convertToBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setImage(reader.result);
        };

        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const getProfilePic = () => {
        if(props.user.avatar === null)
            return require("../../res/images/profile-dark.png");
        else 
            return "data:image/png;base64," + props.user.avatar;
    }

    const loginOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': username,
            'password': password,
        }),
    };



    return (
        <div className='name-image-container'>
            <ul className='name-image-list'>
                <div className='image-pencil-container' onClick={onImageClick}>
                    <input type="file" ref={inputImage} style = {{display: 'none'}} onChange={(e) => handleOnChange(e)} />
                    <img src={image === null ? getProfilePic() : image} className='account-image' />
                    <img src={require("../../res/logos/edit.png")} className='pencil'/>
                </div>
                <p className='account-big-name'>{props.user.username}</p>
            </ul>
        </div>
    );
}

const AccountInfo = (props) => {

    const [usernameEditable, setUsernameEditable] = useState(false);
    const [emailEditable, setEmailEditable] = useState(false);

    const [usernameInputField, setUsernameInputField] = useState(props.user.username);
    const [emailInputField, setEmailInputField] = useState(props.user.email);

    const isCharacterALetter = (char) => {
        return (/[a-zA-Z]/).test(char)
    }

    const checkUsernameConstraints = (ev) => {
        const key = ev.key;

        if(key === " ") {
            ev.preventDefault();
            return;
        }
        if(key === "."){
            ev.preventDefault();
            return;
        }
        if(isNaN(key) && !isCharacterALetter(key)){
            ev.preventDefault();
            return;
        }
    }

    const checkEmailConstraints = (ev) => {
        const key = ev.key;
        const total = ev.target.value;

        if(key === " ") {
            ev.preventDefault();
            return;
        }

        if(key === '@'){
            if(total.includes("@")) {
                ev.preventDefault();
                return;
            }
        }

        if(isNaN(key) && !isCharacterALetter(key) && key !== '@' && key !== '.'){
            ev.preventDefault();
            return;
        }
    }

    const checkAccountInfoConstraints = () => {
        if(usernameInputField === "" || emailInputField === "") {
            props.showError("Error! Some fields are empty", "form");
            return false;
        }

        return true;
    }

    const handleSaveButton = () => {
        
        if(checkAccountInfoConstraints() === false)
            return;
        else {
            setUsernameEditable(false);
            setEmailEditable(false);
        }

    }

    return (
        <div className='paper-black-account-settings'>
            <div className='properties-container'>
                <div className='property-container'>
                    <ul className='property-list'>
                        <p className='property-title'>Username</p>
                        {usernameEditable ? <input type="text" className='property-content-editable' value={usernameInputField} onChange={(e)=>setUsernameInputField(e.target.value)} onKeyPress={(ev) => checkUsernameConstraints(ev)} /> 
                            : <p className='property-content'> {usernameInputField} </p>}
                    </ul>
                    {usernameEditable === false && <p className='edit-button' onClick={()=> setUsernameEditable(true)}> Edit </p>}
                </div>

                <div className='property-container'>
                    <ul className='property-list'>
                    <p className='property-title'>Email</p>
                        {emailEditable ? <input type="text" className='property-content-editable' value={emailInputField} onChange={(e)=>setEmailInputField(e.target.value)} onKeyPress={(ev) => checkEmailConstraints(ev)} /> 
                            : <p className='property-content'> {emailInputField} </p>}
                    </ul>
                    {emailEditable === false && <p className='edit-button' onClick={()=> setEmailEditable(true)}> Edit </p>}
                </div>

                <div className='property-container'>
                    <ul className='property-list'>
                        <p className='property-title'>Password</p>
                        <input type="password" defaultValue={"cryptoview"} className='password-content'/>
                    </ul>
                    <p className='edit-button' onClick={props.enablePasswordEdit}> Edit </p>
                    {props.passwordEditable === true &&
                        <EditPasswordPopup 
                            disablePasswordEdit={props.disablePasswordEdit} 
                            popupErrorLabelActive={props.popupErrorLabelActive}
                            getErrorLabelClassname = {props.getErrorLabelClassname}
                            showError = {props.showError}
                            errorMessage = {props.errorMessage}
                        />
                    }
                </div>
            </div>

            {(usernameEditable === true || emailEditable === true) && (
                <div className='save-button' onClick={() => handleSaveButton()} > Save </div>
            )}

            {props.formErrorLabelActive === true && (
                <div className={props.getErrorLabelClassname()}>
                    <p>{props.errorMessage}</p>
                </div>
            )}
       
        </div>
        
    );
}

const EditPasswordPopup = (props) => {

    const [oldPasswordInputField, setOldPasswordInputField] = useState("");
    const [newPasswordInputField, setNewPasswordInputField] = useState("");
    const [confirmNewPasswordInputField, setConfirmNewPasswordInputField] = useState("");

    const checkPasswordConstraints = () => {

        if(oldPasswordInputField === "" || newPasswordInputField === "" || confirmNewPasswordInputField === "") {
            props.showError("Error! Some fields are empty", "popup");
            return false;
        }

        if(newPasswordInputField !== confirmNewPasswordInputField) {
            props.showError("New passwords don't match", "popup");
            return false;
        }

        if(!newPasswordInputField.match(/^(?=.*\d)(?=.*[@.?#$%^&+=!])(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
        {
            props.showError("Error! Please check the input fields and retry", "popup");
            return false;
        }
        
        // Controllo sulla old password. Deve essere uguale a quella presente nel DB
        
        return true;
    }

    const handleConfirmPassword = () => {
        if(checkPasswordConstraints() === false)
            return;
    }

    return (
        <div className="background-blurrer">
            <div className='edit-password-popup'>
                <ul className='edit-password-list'> 

                    <div className='edit-password-label-field-wrapper'>
                        <ul className='edit-password-label-field'>
                            <p className='password-label'>Old password</p>
                            <input type="password" className='password-content-editable' onChange={(e)=> setOldPasswordInputField(e.target.value)}/>
                        </ul>
                    </div>

                    <div className='edit-password-label-field-wrapper'>
                        <ul className='edit-password-label-field'>
                            <p className='password-label'>New password</p>
                            <input type="password" className='password-content-editable' onChange={(e)=> setNewPasswordInputField(e.target.value)}/>
                        </ul>
                    </div>

                    <div className='edit-password-label-field-wrapper'>
                        <ul className='edit-password-label-field'>
                            <p className='password-label'>Confirm new password</p>
                            <input type="password" className='password-content-editable' onChange={(e)=> setConfirmNewPasswordInputField(e.target.value)}/>
                        </ul>
                    </div>
                </ul>
                <p className='popup-confirm popup-btn' onClick={()=>handleConfirmPassword()} > Confirm password</p>
                <p className='popup-cancel popup-btn' onClick={props.disablePasswordEdit}> Cancel </p>

                {props.popupErrorLabelActive === true && (
                    <div className={props.getErrorLabelClassname()}>
                        <p>{props.errorMessage}</p>
                    </div>
                )}

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

    const [passwordEditable, setPasswordEditable] = useState(false);

    const enablePasswordEdit = () => {
        setPasswordEditable(true);
    }

    const disablePasswordEdit = () => {
        setPasswordEditable(false);
    }

    const [formErrorLabelActive, setFormErrorLabelActive] = useState(false);
    const [popupErrorLabelActive, setPopupErrorLabelActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getErrorLabelClassname = () => {
        if(formErrorLabelActive || popupErrorLabelActive)
            return "error-label label-active";
        else
            return "error-label";
    }

    const showError = (msg, label) => {
        if(label === "form") {
            setFormErrorLabelActive(true);
            setErrorMessage(msg);
            setTimeout(() => {setFormErrorLabelActive(false); setErrorMessage("")}, 3500);
        }
        else if(label === "popup") {
            setPopupErrorLabelActive(true);
            setErrorMessage(msg);
            setTimeout(() => {setPopupErrorLabelActive(false); setErrorMessage("")}, 3500);
        } 
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
                            passwordEditable={passwordEditable}
                            enablePasswordEdit={enablePasswordEdit}
                            disablePasswordEdit = {disablePasswordEdit}

                            formErrorLabelActive = {formErrorLabelActive}
                            popupErrorLabelActive = {popupErrorLabelActive}
                            getErrorLabelClassname = {getErrorLabelClassname}
                            showError = {showError}
                            errorMessage = {errorMessage}
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
