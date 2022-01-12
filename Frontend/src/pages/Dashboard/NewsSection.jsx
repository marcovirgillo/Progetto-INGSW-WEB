import React, { useEffect, useState }  from 'react'
import { address } from './../../assets/globalVar.js'
import "./Dashboard.css";

const BigNewsBox = (props) => {
    return (
        <a href={props.url} className='dashboard-big-news-container' >
            <div >
                <ul className='dashboard-big-news-list'>
                    <div className='dashboard-big-news-image-container'>
                        <img src={props.imagePath} className='dashboard-big-news-image'/>
                    </div>
                    <p className='dashboard-big-news-title'> {props.title} </p>
                    <p className='dashboard-big-news-content'> {props.content} </p>
                    <p className='dashboard-big-news-date'> {props.publishedAt} </p>
                </ul>
            </div>
        </a>
    );
}

const SideNewsBox = (props) => {
    return (
        <a href={props.url} >
            <div className='dashboard-single-side-news-container'>
                <ul className='dashboard-single-side-news-list'>
                    <p className='dashboard-side-news-title'> {props.title} </p>
                    <p className='dashboard-side-news-content'> {props.content} </p>
                    <p className='dashboard-side-news-date'> {props.publishedAt} </p>
                </ul>
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
            
        <div >
            <h4 className='favourite-assets-news-label'> Favourite asset's news</h4>

            <div className='dashboard-container-news'>
                {/* Single big news*/}
                {
                    popularNewsData.map((item, index) => (
                        (index == 0) && (<BigNewsBox

                            key = {index}
                            imagePath = {item.imageUrl}
                            title = {item.title}
                            content = {item.content}
                            publishedAt = {item.publishedAt}
                            url = {item.url}
                        />)
                    ))
                }


            
                {/* Three side news*/}
                <div className='dashboard-three-side-news-container'>
                    {
                        popularNewsData.map((item, index) => (
                            (index > 0) && (<SideNewsBox
                                key = {index}
                                title = {item.title}
                                content = {item.content}
                                publishedAt = {item.publishedAt}
                                url = {item.url}
                                
                            />)
                        ))
                    }
                </div>
            </div>

        </div>

    );
}
