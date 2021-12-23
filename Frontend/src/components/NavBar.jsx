import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { PieChartOutlined, AppstoreOutlined, HomeOutlined, ReadOutlined, ProfileOutlined, MenuOutlined } from '@ant-design/icons';
import icon from '../images/logo.png'; 

const NavBar = () => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [screenSize, setScreenSize] = useState(null); //For mobile devices it needs to become a menu

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (screenSize <= 1300) {        
          setActiveMenu(false);
        } 
        else {
          setActiveMenu(true);
        }
      }, [screenSize]); //in the  dependency array I have the screenSize. 
      //when the screen size changes then this useEffect will be called

    return (
        <div className="nav-container">
            <div className="logo-container">
                <Avatar src={icon} size="large" />
                <Typography.Title level={4} className="logo">
                    <Link to="/">CryptoView</Link>
                </Typography.Title>
                <Button className="menu-control-container" type="primary" shape="circle" icon={<MenuOutlined />} size={'large'} onClick={() => setActiveMenu(!activeMenu)} /> {/* Clicking the button shows or hides the menu */}
                
               {/*  <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}> 
                    <MenuOutlined style={{backgroundColor:'black', color:'white'}}/>
                </Button> */}
            </div>
            {activeMenu && ( //If activeMenu is true then I render the menu like this:
                <Menu className='menu'>
                        <Menu.Item style={{marginBottom:'15px'}} icon={<HomeOutlined className='menu-item'/>}>
                            <Link  to="/">Home</Link> 
                        </Menu.Item>

                        <Menu.Item style={{marginBottom:'15px'}} icon={<PieChartOutlined className='menu-item'/>}>
                                <Link to="/portfolio">Portfolio</Link>
                        </Menu.Item>

                        <Menu.Item style={{marginBottom:'15px'}} icon={<AppstoreOutlined className='menu-item'/>}>
                            <Link to="/dashboard">My Dashboard</Link>
                        </Menu.Item>
                        
                        <Menu.Item style={{marginBottom:'15px'}} icon={<ReadOutlined className='menu-item'/>}>
                            <Link to="/news">News</Link>    
                        </Menu.Item>

                        <Menu.Item style={{marginBottom:'15px'}} icon={<ProfileOutlined className='menu-item'/>}>
                            <Link to="/exchanges">Exchanges</Link>    
                        </Menu.Item>
                </Menu> 
            )}
            
        </div>
    );
}

export default NavBar
