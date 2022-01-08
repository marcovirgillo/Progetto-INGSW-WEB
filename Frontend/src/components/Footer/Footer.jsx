import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = (props) => {

    return (
        <div className='footer'>
            <div className="footer-title">
                <div className="footer-logo">
                    <div className="footer-logo-list">
                        <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={80} width={80} /> 
                        <div className="sidebar-logo-text"> <Link to="">CryptoView</Link> </div>
                    </div>
                </div>
            </div>
            <div className="footer-pages">
                <span>Home</span>
                <span>My Dashboard</span>
                <span>Portfolio</span>
            </div>
            <div style={{paddingTop:'20px'}} />
            <div className="footer-socials">
                <div className="footer-list">
                    <img src={require("../../res/logos/twitter-social.png")}  alt="twitter-cryptoview" height={32} width={32}/> 
                    <img src={require("../../res/logos/instagram-social.png")}  alt="instagram-cryptoview" height={32} width={32} style={{marginLeft:'10px'}}/> 
                    <img src={require("../../res/logos/paypal.png")}  alt="paypal-cryptoview" height={32} width={32} style={{marginLeft:'10px'}}/> 
                </div>
            </div>
            <div className="footer-rights">
                
            </div>
        </div>
    )
}

export default Footer
