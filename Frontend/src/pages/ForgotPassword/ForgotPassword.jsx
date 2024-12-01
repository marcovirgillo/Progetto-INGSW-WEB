import React, { useEffect, useState, useRef } from 'react'
import './ForgotPassword.css'
import { Link } from 'react-router-dom'
import { address } from '../../assets/globalVar';
import { useNavigate } from "react-router-dom";


export default function ForgotPassword(props) {

    const navigate = useNavigate();

    const resetAddress = `http://${address}:8080/forgotpassword`;

    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [errorLabelActive, setErrorLabelActive] = useState(false);
    const [errorLabelText, setErrorLabelText] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [email, setEmail] = useState("");

    const resetOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email' : email,
        }),
    };

    const parseResponse = res => {
        if(res.status === 200) {
            props.showResultPopup("Mail sent !");
            navigate("/login");
        }
        else {
            console.log("error");
            res.json().then(result => console.log(result));
        }

        setButtonDisabled(false);
    }

    const resetPassword = () => {
        if(!checkEmailField())
            return;

        setTimeout(() => setButtonDisabled(false), 5000);

        fetch(resetAddress, resetOptions)
            .then(res => parseResponse(res));
    }

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    });

    function titleStyle(color){
        if(screenSize<600)
            if(color==="blue")
                return {color:'#32C0FF', fontSize:'22px'};
            else
                return {color:'white', fontSize:'22px'};
        
        if(color==="blue") return {color:'#32C0FF'};
        
        return {color:'white'};
    }

    function subtitle(){
        if(screenSize<600)
            return {fontSize:'16px'}
        return {fontSize:'18px'}
    }

    function fieldFont(){
        if(screenSize<600)
            return {fontSize:'14px'}
        return {fontSize:'15px'}
    }

    function loginEndingStyle(color){
        if(screenSize < 600)
            if(color === "blue")
                return {color:'#32C0FF', fontSize:'14px', cursor:'pointer', display:'flex', flexDirection:'row'};
            else
                return {color:'white', fontSize:'14px'};
    
        if(color==="blue") return {color:'#32C0FF', fontSize:'16px', cursor:'pointer', display:'flex', flexDirection:'row'};
    
        return {color:'white', fontSize:'16px'};
    }

    function minHeight(){
        if(screenSize < 600)
            return {minHeight:'100vh'}
        return {minHeight:'60vh'}
    }

    const checkEmailField = () => {
        if(email === "") {
            showError("Email cannot be empty, please check again!");
            return false;
        }
  
        if (!email.match(/^[a-zA-Z0-9\\.]+@[a-z]+[\\.]{1}[a-z]+$/)) {
            showError("The email is not valid, please check again!");
            return false;
        }

        return true;
    }

    const getErrorLabelClassname = () => {
        if(errorLabelActive)
            return "error-label label-active";
        else
            return "error-label";
    }

    const showError = (msg) => {
        setErrorLabelActive(true);
        setErrorLabelText(msg);
        setTimeout(() => setErrorLabelActive(false), 3500);
    }


    return (
        <div className="forgot-password">
            <div className="paper-grey" style={minHeight()}>
                <div style={{paddingTop:'30px'}} />
                <div className="forgot-password-logo">
                    <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={100} width={100} />
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="forgot-password-list"> 
                    <span className="forgot-password-header-title" style={titleStyle("blue")}>Forgot your password?</span>
                </div>
                <div style={{paddingTop:'15px'}} />
                <div> 
                    <span className="forgot-password-header-subtitle" style={subtitle()}>
                        Don't worry! Resetting your password is easy. Just type in the email you registered to CryptoView
                    </span>
                </div>
                <div style={{paddingTop:'20px'}} />
                <span className="forgot-password-field-title" style={fieldFont()}>Email</span>
                <div className="forgot-password-field">
                    <input className="forgot-password-field-style" onChange={(ev) => setEmail(ev.target.value)} type="text" placeholder='Enter your email address' style={fieldFont() }/>
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="forgot-password-field">
                    <button disabled={buttonDisabled} className='send-button'  onClick={resetPassword}>
                        <span>
                            Send
                        </span>
                    </button>
                    
                    {errorLabelActive && <div className={getErrorLabelClassname()}>
                        <p>{errorLabelText}</p>
                    </div> }

                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="forgot-password-ending-list"> 
                    <span className="forgot-password-ending" style={loginEndingStyle("white")}>Do you remember your password?</span>
                    <span className="forgot-password-ending" ><Link to="/login" style={loginEndingStyle("blue")}>Try logging in</Link></span>
                </div>
            </div>
        </div>
    );
}