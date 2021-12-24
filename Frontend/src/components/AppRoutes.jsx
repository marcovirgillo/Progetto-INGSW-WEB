import React, { Component } from 'react'

import { Route, Routes } from 'react-router-dom'
import SideBar from './SideBar/SideBar'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<div></div>}/>
            {/*<Route path="/portfolio" element={Portfolio}/>*/}
        </Routes>
    )
}