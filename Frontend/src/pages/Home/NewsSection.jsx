import React, { Component, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle';
import { NewsData } from './TestData'

SwiperCore.use([Navigation, Pagination]);

const api_key = "5b515b57ab5945328c3e6b2a0456aded"
const api_url = "https://newsapi.org/v2/everything?domains=cointelegraph.com&pageSize=8&apiKey=" + api_key

export default function NewsSection() {
    const [screenSize, setScreenSize] = useState(null);
    const [numItemNewsPage, setNumItemNewsPage] = useState(3);

    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    });

    useEffect(() => {
        if(screenSize <= 600) 
            setNumItemNewsPage(1);
        
        else if(screenSize > 600 && screenSize <= 800)
            setNumItemNewsPage(2);
        
        else if(screenSize > 800 && screenSize <= 1600) 
            setNumItemNewsPage(3);

        else
            setNumItemNewsPage(4);
        

    }, [screenSize]);

    const fetchData = () => {
        fetch(api_url)
            .then((res) => res.json())
            .then((result) => setNewsData(result["articles"]),
                  (error) => console.log("Error fetching latest news"));
    };

    useEffect(fetchData, []);


    return (
        <React.Fragment>
            <Swiper className="swiper-main" tag="section" wrapperTag="ul" navigation pagination style={{minHeight: '310px'}}
                spaceBetween={40}
                slidesPerView={numItemNewsPage}
            >
            {
                newsData.map((item, val) => (
                    <SwiperSlide key={val} tag="li">
                        <div>
                            <ul>
                                <span style={{marginLeft:'-25px'}}>
                                <a href={item.url}> <img className="news-img" src={item.urlToImage}/> </a>
                                <p className="news-title" style={{marginLeft:"-25px"}}>{item.title}</p>
                                <p className="news-content" style={{marginLeft:"-25px"}}>{item.description}</p>
                                </span>
                            </ul>
                        </div>
                    </SwiperSlide>
                ))
            }
        </Swiper>
      </React.Fragment>
    )
}