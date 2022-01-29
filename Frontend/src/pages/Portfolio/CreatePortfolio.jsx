import React, { useEffect, useState, useRef } from 'react'
import plus_icon from "./../../res/logos/plus.png";

import { address } from '../../assets/globalVar';

function ButtonCreateNew(props) {
    return (
        <div className="create-btn">
            <ul className="create-btn-list" onClick={props.onClick}>
                <img src={plus_icon} width={24} height={24} alt="icon"/>
                <p className="create-btn-label">Create New</p>
            </ul>
        </div>
    );
}

function CreatePopup(props) {
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

    //se cambia lo status code, controllo se devo mostrae errore
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
            <div className="create-portfolio-popup">
                <ul className="popup-list">
                    <p className="popup-title">Create New Portfolio</p>
                    <input ref={inputValue} className="app-bar-search" type="text" placeholder="Name" maxLength={25}
                        onClick={removeErrorLabel}
                        onChange={(ev) => { parseLabel(ev.target.value); props.setPortfolioName(ev.target.value); }}/>
                    <p className="popup-label">{labelValue}</p>
                    {errorLabelActive && (<p className="error-label-create-portfolio">{errorLabelText}</p>)}
                    <p style={{marginTop: '20px'}} className="popup-create popup-btn" onClick={props.onConfirm}>Create Portfolio</p>
                    <p className="popup-cancel popup-btn" onClick={props.onCancel}>Cancel</p>
                </ul>
            </div>
        </div>
    );
}

const createPortfolioAddress = `http://${address}/createPortfolio`

export default function CreatePortfolio(props) {
    const [popupActive, setPopupActive] = useState(false);
    const [portfolioName, setPortfolioName] = useState("");
    const [statusCode, setStatusCode] = useState(200);
    //salvo lo status code in modo che l'altro componente possa mostrare l'errore

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': props.accessToken
        },
        body : JSON.stringify({
            'name': portfolioName
        })
    }

    const parseResult = (res) => {
        if(res.status === 200) {
            props.updateData();
            props.showResultPopup("Portfolio created successfully!");
        }
        else if(res.status === 5050) {
            console.log("A portfolio already exists");
            props.updateData();
        }
    
        setStatusCode(res.status);
    }   

    const createPortfolio = () => {
        setStatusCode(0);

        fetch(createPortfolioAddress, options)
            .then(res => parseResult(res));
    }

    return (
        <ul className="create-portfolio-container">
            <div className="create-portfolio">
                <p className="title">You don't have a portfolio</p>
                <ButtonCreateNew onClick={() => setPopupActive(true)} />
            </div>
            {popupActive && (
                <CreatePopup onCancel={() => setPopupActive(false)} status={statusCode} onConfirm={createPortfolio} setPortfolioName={setPortfolioName} />
            )}
        </ul>
    )
}