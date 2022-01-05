import React from 'react'
import "./News.css"
import { NewsData } from '../Home/TestData'


const BigNewsBox = (props) => {
    return (
        <ul className='big-news-list'>
            <img src={props.imagePath} className='big-news-image'/>
            <p className='big-news-title'> {props.title} </p>
            <p className='big-news-description'> {props.content} </p>
        </ul>
    );
}

const SideNewsBox = (props) => {
    return (
        <ul className='side-news-list'>
            <p className='side-news-title'> {props.title} </p>
            <img src={props.imagePath} className='side-news-image'/>
        </ul>
    );
}


export default function News() {
    return (
        <div className='news-page'>
            <h4 className='popular-news-label'> Popular News</h4>
            <div className='paper-grey-news'>
               
               <BigNewsBox
                    imagePath = {NewsData[0].image}
                    title = {NewsData[0].title}
                    content = {NewsData[0].content}
               />
               
               <div className='side-news-box-container'>
                <SideNewsBox 
                        title = {"Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum"}
                        imagePath = {NewsData[1].image}
                />
                <SideNewsBox 
                    title = {"Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum"}
                    imagePath = {NewsData[1].image}
                />
                <SideNewsBox 
                    title = {"Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum"}
                    imagePath = {NewsData[1].image}
                />
                </div>

            </div>

        </div>
    );
}
