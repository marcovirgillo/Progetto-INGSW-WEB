import React, { useEffect, useState } from 'react'
import './Signup.css'
import '../Login/Login.css'
import Checkbox from '@mui/material/Checkbox';
import { blue } from '@mui/material/colors';
import { Link } from 'react-router-dom'

const Signup = () => {
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    });

    function minHeight(){
        if(screenSize<600)
            return {minHeight:'100vh'}
    }

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

    function signupButtonTextStyle(type){
        if(screenSize<600 && type=="google")
            return {fontSize:'16px', paddingTop:'5px'};
        if(screenSize<600 && type=="normal")
            return {fontSize:'16px', paddingTop:'9px'};
        return {fontSize:'18px'};
    }

    function termsStyle(color){
        if(screenSize<600){
            if(color=="blue")
                return {fontSize:'14px', color:'#32C0FF', cursor:'pointer', display:'flex', flexDirection:'row'}
            else
                return {fontSize:'14px', color:'white'}
        }
        if(color=="blue")
                return {fontSize:'15px', color:'#32C0FF', cursor:'pointer', display:'flex', flexDirection:'row'};
        return {fontSize:'15px', color:'white'};
    }

    const label = { inputProps: { 'aria-label': 'Terms checkbox' } };

    function loginEndingStyle(color){
        if(screenSize<600)
            if(color==="blue")
                return {color:'#32C0FF', fontSize:'14px', cursor:'pointer', display:'flex', flexDirection:'row'};
            else
                return {color:'white', fontSize:'14px'};
    
        if(color==="blue") return {color:'#32C0FF', fontSize:'16px', cursor:'pointer', display:'flex', flexDirection:'row'};
    
        return {color:'white', fontSize:'16px'};
    }

    function isCharacterALetter(char) {
        return (/[a-zA-Z]/).test(char)
    }

    function checkUsernameConstraints(ev){
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

    return (
        <div className="registration">
            <div className="paper-grey" style={minHeight()}>
                <div style={{paddingTop:'30px'}} />
                <div className="login-logo">
                    <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={100} width={100} />
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="login-list"> 
                    <span className="signup-header-title" style={titleStyle("blue")}>Sign up</span>
                    <span className="signup-header-title" style={titleStyle("white")}> to your </span>
                    <span className="signup-header-title" style={titleStyle("blue")}>Cryptoview</span>
                </div> 
                <div style={{paddingTop:'15px'}} />
                <div> 
                    <span className="login-header-subtitle" style={subtitle()}>We need a few details to create your CryptoView account!</span>
                </div>
                <div style={{paddingTop:'20px'}} />
                <span className="field-title" style={fieldFont()}>Your username</span>
                <div className="login-field">
                    <input className="login-field-style" type="text" placeholder='userexample' style={fieldFont()}
                        onKeyPress={(ev) => checkUsernameConstraints(ev)} onChange={(ev) => setUsername(ev.target.value)}
                        onPaste={(ev) => ev.preventDefault()}
                    />
                </div>
                <div style={{paddingTop:'20px'}} />
                <span className="field-title" style={fieldFont()}>Your email</span>
                <div className="login-field">
                    <input className="login-field-style" type="text" placeholder='name@domain' style={fieldFont()}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                </div>
                <div style={{paddingTop:'20px'}} />
                <span className="field-title" style={fieldFont()}>Password</span>
                <div className="login-field">
                    <input className="login-field-style" type="password" placeholder='At least 8 characters' style={fieldFont()}
                        onChange={(ev) => setPassword(ev.target.value)}
                        onPaste={(ev) => ev.preventDefault()}
                    />
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="login-field">
                    <span className="login-button-style" style={fieldFont()}>
                        <div className='login-button-text' style={signupButtonTextStyle("normal")}>Get started!</div>
                    </span>
                </div>
                <div style={{paddingTop:'8px'}} />
                <div className="terms-and-conditions">
                    <Checkbox
                        {...label}
                        defaultChecked
                        sx={{
                        color: blue[300],
                        '&.Mui-checked': {
                            color: blue[300],
                        },
                        }}
                    />
                    <span className="terms-text" style={termsStyle("white")}>I agree on the</span>
                    <span className="terms-text" ><Link to="/termsconditions" style={termsStyle("blue")}>Terms and Conditions</Link></span>
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="signup-ending-list"> 
                    <span className="login-ending" style={loginEndingStyle("white")}>Already a member?</span>
                    <span className="login-ending"><Link to="/login" style={loginEndingStyle("blue")} /* onClick={() => } */>Log in!</Link></span>
                </div>
            </div>
        </div>
    )
}

export default Signup
