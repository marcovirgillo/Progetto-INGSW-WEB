import React, { Component, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle';
import { address } from './../../assets/globalVar.js';

SwiperCore.use([Navigation, Pagination]);

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
        
        else if(screenSize > 600 && screenSize <= 1000)
            setNumItemNewsPage(2);
        
        else if(screenSize > 1000 && screenSize <= 1680) 
            setNumItemNewsPage(3);

        else
            setNumItemNewsPage(4);
        

    }, [screenSize]);

    const fetchData = () => {
        fetch(`http://${address}:8080/latestNews`)
            .then((res) => res.json())
            .then((result) => setNewsData(result),
                  (error) => console.log("Error fetching latest news"));
    };

    useEffect(fetchData, []);


    return (
        <React.Fragment>
            <Swiper className="swiper-main" tag="section" wrapperTag="ul" navigation pagination style={{minHeight: '310px'}}
                spaceBetween={-40}
                slidesPerView={numItemNewsPage}
            >
            {
                newsData.map((item, val) => (
                    <SwiperSlide key={val} tag="li">
                        <div>
                            <ul>
                                <span style={{marginLeft:'-25px'}}>
                                <a href={item.url}> <img className="news-img" src={item.imageUrl}/> </a>
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