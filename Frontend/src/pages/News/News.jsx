import React, { useEffect, useState }  from 'react'
import "./News.css"
import { NewsData } from '../Home/TestData'
import { Grid, Icon } from '@mui/material'



const BigNewsBox = (props) => {
    return (
        <div className='big-news-container'>
            <ul className='big-news-list'>
                <img src={props.imagePath} className='big-news-image'/>
                <p className='big-news-title'> {props.title} </p>
                <p className='big-news-content'> {props.content} </p>
                <p className='big-news-date'> {props.date} </p>
            </ul>
        </div>
    );
}

const SideNewsBox = (props) => {
    return (
        <div className='single-side-news-container'>
            <ul className='single-side-news-list'>
                <p className='side-news-title'> {props.title} </p>
                <p className='side-news-date'> {props.date} </p>
            </ul>
            <img src={props.imagePath} className='side-news-image'/>
        </div>
    );
}

const StandardNewsBox = (props) => {
    return (
        <Grid item lg={4} md={6} sm={12} xs={12}>
            <div className='standard-news-container'>
                <ul className='standard-news-list-title-content'>
                    <p className='standard-news-title'> {props.title} </p>
                    <img src={props.imagePath} className='standard-news-image'/>
                </ul>
                
                <ul className='standard-news-list-content-date'>
                    <p className='standard-news-content'> {props.content} </p>
                    <p className='standard-news-date'> {props.date} </p>
                </ul>
            </div>
        </Grid>
    );
}



export default function News() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <div className='news-page'>
            <h4 className='popular-news-label'> Popular News</h4>
            <div className='paper-grey-news-top'>
               
               {/* Single big news*/}
               {
                    NewsData.map((item, index) => (
                        (index == 0) && (<BigNewsBox

                            key = {index}
                            imagePath = {item.image}
                            title = {item.title}
                            content = {item.content}
                            date = {"06/01/2022"}
                        />)
                    ))
               }


               
              {/* Three side news*/}
              <div className='three-side-news-container'>
                    {
                        NewsData.map((item, index) => (
                            (index > 0 && index < 4) && (<SideNewsBox
                                key = {index}
                                title = {item.title}
                                imagePath = {item.image}
                                date = {"06/01/2022"}
                            />)
                        ))
                    } 
                </div>

            </div>



            {/* Standard news*/}
            <Grid container className='paper-grey-news-bottom' columnSpacing={4}>  
                {
                    NewsData.map((item, index) => (
                        (index >= 4) && (<StandardNewsBox
                            key = {index}
                            imagePath = {item.image}
                            title = {item.title}
                            content = {item.content}
                            date = {"06/01/2022"} 
                        />)
                    ))
                }  
            </Grid>

        </div>
    );
}
