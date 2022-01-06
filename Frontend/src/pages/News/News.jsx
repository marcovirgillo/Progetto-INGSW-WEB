import React, { useEffect, useState }  from 'react'
import "./News.css"
import { NewsData } from '../Home/TestData'



const BigNewsBox = (props) => {
    return (
        <div className='big-news-box'>
            <ul className='list-big-news'>
                <img src={props.imagePath} className='big-news-image'/>
                <p className='big-news-title'> {props.title} </p>
                <p className='big-news-description'> {props.content} </p>
            </ul>
        </div>
    );
}

const SideNewsBox = (props) => {
    return (
        <ul className='side-news-container' >
            <ul className='side-news-list'>
                <p className='side-news-title'> {props.title} </p>
                <img src={props.imagePath} className='side-news-image'/>
            </ul>
        </ul>
    );
}


export default function News() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='news-page'>
            <h4 className='popular-news-label'> Popular News</h4>
            <div className='paper-grey-news'>
               
               <BigNewsBox
                    imagePath = {NewsData[0].image}
                    title = {NewsData[0].title}
                    content = {NewsData[0].content}
               />
               
               <SideNewsBox 
                    title = {NewsData[1].title}
                    imagePath = {NewsData[1].image}
               />

            </div>

        </div>
    );
}
