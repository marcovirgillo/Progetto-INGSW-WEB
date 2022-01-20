import React, { useEffect, useState } from 'react'
import './Signup.css'
import '../Login/Login.css'
import Checkbox from '@mui/material/Checkbox';
import { blue } from '@mui/material/colors';
import { Link } from 'react-router-dom'
import { address } from '../../assets/globalVar';
import { useNavigate } from "react-router-dom";

const signupAddress = `http://${address}:8080/registration`;

const Signup = () => {
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [passwordInfoActive, setPasswordInfoActive] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    });

    const signUpOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': username,
            'email' : email,
            'password': password,
        }),
    };

    const parseResponse = res => {
        if(res.status === 200) {
            console.log("signup successful");
            navigate("/login");
        }
        else {
            console.log("error during signup");
            res.json().then(result => console.log(result));
        }
    }

    function signupConstraints(){
        if(!termsChecked || username==="" || email==="" || password===""){
            setErrorType("Empty");
            showError();
            return false;
        }
        if(!password.match(/^(?=.*\d)(?=.*[@.?#$%^&+=!])(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
        {
            setErrorType("Invalid");
            showError();
            return false;
        }
        return true;
    }

    const doSignup = () => {
        if(!signupConstraints())
            return;
        fetch(signupAddress, signUpOptions)
            .then(res => parseResponse(res));
    }

    function minHeight(){
        if(screenSize < 600)
            return {minHeight:'100vh'}
    }

    function titleStyle(color){
        if(screenSize < 600)
            if(color === "blue")
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
        if(screenSize < 600 && type === "google")
            return {fontSize:'16px', paddingTop:'5px'};

        if(screenSize < 600 && type === "normal")
            return {fontSize:'16px', paddingTop:'9px'};

        return {fontSize:'18px'};
    }

    function termsStyle(color){
        if(screenSize < 600){
            if(color === "blue")
                return {fontSize:'14px', color:'#32C0FF', cursor:'pointer', display:'flex', flexDirection:'row'}
            else
                return {fontSize:'14px', color:'white'}
        }
        if(color === "blue")
                return {fontSize:'15px', color:'#32C0FF', cursor:'pointer', display:'flex', flexDirection:'row'};
        return {fontSize:'15px', color:'white'};
    }

    const label = { inputProps: { 'aria-label': 'Terms checkbox' } };

    function loginEndingStyle(color){
        if(screenSize < 600)
            if(color === "blue")
                return {color:'#32C0FF', fontSize:'14px', cursor:'pointer', display:'flex', flexDirection:'row'};
            else
                return {color:'white', fontSize:'14px'};
    
        if(color === "blue") return {color:'#32C0FF', fontSize:'16px', cursor:'pointer', display:'flex', flexDirection:'row'};
    
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

    function checkEmailConstraints(ev){
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

    function PasswordInfo(props){
        return(
            <div className={"passwordInfo " + props.class}>
                <div className="requirements" style={{padding:'5px', paddingLeft:'10px', paddingRight:'10px'}}>
                    <div className="pass-requirement">At least <span style={{color:'#32C0FF'}}>1 uppercase</span> letter</div>
                    <div className="pass-requirement">At least <span style={{color:'#32C0FF'}}>1 lowercase</span> letter</div>
                    <div className="pass-requirement">At least <span style={{color:'#32C0FF'}}>1 special character</span> (@ . ? # $ % ^ & + = !)</div>
                    <div className="pass-requirement">At least <span style={{color:'#32C0FF'}}>8 characters</span></div>
                    <div className="pass-requirement">At most <span style={{color:'#32C0FF'}}>40 characters</span></div>
                </div>
            </div>
        )
    } 

    const [errorLabelActive, setErrorLabelActive] = useState(false);
    const [errorType, setErrorType] = useState("");

    const getErrorLabelClassname = () => {
        if(errorLabelActive)
            return "error-label label-active";
        else
            return "error-label";
    }

    const showError = () => {
        setErrorLabelActive(true);
        setTimeout(() => {setErrorLabelActive(false); setErrorType("")}, 3500);
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
                         onKeyPress={(ev) => checkEmailConstraints(ev)} onChange={(ev) => setEmail(ev.target.value)}
                    />
                </div>

                <div style={{paddingTop:'20px'}} />
                <div className="field-title" >
                    <span style={fieldFont()}>Password</span>
                    <img src={require("../../res/logos/info.png")}  alt="google-login" height={22} width={22} style={{paddingLeft:'5px', cursor:'pointer'}}
                         onClick={() => setPasswordInfoActive(!passwordInfoActive)}/> 
                    {
                        passwordInfoActive && (
                            <PasswordInfo class={passwordInfoActive ? "active-info" : ""}/>
                        )
                    }   
                </div>
                <div className="login-field">
                    <input className="login-field-style" type="password" placeholder='At least 8 characters' style={fieldFont()}
                        onChange={(ev) => setPassword(ev.target.value)}
                        onPaste={(ev) => ev.preventDefault()}
                    />
                </div>

                <div style={{paddingTop:'20px'}} />
                <div className="login-field">
                    <span className="login-button-style" style={fieldFont()}>
                        <div onClick={doSignup} className='login-button-text' style={signupButtonTextStyle("normal")}>
                            Get started!
                        </div>
                    </span>
                </div>

                <div style={{paddingTop:'8px'}} />
                <div className="terms-and-conditions">
                    <Checkbox
                        {...label}
                        defaultChecked={false}
                        sx={{
                            color: blue[300],
                            '&.Mui-checked': {
                                color: blue[300],
                            },
                        }}
                        onChange={() => setTermsChecked(!termsChecked)}
                    />
                    <span className="terms-text" style={termsStyle("white")}>I agree on the</span>
                    <span className="terms-text" ><Link to="/termsconditions" style={termsStyle("blue")}>Terms and Conditions</Link></span>

                    {(errorLabelActive === true && <div className={getErrorLabelClassname()}>
                        {errorType === "Empty" ? <p>Error, please check the input fields and retry!</p> : <p>Error, password doesn't match requirements!</p> }
                    </div>)}
                </div>

                <div style={{paddingTop:'20px'}} />
                <div className="signup-ending-list"> 
                    <span className="login-ending" style={loginEndingStyle("white")}>Already a member?</span>
                    <span className="login-ending"><Link to="/login" style={loginEndingStyle("blue")} >Log in!</Link></span>
                </div>
            </div>
        </div>
    )
}

export default Signup
