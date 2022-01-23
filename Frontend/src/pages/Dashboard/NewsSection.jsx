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
            <div className='single-side-news-container' style={{marginBottom: "20px"}}>
                <ul className='single-side-news-list'>
                    <p className='side-news-title'> {props.title} </p>
                    <p className='side-news-content'> {props.content} </p>
                    <p className='side-news-date'> {props.publishedAt} </p>
                </ul>
            </div>
        </a>
    );
}

const getNewsURL = `http://${address}:8080/getPreferredNews`;

export default function NewsSection(props) {    
    
    const [newsData, setNewsData] = useState([]);

    const optionsPreferences = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    }

    const fetchPopularNews = () => {
        if(props.preferred === undefined || props.preferred.length === 0 || props.accessToken === "" || props.accessToken === null){
            setNewsData([]);
            return;
        }

        fetch(getNewsURL, optionsPreferences)
            .then(res => {processPreferences(res)});
    };

    const processPreferences = res => {
        if(res.status === 200) {
            res.json()
                .then((result) => {setNewsData(result.news)},
                      (error) => console.log(error));
        }
        else if(res.status === 6001) {
            console.log("No news preferences found");
        }
    }

    useEffect(fetchPopularNews, [props.preferred]);

    return (
        <div className='dashboard-news'>
            <h4 className='favourite-assets-news-label'> Favourite asset's news</h4>

            <div className='container-news-top'>
                {/* Single big news*/}
                { newsData.length !== 0 && (
                    (newsData.slice(0, 1)).map((item, index) => (
                        <BigNewsBox

                            key = {index}
                            imagePath = {item.urlToImage}
                            title = {item.title}
                            content = {item.description}
                            publishedAt = {item.publishedAt}
                            url = {item.url}
                        />
                    ))
                )
                }


            
                {/* Three side news*/}
                <div className='three-side-news-container'>
                    <div className='scrollable-side-news-container'>
                    { newsData.length !== 0 && (
                        (newsData.slice(1, 10)).map((item, index) => (
                            <SideNewsBox
                                key = {index}
                                title = {item.title}
                                content = {item.description}
                                publishedAt = {item.publishedAt}
                                url = {item.url}
                            />
                        ))
                     )
                    }
                    </div>
                </div>
            </div>
        </div>            
    );
}
