import React, { useEffect, useState }  from 'react'
import { address } from './../../assets/globalVar.js'
import "./Dashboard.css";

const BigNewsBox = (props) => {
    return (
        <a href={props.url} className='big-news-container' >
            <div >
                <ul className='big-news-list'>
                    <img src={props.imagePath} className='big-news-image'/>
                    <p className='big-news-title'> {props.title} </p>
                    <p className='big-news-content'> {props.content} </p>
                    <p className='big-news-date'> {props.publishedAt} </p>
                </ul>
            </div>
        </a>
    );
}

const SideNewsBox = (props) => {
    return (
        <a href={props.url} >
            <div className='single-side-news-container'>
                <ul className='single-side-news-list'>
                    <p className='side-news-title'> {props.title} </p>
                    <p className='side-news-date'> {props.publishedAt} </p>
                </ul>
                <img src={props.imagePath} className='side-news-image'/>
            </div>
        </a>
    );
}


export default function NewsSection() {    
    
    const [popularNewsData, setPopularNewsData] = useState([]);

    const fetchPopularNews = () => {
        fetch(`http://${address}:8080/popularNews`)
            .then((res) => res.json())
            .then((result) => setPopularNewsData(result),
                  (error) => console.log("Error fetching popular news"));
    };

    useEffect(fetchPopularNews, []);

    return (
        <div className='dashboard-news-container'>
            <h4 className='favourite-assets-news-label'> Favourite asset's news</h4>

            <div className='container-news-top'>
                {/* Single big news*/}
                {
                    (popularNewsData.slice(0, 1)).map((item, index) => (
                        <BigNewsBox

                            key = {index}
                            imagePath = {item.imageUrl}
                            title = {item.title}
                            content = {item.content}
                            publishedAt = {item.publishedAt}
                            url = {item.url}
                        />
                    ))
                }


            
                {/* Three side news*/}
                <div className='three-side-news-container'>
                    {
                        (popularNewsData.slice(1, popularNewsData.length)).map((item, index) => (
                            <SideNewsBox
                                key = {index}
                                title = {item.title}
                                imagePath = {item.imageUrl}
                                publishedAt = {item.publishedAt}
                                url = {item.url}
                                
                            />
                        ))
                    }
                </div>
            </div>
        </div>            
    );
}
