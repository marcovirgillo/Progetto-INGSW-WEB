import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined } from '@ant-design/icons';

import icon from '../images/logo-glow-rsz.png';

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
        if (screenSize <= 768) {        
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
                <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}> {/* Clicking the button shows or hides the menu */}
                    <MenuOutlined />
                </Button>
            </div>
            {activeMenu && ( //If activeMenu is true then I render the menu like this:
                <Menu theme="dark">
                <Menu.Item icon={<HomeOutlined />}>
                    <Link to="/">Home</Link> 
                </Menu.Item>

                <Menu.Item icon={<FundOutlined />}>
                    <Link to="/cryptocurrencies">Cryptocurrencies</Link>
                </Menu.Item>

                <Menu.Item icon={<MoneyCollectOutlined />}>
                    <Link to="/exchanges">Exchanges</Link>
                </Menu.Item>
                
                <Menu.Item icon={<BulbOutlined />}>
                    <Link to="/news">News</Link>
                </Menu.Item>
            </Menu>
            )}
            
        </div>
    );
}

export default NavBar
