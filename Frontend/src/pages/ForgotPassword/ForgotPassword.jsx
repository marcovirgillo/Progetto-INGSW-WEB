import React, { useEffect, useState } from 'react'
import './ForgotPassword.css'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {

    const [screenSize, setScreenSize] = useState(window.innerWidth);

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
        if(screenSize<600)
            if(color==="blue")
                return {color:'#32C0FF', fontSize:'14px', cursor:'pointer', display:'flex', flexDirection:'row'};
            else
                return {color:'white', fontSize:'14px'};
    
        if(color==="blue") return {color:'#32C0FF', fontSize:'16px', cursor:'pointer', display:'flex', flexDirection:'row'};
    
        return {color:'white', fontSize:'16px'};
    }

    function loginButtonTextStyle(type){
        if(screenSize<600 && type=="normal")
            return {fontSize:'16px', paddingTop:'9px'};
        return {fontSize:'18px'};
    }

    function minHeight(){
        if(screenSize<600)
            return {minHeight:'100vh'}
        return {minHeight:'60vh'}
    }

    return (
        <div className="forgot-password">
            <div className="paper-grey" style={minHeight()}>
                <div style={{paddingTop:'30px'}} />
                <div className="login-logo">
                    <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={100} width={100} />
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="login-list"> 
                    <span className="login-header-title" style={titleStyle("blue")}>Forgot your password?</span>
                </div>
                <div style={{paddingTop:'15px'}} />
                <div> 
                    <span className="login-header-subtitle" style={subtitle()}>Don't worry! Resetting your password is easy. Just type in the email you registered to CryptoView</span>
                </div>
                <div style={{paddingTop:'20px'}} />
                <span className="field-title" style={fieldFont()}>Email</span>
                <div className="login-field">
                    <input className="login-field-style" type="text" placeholder='Enter your email address' style={fieldFont()}/>
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="login-field">
                    <span className="login-button-style" style={fieldFont()}>
                        <div className='login-button-text' style={loginButtonTextStyle("normal")}>Send</div>
                    </span>
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="login-ending-list"> 
                    <span className="login-ending" style={loginEndingStyle("white")}>Do you remember your password?</span>
                    <span className="login-ending" ><Link to="/login" style={loginEndingStyle("blue")}>Try logging in</Link></span>
                </div>
            </div>
        </div>
    );
}