import React, { useEffect, useState }  from 'react'
import "./News.css"
import { Grid } from '@mui/material'
import { address } from './../../assets/globalVar.js'


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

const StandardNewsBox = (props) => {
    return (  
        <Grid item lg={4} md={6} sm={12} xs={12} >
            <a href={props.url}>
                <div className='standard-news-container'>
                    <ul className='standard-news-list-title-content'>
                        <p className='standard-news-title'> {props.title} </p>
                        <img src={props.imagePath} className='standard-news-image'/>
                    </ul>
                    
                    <ul className='standard-news-list-content-date'>
                        <p className='standard-news-content'> {props.content} </p>
                        <p className='standard-news-date'> {props.publishedAt} </p>
                    </ul>
                </div>
            </a>
        </Grid>
    );
}

const SearchField = (props) => {
    const onNewsPage = window.location.pathname === `/news`;
    return (
        <div className="news-search-field">
            <img className="news-search-icon" src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="news-search" type="text" placeholder="Cerca.." onChange={(ev) => props.getSearchFieldContent(ev.target.value)} onBlur={(ev) => { if(onNewsPage == false) ev.target.value = "";}} />
        </div>
    );
}



export default function News() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])


    const [popularNewsData, setPopularNewsData] = useState([]);

    const fetchPopularNews = () => {
        fetch(`http://${address}:8080/popularNews`)
            .then((res) => res.json())
            .then((result) => setPopularNewsData(result),
                  (error) => console.log("Error fetching popular news"));
    };

    const [latestNewsData, setLatestNewsData] = useState([]);

    const fetchAllLatestNews = () => {
        fetch(`http://${address}:8080/allLatestNews`)
            .then((res) => res.json())
            .then((result) => setLatestNewsData(result),
                  (error) => console.log("Error fetching latest news"));
    };

    useEffect(fetchPopularNews, []);
    useEffect(fetchAllLatestNews, []);

 
    
    const containsText = (title, content, text) => {
        let titleLowerCase = title.toLowerCase();
        let contentLowerCase = content.toLowerCase();
        if(titleLowerCase.includes(searchFieldContent) || contentLowerCase.includes(searchFieldContent))
            return true;
        return false;
    }

    const getSearchFieldContent = (value) => {
        let trimmedValue = value.trim();
        setSearchFieldContent(trimmedValue.toLowerCase());
    }

    const [searchFieldContent, setSearchFieldContent] = useState("");
    

    return (
        <div className='news-page'>
            
            <div className='paper-grey-news-top'>
                <h4 className='news-label'> Popular News</h4>

                <div className='container-news-top'>
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
                    <div className='three-side-news-container'>
                        {
                            popularNewsData.map((item, index) => (
                                (index > 0) && (<SideNewsBox
                                    key = {index}
                                    title = {item.title}
                                    imagePath = {item.imageUrl}
                                    publishedAt = {item.publishedAt}
                                    url = {item.url}
                                    
                                />)
                            ))
                        }
                    </div>
                </div>

            </div>


        
            <SearchField
                getSearchFieldContent = {getSearchFieldContent}
            />

          

            {/*  Standard news */}
            <div className='paper-grey-news-bottom'>
                <h4 className='news-label'> Latest News</h4>
                <Grid container className='container-news-bottom' columnSpacing={4}>  
                    {
                        latestNewsData.map((item, index) => (
                            (containsText(item.title, item.content)) && <StandardNewsBox
                                key = {index}
                                title = {item.title}
                                imagePath = {item.imageUrl}
                                content = {item.content}
                                publishedAt = {item.publishedAt}
                                url = {item.url}
                                
                            />
                        ))
                    }  
                </Grid>  
            </div>
        
        </div>
    );
}
