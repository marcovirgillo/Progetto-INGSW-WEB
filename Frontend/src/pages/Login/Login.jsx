import React, { useEffect, useState } from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import { address } from '../../assets/globalVar'
import { useNavigate } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import ChooseUsername from './ChooseUsername';


const loginLink = `http://${address}:8080/login`;
const loginGoogleLink = `http://${address}:8080/loginGoogle`;


const Login = (props) => {
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorLabelActive, setErrorLabelActive] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [googleUsername, setGoogleUsername] = useState("");
    const [googleId, setGoogleId] = useState("");
    const [email, setEmail] = useState(""); // per login Google
    const [chooseUsernameDivActive, setChooseUsernameDivActive] = useState(false);

    
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

    const loginGoogleOptions = { // per login Google
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': email,
            'google_id': googleId
        }),
    };

    const completeLoginGoogle = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': googleUsername,
            'email': email,
            'google_id': googleId
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
            props.showResultPopup("Login successfull !");
            navigate("/");
        }
        else if(res.status === 401) {
            showError("Error! Invalid combination of username/password");
        }
        else {
            res.json().then((result) => {
                showError("Error, please check the input fields and retry!");
            })
        }
    }

    function checkConstraints(){
        if(username === "" || password === ""){
            showError("Error, some fields are empty! Please retry");
            return false;
        }
        return true;
    }

    const doLogin = () => {
        if(!checkConstraints())
            return;

        fetch(loginLink, loginOptions)
        .then((res) => parseResult(res));
    }

    function titleStyle(color){
        if(screenSize < 600)
            if(color === "blue")
                return {color:'#32C0FF', fontSize:'22px'};
            else
                return {color:'white', fontSize:'22px'};
        
        if(color === "blue") return {color:'#32C0FF'};
        
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

    useEffect(() => {
        if (email !== "") 
            doFirstGoogleLogin();
    }, [email])

    const handleLogin = (googleData) => {
        setGoogleId(googleData.getBasicProfile().getId());
        setEmail(googleData.getBasicProfile().getEmail());
    }

    const handleFailureLogin = (googleData) => {
        console.log("no");
    }

    const parseGoogleResult = res => {
        if(res.status === 200) {
            res.json().then((result) => props.setAccessToken(result['key']));
            props.showResultPopup("Login successfull !");
            navigate("/");
            return;
        }
        if(res.status === 450) {
            setChooseUsernameDivActive(true);
            return;
        }
        else if(res.status === 409) {
            showError("Error! This email is already registered with a non-google account!");
        }

        setEmail("");
    }

    const confirmAccountCreation = () => {
        setChooseUsernameDivActive(false);
        fetch(loginGoogleLink, completeLoginGoogle)
            .then(res => parseResult(res));
    }

    const doFirstGoogleLogin = () => {
        fetch(loginGoogleLink, loginGoogleOptions)
        .then((res) => parseGoogleResult(res));
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
                       type="password" placeholder='At least 8 characters' style={fieldFont()}
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
                    <GoogleLogin className='login-button-style-google'
                        clientId="140222624817-bp2u7f7v2h9f9ofrc9k50naurvh48sgi.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={handleLogin}
                        onFailure={handleFailureLogin}
                        cookiePolicy={'single_host_origin'}
                    />
                    {(errorLabelActive === true && <div className={getErrorLabelClassname()}>
                        <p>{errorMessage}</p> 
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
            {chooseUsernameDivActive && (
                <ChooseUsername 
                    setGoogleUsername={setGoogleUsername} 
                    onConfirm={confirmAccountCreation} 
                    onCancel={() => {setGoogleUsername(""); setEmail(""); setChooseUsernameDivActive(false)}}/>
            )}
        </div>
    )
}

export default Login
