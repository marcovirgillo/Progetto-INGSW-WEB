import React, {useEffect} from 'react';
import './Page404.css'
import { Link } from 'react-router-dom'

const Page404 = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="page404"> 
      <div className="paper-gray">
        <div style={{paddingTop:'20px'}} />
        <div className="img-container">
          <img src={require("../../res/logos/404.png")} /* width={24} height={24} */ alt="404 image" className="img404" />
        </div>
        <div className="home-btn-div">
          <p className='home-btn container-title' style={{marginLeft:'10px', cursor:'pointer'}}>
            <img src={require("../../res/logos/home.png")} width={26} height={26} style={{marginRight:'10px'}}/>
            <span className="list-title-crypto" style={{marginBottom:'2px'}}><Link to="/">Back to Home</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page404;
