import React, { Component } from 'react'

export default function ConfirmPopup(props) {
    return (
        <div className="background-blurrer">
            <div className="confirm-popup">
                <ul className="popup-list">
                <p className="popup-title">{props.title}</p>
                    <span className="popup-text">{props.text}</span>
                    <p className="popup-confirm popup-btn" onClick={props.onConfirm}>Confirm</p>
                    <p className="popup-cancel popup-btn" onClick={props.onCancel}>Cancel</p>
                </ul>
            </div>
        </div>
    );
}