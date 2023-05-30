import React, { useEffect, useState } from 'react';
import { getMovieList } from '../../api';
import './heroImage.css';

const HeroImageMovies = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  useEffect(() => {
    const fetchMovieList = async () => {
      try {
        const movies = await getMovieList();
        setPopularMovies(movies);
        setCurrentMovieIndex(Math.floor(Math.random() * movies.length));
      } catch (error) {
        console.error('Error fetching movie list:', error);
      }
    };

    fetchMovieList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex(prevIndex => {
        if (prevIndex === popularMovies.length - 1) {
          return 0;
        } else {
          return prevIndex + 1;
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [popularMovies]);

  if (popularMovies.length) {
    const heroMovie = popularMovies[currentMovieIndex];
    return (
      <div
        style={{
          backgroundImage: `url(${process.env.REACT_APP_ORIGINALIMGURL}/${heroMovie.backdrop_path})`,
        }}
        className="Hero-image-wrapper"
      >
        <div className="Hero-image-info">
          <h2 className="Hero-image-title">{heroMovie.title}</h2>
          <p className="Hero-image-description">{heroMovie.overview}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default HeroImageMovies;
