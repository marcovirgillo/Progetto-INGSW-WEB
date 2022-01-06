import React from 'react'
import "./News.css"
import { NewsData } from '../Home/TestData'


const BigNewsBox = (props) => {
    return (
        <div className='big-news-container'>
            <ul className='big-news-list'>
                <img src={props.imagePath} className='big-news-image'/>
                <p className='big-news-title'> {props.title} </p>
                <p className='big-news-description'> {props.content} </p>
                <p className='big-news-date'> {props.date} </p>
            </ul>
        </div>
    );
}

const SideNewsBox = (props) => {
    return (
        <div className='three-side-news-container'>

            <div className='single-side-news-container'>
                <ul className='single-side-news-list'>
                    <div className='side-news-list-title-date'>
                        <p className='side-news-title'> {props.title} </p>
                        <p className='side-news-date'> {props.date} </p>
                    </div>
                    <img src={props.imagePath} className='side-news-image'/>

                </ul>
            </div>
            
            <div className='single-side-news-container'>
                <ul className='single-side-news-list'>
                    <div className='side-news-list-title-date'>
                        <p className='side-news-title'> {props.title} </p>
                        <p className='side-news-date'> {props.date} </p>
                    </div>
                    <img src={props.imagePath} className='side-news-image'/>

                </ul>
            </div>

            <div className='single-side-news-container'>
                <ul className='single-side-news-list'>
                    <div className='side-news-list-title-date'>
                        <p className='side-news-title'> {props.title} </p>
                        <p className='side-news-date'> {props.date} </p>
                    </div>
                    <img src={props.imagePath} className='side-news-image'/>

                </ul>
            </div>
        </div>
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
                    content = {"Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum "}
                    date = {"06/01/2022"}
               />
              
                <SideNewsBox 
                    title = {"Dirigente di Coinbase: presto arriveranno miglioramenti importanti sulla scalabilità di Ethereum"}
                    imagePath = {NewsData[1].image}
                    date = {"06/01/2022"}
                />

            </div>
        </div>
    );
}
