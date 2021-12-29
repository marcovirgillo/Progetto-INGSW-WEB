import React, { Component, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle';
import { NewsData } from './TestData'

SwiperCore.use([Navigation, Pagination]);

export default function NewsSection() {
    const [screenSize, setScreenSize] = useState(null);
    const [numItemNewsPage, setNumItemNewsPage] = useState(3);

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    });

    useEffect(() => {
        if(screenSize <= 600) 
            setNumItemNewsPage(1);
        
        else if(screenSize > 600 && screenSize <= 1300) 
            setNumItemNewsPage(2);
        
        else if(screenSize > 1300 && screenSize <= 1600)
            setNumItemNewsPage(3);

        else
            setNumItemNewsPage(4);
        

    }, [screenSize]);

    return (
        <React.Fragment>
            <Swiper className="swiper-main" tag="section" wrapperTag="ul" navigation pagination style={{minHeight: '310px'}}
                spaceBetween={40}
                slidesPerView={numItemNewsPage}
            >
            {
                NewsData.map((item, val) => (
                    <SwiperSlide key={val} tag="li">
                        <div>
                            <ul>
                                <a href={item.link}> <img className="news-img" src={item.image}/> </a>
                                <p className="news-title">{item.title}</p>
                                <p className="news-content">{item.content}</p>
                            </ul>
                        </div>
                    </SwiperSlide>
                ))
            }
        </Swiper>
      </React.Fragment>
    )
}