import React, { Component } from 'react'

import { Route, Routes } from 'react-router-dom'
import { Home, Dashboard, Exchanges, News, Portfolio, Profile, AboutUs, Login, Signup, ForgotPassword } from '../pages'
import OverviewSection from '../pages/Dashboard/OverviewSection'
import SpecificCrypto from '../pages/SpecificCrypto/SpecificCrypto'
import SpecificExchange from '../pages/SpecificExchange/SpecificExchange'

export default function AppRoutes(props) {
    return (
        <Routes>
            <Route path="/" exact element={<Home accessToken={props.accessToken}/>} />
            <Route path="/portfolio" exact element={<Portfolio accessToken={props.accessToken}/>} />
            <Route path="/dashboard" exact element={<Dashboard accessToken={props.accessToken} allCrypto={props.allCrypto} />} />
            <Route path="/news" exact element={<News />} />
            <Route path="/exchanges" exact element={<Exchanges />} />
            <Route path="/profile" exact element={<Profile accessToken={props.accessToken}/>} />
            <Route path="/crypto/:name" exact element={<SpecificCrypto accessToken={props.accessToken} allCrypto={props.allCrypto}/>}/>
            <Route path="/exchange/:name" exact element={<SpecificExchange />} />
            <Route path="/aboutus" exact element={<AboutUs />} />
            <Route path="/login" exact element={<Login setAccessToken={props.setAccessToken}/>} />
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/forgotpassword" exact element={<ForgotPassword />} />
            <Route exact element={<OverviewSection accessToken={props.accessToken}/>} />
        </Routes>
    )
}