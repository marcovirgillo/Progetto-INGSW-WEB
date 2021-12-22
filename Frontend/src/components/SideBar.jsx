import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, ImageListItem, Icon, ImageList } from '@mui/material';
import React, { Component } from 'react';
import { SidebarData} from './SidebarData'

import "./SideBar.css"

export default class SideBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //buttons: ['Home', 'Portfolio', 'Dashboard', 'News', 'Exchanges']
        }
    };

    render() { 
       return(
           <div className="sideBar">
               <List sx={{paddingLeft: '25px', paddingRight: '25px'}} className="sideBarList">
                   <List sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <ImageListItem key="logo" className="logo" >
                                <img src={require("../images/logo.png")} 
                                    alt="CryptoView logo"
                                    style={{
                                        borderRadius: 50,
                                        height: '90%',
                                        width: '90%',
                                    }}
                                />
                        </ImageListItem>
                        <ListItemText sx={{color:'white'}}>
                            CryptoView
                        </ListItemText>
                    </List>
               {SidebarData.map((val, key) => {
                   let isActive = window.location.pathname == val.link;
                   return(
                       <ListItem sx={{marginBottom: '10px'}} className="listRow"  key={key} 
                                 onClick={() => { window.location.pathname = val.link}}
                                 id={isActive ? "Active" : ""}>
                           <ListItemIcon >
                               {isActive ? val.blueIcon : val.icon}
                           </ListItemIcon>
                           <ListItemText sx={{color: isActive ? '#32C0FF' : 'white', maxWidth: 100}}>
                               {val.title}
                           </ListItemText>
                        </ListItem>
                   );
               })}
               </List>

            </div>
       );
    }
}