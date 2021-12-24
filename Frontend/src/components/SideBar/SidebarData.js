import React from 'react'
import { Icon } from '@mui/material'

export const SidebarData = [
    {
        title: "Home",
        icon: <img src={require("../../res/logos/home.png")} height={24} width={24}/>,
        blueIcon: <img src={require("../../res/logos/homeBlue.png")} height={24} width={24}/>,
        link: "/home"
    },
    {
        title: "Portfolio",
        icon:  <img src={require("../../res/logos/portfolio.png")} height={24} width={24}/>,
        blueIcon: <img src={require("../../res/logos/portfolioBlue.png")} height={24} width={24}/>,
        link: "/portfolio"
    },
    {
        title: "Dashboard",
        icon: <img src={require("../../res/logos/dashboard.png")} height={24} width={24}/>,
        blueIcon:  <img src={require("../../res/logos/dashboardBlue.png")} height={24} width={24}/>,
        link: "/dashboard"
    },
    {
        title: "News",
        icon: <img src={require("../../res/logos/news.png")} height={24} width={24}/>,
        blueIcon:  <img src={require("../../res/logos/newsBlue.png")} height={24} width={24}/>,
        link: "/news"
    },
    {
        title: "Exchanges",
        icon: <img src={require("../../res/logos/exchange.png")} height={24} width={24}/>,
        blueIcon:  <img src={require("../../res/logos/exchangeBlue.png")} height={24} width={24}/>,
        link: "/exchanges"
    }
]

