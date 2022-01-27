import React, { Component } from 'react';
import "./ResultPopup.css"

export default function ResultPopup(props) {
    
    const popupClassName = () => {
        let cName = "result-popup ";
        if(props.isActive)
            cName += "result-popup-active";

        return cName;
    }

    return (
        <div className={popupClassName()}>
            <div className="result-wrapper">
                <div className="result-popup-list">
                    <img src={require("../../res/logos/green-tick.png")} alt="tick" width={42} height={42}/>
                    <p>{props.text}</p>
                </div>
            </div>
        </div>
    )
};