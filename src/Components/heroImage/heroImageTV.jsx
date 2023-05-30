import React, { useEffect, useState } from 'react';
import { getTVList } from '../../api';
import './heroImage.css';

const HeroImageTV = () => {
  const [popularTV, setPopularTV] = useState([]);
  const [currentTVShowIndex, setCurrentTVShowIndex] = useState(0);

  useEffect(() => {
    const fetchTVShowList = async () => {
      try {
        const tv = await getTVList();
        setPopularTV(tv);
        setCurrentTVShowIndex(Math.floor(Math.random() * tv.length));
      } catch (error) {
        console.error('Error fetching TV show list:', error);
      }
    };

    fetchTVShowList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTVShowIndex(prevIndex => {
        if (prevIndex === popularTV.length - 1) {
          return 0;
        } else {
          return prevIndex + 1;
        }
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [popularTV]);

  if (popularTV.length) {
    const heroTVShow = popularTV[currentTVShowIndex];
    return (
      <div
        style={{
          backgroundImage: `url(${process.env.REACT_APP_ORIGINALIMGURL}/${heroTVShow.backdrop_path})`,
        }}
        className="Hero-image-wrapper"
      >
        <div className="Hero-image-info">
          <h2 className="Hero-image-title">{heroTVShow.name}</h2>
          <p className="Hero-image-description">{heroTVShow.overview}</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default HeroImageTV;