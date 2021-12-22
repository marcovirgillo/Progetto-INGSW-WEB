import React from 'react'
import { Icon } from '@mui/material'

export const SidebarData = [
    {
        title: "Home",
        icon: <Icon>
                <img src={require("../logos/Home.png")} height={24} width={24}/>
              </Icon>,
        blueIcon: <Icon>
                    <img src={require("../logos/homeBlue.png")} height={24} width={24}/>
                </Icon>,
        link: "/home"
    },
    {
        title: "Portfolio",
        icon: <Icon>
                <img src={require("../logos/Portfolio.png")} height={24} width={24}/>
              </Icon>,
        blueIcon: <Icon>
                    <img src={require("../logos/Portfolio.png")} height={24} width={24}/>
                </Icon>,
        link: "/portfolio"
    },
    {
        title: "Dashboard",
        icon: <Icon>
                <img src={require("../logos/Dashboard.png")} height={24} width={24}/>
              </Icon>,
        blueIcon: <Icon>
                       <img src={require("../logos/dashboardBlue.png")} height={24} width={24}/>
                    </Icon>,
        link: "/dashboard"
    },
    {
        title: "News",
        icon: <Icon>
                <img src={require("../logos/News.png")} height={24} width={24}/>
              </Icon>,
        blueIcon: <Icon>
                    <img src={require("../logos/newsBlue.png")} height={24} width={24}/>
                </Icon>,
        link: "/news"
    },
    {
        title: "Exchanges",
        icon: <Icon>
                <img src={require("../logos/Exchanges.png")} height={24} width={24}/>
              </Icon>,
        blueIcon: <Icon>
                    <img src={require("../logos/exchangeBlue.png")} height={24} width={24}/>
                </Icon>,
        link: "/exchanges"
    }
]

