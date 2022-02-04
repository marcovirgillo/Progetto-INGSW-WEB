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
                    <img src={require("../../res/logos/aboutUs.png")} /* width={24} height={24} */ alt="404 image" className="img404" />
                </div>
                <p className="info-text">CryptoView is a project created by a small group of ambitious developers.<br/>
                                         Our aim is to provide a user-friendly experience towards finding your next cryptocurrency investment. <br/>
                                         We are open to suggestions and would love to expand furthermore, feel free to contact us!</p>
           </div>   
        </div>
    )   
}

export default AboutUs
