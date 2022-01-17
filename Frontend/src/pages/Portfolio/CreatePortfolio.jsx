import React, { useState } from 'react'
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

    const parseLabel = (text) => {
        const len = text.length;
        setLabelValue(`Characters ${len}/25`);
    }

    return (
        <div className="background-blurrer">
            <div className="create-portfolio-popup">
                <ul className="popup-list">
                <p className="popup-title">Create New Portfolio</p>
                    <input className="app-bar-search" type="text" placeholder="Name" maxLength={25}
                        onChange={(ev) => { parseLabel(ev.target.value); props.setPortfolioName(ev.target.value); }}/>
                    <p className="popup-label">{labelValue}</p>
                    <p style={{marginTop: '20px'}} className="popup-create popup-btn" onClick={props.onConfirm}>Create Portfolio</p>
                    <p className="popup-cancel popup-btn" onClick={props.onCancel}>Cancel</p>
                </ul>
            </div>
        </div>
    );
}

const createPortfolioAddress = `http://${address}:8080/createPortfolio`

export default function CreatePortfolio(props) {
    const [popupActive, setPopupActive] = useState(false);
    const [portfolioName, setPortfolioName] = useState("");

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
        }
        else if(res.status === 5050) {
            console.log("A portfolio already exists");
            props.updateData();
        }
        else 
            res.json().then(result => console.log(result));
    }   

    const createPortfolio = () => {
        fetch(createPortfolioAddress, options)
            .then(res => parseResult(res));
    }

    return (
        <ul className="create-portfolio-container">
            <div className="create-portfolio">
                <p className="title">You don't have a portfolio</p>
                <ButtonCreateNew onClick={() => setPopupActive(true)} />
            </div>
            {popupActive && (<CreatePopup onCancel={() => setPopupActive(false)} onConfirm={createPortfolio} setPortfolioName={setPortfolioName} />)}
        </ul>
    )
}