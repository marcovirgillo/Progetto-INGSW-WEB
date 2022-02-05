import React, { useEffect } from 'react'
import './AboutUs.css'

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="about-us">
           <div className="paper-gray">
               <div style={{paddingTop:'20px'}} />
                <div className="about-us-div">
                    <img src={require("../../res/logos/aboutUs.png")} /* width={24} height={24} */ alt="about us" className="img404" />
                </div>
                <p className="info-text">CryptoView is a project created by a small group of ambitious developers.<br/>
                                         Our aim is to provide a user-friendly experience towards finding your next cryptocurrency investment. <br/>
                                         We are open to suggestions and would love to expand furthermore, feel free to contact us!</p>
                <div style={{paddingTop:'30px'}} />
                <div className="team">
                    <div class="profile-card">
                        <div class="img">
                            <img src={require("../../res/images/piero.jpg")} /* width={24} height={24} */ alt="404 image" className="img404" />
                        </div>
                        <div class="caption" style={{marginTop:'-20px'}}>
                            <h3>Piero Bassa</h3>
                            <div class="social-links">
                                <a href="https://www.linkedin.com/in/pierobassa/"><img src={require("../../res/logos/linkedin.png")}  alt="twitter-cryptoview" height={32} width={32}/></a>
                            </div>
                        </div>
                    </div>
                    <div class="profile-card">
                        <div class="img">
                            <img src={require("../../res/images/semo.jpg")} /* width={24} height={24} */ alt="404 image" className="img404" />
                        </div>
                        <div class="caption" style={{marginTop:'-20px'}}>
                            <h3>Simone Ventrici</h3>
                            <div class="social-links">
                                <a href="https://www.linkedin.com/in/simone-ventrici-583071224/"><img src={require("../../res/logos/linkedin.png")}  alt="twitter-cryptoview" height={32} width={32}/></a>
                            </div>
                        </div>
                    </div>
                    <div class="profile-card">
                        <div class="img">
                            <img src={require("../../res/images/marco.jpeg")} /* width={24} height={24} */ alt="404 image" className="img404" />
                        </div>
                        <div class="caption" style={{marginTop:'-20px'}}>
                            <h3>Marco Virgillo</h3>
                            <div class="social-links">
                            
                            </div>
                        </div>
                    </div>
                    <div class="profile-card">
                        <div class="img">
                            <img src={require("../../res/images/vinz.jpg")} /* width={24} height={24} */ alt="404 image" className="img404" />
                        </div>
                        <div class="caption" style={{marginTop:'-20px'}}>
                            <h3>Vincenzo Gigliotti</h3>
                            <div class="social-links">
                                <a href="https://www.linkedin.com/in/vincenzo-gigliotti-710236224/"><img src={require("../../res/logos/linkedin.png")}  alt="twitter-cryptoview" height={32} width={32}/></a>
                            </div>
                        </div>
                    </div>
                </div>
           </div>   
        </div>
    )   
}

export default AboutUs
