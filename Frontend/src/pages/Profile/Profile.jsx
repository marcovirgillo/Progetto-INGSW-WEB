import React, { useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import "./Profile.css"
import { address } from "../../assets/globalVar";
import { Link } from 'react-router-dom'
import { useState } from 'react'
import scaleImage from './ImageConverter.js'

const updateAvatarUrl = `https://${address}/updateUserAvatar`;
const updateProfileUrl = `https://${address}/updateUserEmail`;
const updatePasswordUrl = `https://${address}/updateUserPassword`;
const resetAvatarUrl = `https://${address}/resetUserAvatar`;

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
    const [dropdownImageActive, setDropdownImageActive] = useState(false);
    const inputImage = useRef(null);
    
    //se cambia l'immagine, la posto al backend
    useEffect(() => {
        if(image !== null)
            updateAvatar();

    }, [image]);

    const onChangeImage = () => {
        inputImage.current.click();
    }

    const handleOnChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            convertToBase64(e.target.files[0]);
        }
        setDropdownImageActive(false);
    }

    const convertToBase64 = (file) => {
        scaleImage(file, setImage, () => props.showError("Cannot load image, please retry!", "form"));
    }

    const getProfilePic = () => {
        if(props.user.avatar === null)
            return require("../../res/images/profile-dark.png");
        else
            return "data:image/png;base64," + props.user.avatar;
    }

    const updateAvataroptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'image': image
        })
    }

    const updateAvatar = () => {
        fetch(updateAvatarUrl, updateAvataroptions)
            .then(res => {
                if(res.status === 200) {
                    props.showResultPopup("Avatar updated successfully!");
                    props.fetchProfile();
                }
            });
    }

    const resetAvatar = () => {
        fetch(resetAvatarUrl, resetAvatarOptions)
            .then(res => {
                if(res.status === 200) {
                    props.showResultPopup("Avatar removed successfully!");
                    props.fetchProfile();
                }
            });
    }

    const resetAvatarOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        }
    }

    const onDeleteImage = () => {
        resetAvatar();
        setDropdownImageActive(false);
    }

  
    return (
        <div className='name-image-container'>
            <ul className='name-image-list'>
                <div className='image-pencil-container' >
                    <input type="file" ref={inputImage} style = {{display: 'none'}} onChange={(e) => handleOnChange(e)} />
                    <img src={getProfilePic()} className='account-image' />
                    <img src={require("../../res/logos/edit.png")} className='pencil' onClick={() => setDropdownImageActive(!dropdownImageActive)}/>
                </div>
                <p className='account-big-name'>{props.user.username}</p>
                {dropdownImageActive === true && (
                    <div className='dropdown-edit-image'>
                        <ul className='dropdown-edit-image-list'>
                            <p className='dropdown-edit-image-item' onClick={onChangeImage} >Change avatar</p>
                            <p className='dropdown-edit-image-item' onClick={onDeleteImage}> Delete avatar</p>
                        </ul>
                    </div>
                )}
            </ul>
        </div>
    );
}

const AccountInfo = (props) => {
    const [emailEditable, setEmailEditable] = useState(false);
    const [emailInputField, setEmailInputField] = useState(props.user.email);

    useEffect(() => {   
        if(props.user && props.user.email != undefined)
            setEmailInputField(props.user.email);
    }, [props.user]);

    const isCharacterALetter = (char) => {
        return (/[a-zA-Z]/).test(char)
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
        if(emailInputField === "") {
            props.showError("Error! Some fields are empty", "form");
            return false;
        }

        return true;
    }

    const checkEmail = (mail) => {
        return mail.match(/^[a-zA-Z0-9\\.]+@[a-z]+[\\.]{1}[a-z]+$/);
    }

    const updateOptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'email': emailInputField
        })
    }

    const parseResponse = res => {
        if(res.status === 200) {
            props.showResultPopup("Email updated successfully!");
            props.fetchProfile();
        }
        if(res.status === 465) 
            props.showError("Email is not valid, please retry", 'form');
        if(res.status === 500)
            props.showError("Server error! Please try again later", 'form');
    }

    const updateProfileInfo = () => {
        if(checkAccountInfoConstraints() === false)
            return;
        if(!checkEmail(emailInputField)) {
            props.showError("Error! the e-mail is not valid, please retry", 'form');
            return
        }    

        setEmailEditable(false);

        fetch(updateProfileUrl, updateOptions)
            .then(res => parseResponse(res));
    }

    return (
        <div className='paper-black-account-settings'>
            <div className='properties-container'>
                <div className='property-container'>
                    <p className='property-title'>Username</p>
                    <p className='property-content'> {props.user.username} </p>
                </div>

                <div className='property-container'>
                    <p className='property-title'>Email</p>
                    <ul className="property-list">
                        {emailEditable  
                            ? <input type="text" className='property-content-editable' value={emailInputField} onChange={(e)=>setEmailInputField(e.target.value)} onKeyPress={(ev) => checkEmailConstraints(ev)} /> 
                            : <p className='property-content'> {emailInputField} </p>
                        }
                        <div className="property-spacer" />
                        <p className="edit-button" onClick={() => setEmailEditable(!emailEditable)}>{emailEditable ? 'Cancel' : 'Edit'}</p>
                    </ul>
                </div>

                <div className='property-container'>
                    <p className='property-title'>Password</p>
                    <ul className="property-list">
                        <input type="password" defaultValue={"cryptoview"} className='password-content'/>
                        <div className="property-spacer" />
                        <p className='edit-button' onClick={props.enablePasswordEdit}> Edit </p>
                    </ul>
                    {props.passwordEditable === true &&
                        <EditPasswordPopup 
                            disablePasswordEdit={props.disablePasswordEdit} 
                            popupErrorLabelActive={props.popupErrorLabelActive}
                            getErrorLabelClassname = {props.getErrorLabelClassname}
                            showError = {props.showError}
                            errorMessage = {props.errorMessage}
                            accessToken = {props.accessToken}
                            showResultPopup={props.showResultPopup}
                        />
                    }
                </div>
            </div>

            {emailEditable === true && (
                <div className='save-button' onClick={() => updateProfileInfo()} > Save </div>
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
    
        return true;
    }

    const updateOptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'old_password':  oldPasswordInputField,
            'new_password': newPasswordInputField
        })
    }

    const parsePasswordResponse = res => {
        if(res.status === 200) {
            props.showResultPopup("Password updated successfully!");
            props.disablePasswordEdit();
        }
        if(res.status === 465) 
            props.showError("Error! Password characters are not valid, please retry", 'popup');
        if(res.status === 500)
            props.showError("Server error! Please try again later", 'popup');
        if(res.status === 401)
            props.showError("Error! Old password doesn't match, please retry", 'popup');
    }

    const handleConfirmPassword = () => {
        if(checkPasswordConstraints() === false)
            return;
        
        fetch(updatePasswordUrl, updateOptions)
            .then(res => parsePasswordResponse(res));
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
    const [passwordEditable, setPasswordEditable] = useState(false);
    const [formErrorLabelActive, setFormErrorLabelActive] = useState(false);
    const [popupErrorLabelActive, setPopupErrorLabelActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);

        if(props.accessToken === "" && isEmptyObject(props.userLogged))
            navigate("/login");

    }, [props.userLogged]);

    const enablePasswordEdit = () => {
        setPasswordEditable(true);
    }

    const disablePasswordEdit = () => {
        setPasswordEditable(false);
    }

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
                           accessToken={props.accessToken}
                           fetchProfile={props.fetchProfile}
                           showError = {showError}
                           showResultPopup={props.showResultPopup}
                        />
                        
                        <AccountInfo 
                            user={props.userLogged}
                            passwordEditable={passwordEditable}
                            enablePasswordEdit={enablePasswordEdit}
                            disablePasswordEdit = {disablePasswordEdit}
                            accessToken={props.accessToken}
                            fetchProfile={props.fetchProfile}
                            showResultPopup={props.showResultPopup}

                            formErrorLabelActive = {formErrorLabelActive}
                            popupErrorLabelActive = {popupErrorLabelActive}
                            getErrorLabelClassname = {getErrorLabelClassname}
                            showError = {showError}
                            errorMessage = {errorMessage}
                        />
                    </div>
                    
                    <Link to="/" className='sign-out-button'> 
                        <div onClick={props.doLogout} > Sign out </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default Profile;
