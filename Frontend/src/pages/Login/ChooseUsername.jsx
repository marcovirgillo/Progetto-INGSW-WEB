import React, { useState, useRef, useEffect } from 'react';


function ChooseUsername(props) {
    const [labelValue, setLabelValue] = useState("Characters 0/25");
    const [errorLabelActive, setErrorLabelActive] = useState(false);
    const [errorLabelText, setErrorLabeltext] = useState(false);

    const inputValue = useRef(null);

    const parseLabel = (text) => {
        const len = text.length;
        setLabelValue(`Characters ${len}/25`);
    }

    const showError = (msg) => {
        setErrorLabeltext(msg);
        setErrorLabelActive(true);

        if(inputValue.current !== null) {
            inputValue.current.style.border = "2px solid red";
        }
    }

    const removeErrorLabel = () => {
        setErrorLabelActive(false);

        if(inputValue.current !== null) {
            inputValue.current.style.border = "2px solid transparent";
        }
    }

    //se cambia lo status code, controllo se devo mostrare errore
    useEffect(() => {
        if(props.status === 5020)
            showError("The name is not valid!");
        else if(props.status === 5000)
            showError("Server error, please retry!");
        else
            setErrorLabelActive(false);

    }, [props.status]);

    return (
        <div className="background-blurrer">
            <div className="choose-username-popup">
                <ul className="popup-list">
                    <p className="popup-title">Choose Account Username</p>
                    <input ref={inputValue} className="app-bar-search" type="text" placeholder="Name" maxLength={25}
                        onClick={removeErrorLabel}
                        onChange={(ev) => { parseLabel(ev.target.value); props.setGoogleUsername(ev.target.value); }}/>
                    <p className="popup-label">{labelValue}</p>
                    {errorLabelActive && (<p className="error-label-create-portfolio">{errorLabelText}</p>)}
                    <p style={{marginTop: '20px'}} className="popup-create popup-btn" onClick={props.onConfirm}>Create Account</p>
                    <p className="popup-cancel popup-btn" onClick={props.onCancel}>Cancel</p>
                </ul>
            </div>
        </div>
    );
}

export default ChooseUsername;