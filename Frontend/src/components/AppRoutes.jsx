import React, { Component } from 'react'

import { Route, Routes } from 'react-router-dom'
import { Home, Dashboard, Exchanges, News, Portfolio, Profile, AboutUs, Login, Signup } from '../pages'
import SpecificCrypto from '../pages/SpecificCrypto/SpecificCrypto'
import SpecificExchange from '../pages/SpecificExchange/SpecificExchange'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/portfolio" exact element={<Portfolio />} />
            <Route path="/dashboard" exact element={<Dashboard />} />
            <Route path="/news" exact element={<News />} />
            <Route path="/exchanges" exact element={<Exchanges />} />
            <Route path="/profile" exact element={<Profile />} />
            <Route path="/crypto/:name" exact element={<SpecificCrypto />} />
            <Route path="/exchange/:name" exact element={<SpecificExchange />} />
            <Route path="/aboutus" exact element={<AboutUs />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
        </Routes>
    )
}