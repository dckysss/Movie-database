import React, { useEffect, useState } from 'react';
import { getTrendingList } from '../../api';
import './heroImage.css';

const HeroImageTV = () => {
  const [trendings, setTrendings] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);

  useEffect(() => {
    const fetchTrendingList = async () => {
      try {
        const trending = await getTrendingList();
        setTrendings(trending);
        setCurrentTrendingIndex(Math.floor(Math.random() * trending.length));
      } catch (error) {
        console.error('Error fetching TV show list:', error);
      }
    };

    fetchTrendingList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrendingIndex(prevIndex => {
        if (prevIndex === trendings.length - 1) {
          return 0;
        } else {
          return prevIndex + 1;
        }
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [trendings]);

  if (trendings.length) {
    const heroTrending = trendings[currentTrendingIndex];
    return (
      <div
        style={{
          backgroundImage: `url(${process.env.REACT_APP_ORIGINALIMGURL}/${heroTrending.backdrop_path})`,
        }}
        className="Hero-image-wrapper"
      >
        <div className="Hero-image-info">
          <h2 className="Hero-image-title">{heroTrending.title}</h2>
          <p className="Hero-image-description">{heroTrending.overview}</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default HeroImageTV;
