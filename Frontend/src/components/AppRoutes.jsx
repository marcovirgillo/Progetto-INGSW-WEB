import React, { Component } from 'react'

import { Route, Routes } from 'react-router-dom'
import { Home, Dashboard, Exchanges, News, Portfolio, Profile } from '../pages'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/portfolio" exact element={<Portfolio />} />
            <Route path="/dashboard" exact element={<Dashboard />} />
            <Route path="/news" exact element={<News />} />
            <Route path="/exchanges" exact element={<Exchanges />} />
            <Route path="/profile" exact element={<Profile />} />
        </Routes>
    )
}