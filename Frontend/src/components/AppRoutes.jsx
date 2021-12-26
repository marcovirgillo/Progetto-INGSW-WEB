import React, { Component } from 'react'

import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" exact element={<Home />} />
        </Routes>
    )
}