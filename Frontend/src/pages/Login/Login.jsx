import React, { useEffect, useState } from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import { address } from '../../assets/globalVar'
import { useNavigate } from "react-router-dom";

const loginLink = `http://${address}:8080/login`;

const Login = (props) => {
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

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

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function parseResult(res) {
        if(res.status === 200) {
            res.json().then((result) => props.setAccessToken(result['key']));
            console.log("Accesso effettuato");
            console.log(props);
            navigate("/");
        }
        else {
            res.json().then((result) => {
                setErrorType("Invalid");
                showError();
            })
        }
    }

    function checkConstraints(){
        if(username=="" || password==""){
            setErrorType("Empty");
            showError();
            return false;
        }
        return true;
    }

    const doLogin = () => {
        if(!checkConstraints())
            return;

        console.log("sto loggando!");
        fetch(loginLink, loginOptions)
        .then((res) => parseResult(res));
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
        if(screenSize<600 && type=="google")
            return {fontSize:'16px', paddingTop:'5px'};
        if(screenSize<600 && type=="normal")
            return {fontSize:'16px', paddingTop:'9px'};
        return {fontSize:'18px'};
    }

    function minHeight(){
        if(screenSize<600)
            return {minHeight:'100vh'}
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
        <div className="login">
            <div className="paper-grey" style={minHeight()}>
                <div style={{paddingTop:'30px'}} />
                <div className="login-logo">
                    <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={100} width={100} />
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="login-list"> 
                    <span className="login-header-title" style={titleStyle("blue")}>Log in</span>
                    <span className="login-header-title" style={titleStyle("white")}> to your </span>
                    <span className="login-header-title" style={titleStyle("blue")}>Cryptoview</span>
                </div>
                <div style={{paddingTop:'15px'}} />
                <div> 
                    <span className="login-header-subtitle" style={subtitle()}>Use your credentials that you entered during registration.</span>
                </div>
                <div style={{paddingTop:'20px'}} />

                <span className="field-title" style={fieldFont()}>Your username</span>
                <div className="login-field">
                    <input className="login-field-style" value={username} onKeyPress={(ev) => checkUsernameConstraints(ev)} onChange={(ev) => setUsername(ev.target.value)}
                        onPaste={(ev) => ev.preventDefault()} type="text" placeholder='userexample' style={fieldFont()}/>
                </div>

                <div style={{paddingTop:'20px'}} />
                <div className="field-title">
                    <span style={fieldFont()}>Password</span>
                </div>
                <div className="login-field">
                    <input className="login-field-style" value={password} onChange={(ev) => setPassword(ev.target.value)}
                        onPaste={(ev) => ev.preventDefault()} type="password" placeholder='At least 8 characters' style={fieldFont()}
                    />

                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="login-field">
                    <span className="login-button-style" style={fieldFont()}>
                        <div onClick={doLogin} className='login-button-text' style={loginButtonTextStyle("normal")}>Log in</div>
                    </span>
                </div>
                <div style={{paddingTop:'8px'}} />
                <div className="login-field">
                    <span className="login-button-style-google" style={fieldFont()}>
                        <span className="google-field-list">
                            <img src={require("../../res/logos/google.png")}  alt="google-login" height={25} width={25} style={{paddingTop:'7px'}}/> 
                            <div className='login-button-text-google' style={loginButtonTextStyle("google")}>Log in with Google</div>
                        </span>
                    </span>
                    {(errorLabelActive === true && <div className={getErrorLabelClassname()}>
                        {errorType === "Empty" ? <p>Error, please check the input fields and retry!</p> : <p>Error, invalid combination of username and password!</p> }
                    </div>)}

                </div>

                

                <div style={{paddingTop:'20px'}} />
                <div className="login-ending-list"> 
                    <span className="login-ending" style={loginEndingStyle("white")}>Don't have an account?</span>
                    <span className="login-ending" ><Link to="/signup" style={loginEndingStyle("blue")}>Sign up!</Link></span>
                </div>
                <div style={{paddingTop:'20px'}} />
                <div className="login-ending-list"> 
                    <span className="login-ending"><Link to="/forgotpassword" style={loginEndingStyle("blue")}>Forgot your password?</Link></span>
                </div>
            </div>
        </div>
    )
}

export default Login
