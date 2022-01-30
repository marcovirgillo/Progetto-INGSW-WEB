import React, { useEffect, useState, useRef }  from 'react'
import "./News.css"
import { Grid } from '@mui/material'
import { address } from './../../assets/globalVar.js'
import { RvHookup } from '@mui/icons-material'


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
        <React.Fragment>
            <Grid item className="bottom-news-spacer" sm={1} />
            <Grid item lg={4} md={6} sm={10} xs={12} >
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
            <Grid item className="bottom-news-spacer" sm={1} />
        </React.Fragment>
    );
}

const SearchField = (props) => {

    return (
        <div className="news-search-field">
            <img className="news-search-icon" src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input id='search' className="news-search" type="text" placeholder="Search..." onChange={ (ev) => props.getInput(ev)}/> 
                                            
        </div>
    );
}

const NewsPages = (props) => {
    return (
        <div className='news-pages-container'>
            <ul className='news-pages-list'>
                <p className='news-page-number' onClick={() => props.setCurrentPage(1)}>1</p>
                <p className='news-page-number' onClick={() => props.setCurrentPage(2)}>2</p>
                <p className='news-page-number' onClick={() => props.setCurrentPage(3)}>3</p>
                <p className='news-page-number' onClick={() => props.setCurrentPage(4)}>4</p>
            </ul>
        </div>
    );
}



export default function News() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])


    const [popularNewsData, setPopularNewsData] = useState([]);

    const fetchPopularNews = () => {
        fetch(`https://${address}/popularNews`)
            .then((res) => res.json())
            .then((result) => setPopularNewsData(result),
                  (error) => console.log("Error fetching popular news"));
    };

    const [latestNewsData, setLatestNewsData] = useState([]);

    const fetchAllLatestNews = () => {
        fetch(`https://${address}/allLatestNews`)
            .then((res) => res.json())
            .then((result) => setLatestNewsData(result),
                  (error) => console.log("Error fetching latest news"));
    };

    useEffect(fetchPopularNews, []);
    useEffect(fetchAllLatestNews, []);

    const newsSearched = () => {

        let latestNewsDataCopy = [];
        for(let i = 0; i < latestNewsData.length; ++i) {
            const titleLowerCase = latestNewsData[i].title.toLowerCase();
            const contentLowerCase = latestNewsData[i].content.toLowerCase();

            if(titleLowerCase.includes(searchFieldContent) || contentLowerCase.includes(searchFieldContent))
                latestNewsDataCopy.push(latestNewsData[i]);
        }
        return latestNewsDataCopy;
    }

    const [currentPageSelected, setCurrentPageSelected] = useState(1);
    
    const setCurrentPage = (pageNumber) => {
        setCurrentPageSelected(pageNumber);
    }

    const sliceLatestNewsDataInPages = () => {
        let latestNewsDataCopy = latestNewsData;
        if(currentPageSelected === 1)
            return latestNewsDataCopy.slice(0, 25);
        else if(currentPageSelected === 2)
            return latestNewsDataCopy.slice(25, 50);
        else if(currentPageSelected === 3)
            return latestNewsDataCopy.slice(50, 75);    
        else if(currentPageSelected === 4)
            return latestNewsDataCopy.slice(75, 100);    
    }

    const getLatestNews = () => {
        if(searchFieldContent === "")
            return sliceLatestNewsDataInPages();
        return newsSearched();
    }

    const [searchFieldContent, setSearchFieldContent] = useState("");

    const getInput = (ev) => {
        setSearchFieldContent(ev.target.value);
    }

    return (
        <div className='news-page'>
            
            <div className='paper-grey-news-top'>
                <h4 className='news-label'> Popular News</h4>

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

        
            <SearchField
                getInput = {getInput}
            />

          

            {/*  Standard news */}
            <div className='paper-grey-news-bottom'>
                <h4 className='news-label'> Latest News</h4>
                <Grid container className='container-news-bottom' columnSpacing={4}>  
                    {
                        getLatestNews().map((item, index) => (
                           <StandardNewsBox
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

                {searchFieldContent === "" && <NewsPages
                    setCurrentPage = {setCurrentPage}
                 />}
            </div>
        
        </div>
    );
}
