import React, { useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import "./Profile.css"
import { address } from "../../assets/globalVar";
import { Link } from 'react-router-dom'
import { useState } from 'react'

const updateAvatarUrl = `http://${address}:8080/updateUserAvatar`;
const updateProfileUrl = `http://${address}:8080/updateUserEmail`;
const updatePasswordUrl = `http://${address}:8080/updateUserPassword`;
const resetAvatarUrl = `http://${address}:8080/resetUserAvatar`;

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
                    //TODO apposto
                }
            });
    }

    const [dropdownImageActive, setDropdownImageActive] = useState(false);


    const resetAvatar = () => {
        fetch(resetAvatarUrl, resetAvatarOptions)
            .then(res => {
                if(res.status === 200) {
                    setImage(null);
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
                    <img src={image === null ? getProfilePic() : image} className='account-image' />
                    <img src={require("../../res/logos/edit.png")} className='pencil' onClick={() => setDropdownImageActive(!dropdownImageActive)}/>

                    
                    {dropdownImageActive === true && (<div className='dropdown-edit-image'>
                        <ul className='dropdown-edit-image-list'>
                            <p className='dropdown-edit-image-item' onClick={onChangeImage} >Change avatar</p>
                            <p className='dropdown-edit-image-item' onClick={onDeleteImage}> Delete avatar</p>
                        </ul>
                    </div>)}

                </div>
                <p className='account-big-name'>{props.user.username}</p>
            </ul>
        </div>
    );
}

const AccountInfo = (props) => {
    const [emailEditable, setEmailEditable] = useState(false);
    const [emailInputField, setEmailInputField] = useState(props.user.email);

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
            //TODO apposto
        }
        if(res.status === 5020) 
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
            props.disablePasswordEdit();
        }
        if(res.status === 5020) 
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
                           accessToken={props.accessToken}
                        />
                        
                        <AccountInfo 
                            user={props.userLogged}
                            passwordEditable={passwordEditable}
                            enablePasswordEdit={enablePasswordEdit}
                            disablePasswordEdit = {disablePasswordEdit}
                            accessToken={props.accessToken}

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
