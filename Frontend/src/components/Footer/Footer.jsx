import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {

    return (
        <div className='footer'>
            <div style={{paddingTop:'20px'}} />
            <div className="footer-title">
                <div className="footer-logo">
                    <div className="footer-logo-list">
                        <img src={require("../../res/logos/CryptoViewLogo.png")}  alt="logo-cryptoview" height={80} width={80} /> 
                        <div className="sidebar-logo-text"> <Link to="">CryptoView</Link> </div>
                    </div>
                </div>
            </div>
            <div style={{paddingTop:'20px'}} />
            <div className="footer-pages">
                <div className="footer-list-pages">
                    <span className="footer-list-pages" style={{marginLeft:'20px', marginRight:'20px'}}>
                        <Link to=""><span className="footer-pages-text" style={{cursor:'pointer'}}>Home</span></Link>
                        <Link to="/portfolio"><span className="footer-pages-text" style={{cursor:'pointer'}}>Portfolio</span></Link>
                        <Link to="/dashboard"><span className="footer-pages-text" style={{cursor:'pointer'}}>My Dashboard</span></Link>
                        <Link to="/news"><span className="footer-pages-text" style={{cursor:'pointer'}}>News</span></Link>
                        <Link to="/exchanges"><span className="footer-pages-text" style={{cursor:'pointer'}}>Exchanges</span></Link>
                        <Link to="/aboutus"><span className="footer-pages-text" style={{cursor:'pointer'}}>About us</span></Link>
                    </span>
                </div>
            </div>
            <div style={{paddingTop:'20px'}} />
            <div className="footer-socials">
                <div className="footer-list">
                    <a href="https://twitter.com/CryptoView__">
                        <img src={require("../../res/logos/twitter-social.png")}  alt="twitter-cryptoview" height={32} width={32}/> 
                    </a>
                    <a href="https://www.instagram.com/cryptoview_/ ">
                        <img src={require("../../res/logos/instagram-social.png")}  alt="instagram-cryptoview" height={32} width={32} style={{marginLeft:'10px'}}/> 
                    </a>
                    <a href="https://www.paypal.me/CryptoView">
                        <img src={require("../../res/logos/paypal.png")}  alt="paypal-cryptoview" height={32} width={32} style={{marginLeft:'10px'}}/> 
                    </a>
                </div>
            </div>
            <div style={{paddingTop:'20px'}} />
            <div className="footer-rights">    
                <div className="footer-list-rights">
                    <span className="footer-rights-text" style={{color:'white'}}>© All rights reserved.</span>
                    <span className="footer-rights-text">Cryptoview 2022</span>
                </div>
            </div>
            <div style={{paddingTop:'20px'}} />
        </div>
    )
}

export default Footer
