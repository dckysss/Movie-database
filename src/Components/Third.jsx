import { useNavigate } from "react-router-dom"
import "../App.css"
import { getTrendingList} from "../api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import placeholderImage from '../Image_not_available.png';

const Third = () => {
  const navigate = useNavigate()
  const [trendings, setTrendings] = useState([])

  useEffect(() => {
    getTrendingList().then((result) => {
      setTrendings(result)
    })
  }, []) 

  // onClick={() =>
    // window.open(`https://www.youtube.com/watch?v=Nfgh5MBd_b0`)}

  const NavBar = () => {
    return (
      <nav className="navbar">
        <ul className="navbar-menu">
            <li><a href="/" onClick={() => navigate('/')}>Movies</a></li>
            <li><a href="/tv" onClick={() => navigate('/tv')}>TV</a></li>
            <li><a href="/trending" onClick={() => navigate('/trending')}>Trending</a></li>
        </ul>
      </nav>
    )
  }

  const filteredTrendings = trendings.filter((trending) => {
    return trending.media_type === "movie" || trending.media_type === "tv";
  });

  const TrendingList = () => {
    return filteredTrendings.map((trending, i) => {
      const resultObj = {
          title: trending.title,  
          name: trending.name 
        };  
      const resultProp = trending.media_type === 'movie' ? resultObj.title : resultObj.name;  
      const releaseDateProp = trending.media_type === 'movie' ? trending.release_date : trending.first_air_date;    
      return (
        <div className="Movie-wrapper" key={i}>
          <div className="Movie-title">{resultProp}</div>
          <LazyLoadImage 
            className="Movie-image" 
            src={`${process.env.REACT_APP_BASEIMGURL}/${trending.poster_path}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage
            }}
          />
          <div className="Movie-date">release: {releaseDateProp}</div>
          <div className="Movie-rate">{trending.vote_average}</div>
        </div>
      )
    })
  }

  const HeroImage = () => {
    const r = Math.floor(Math.random() * filteredTrendings.length)
    const [currentTrendingIndex, setCurrentTrendingIndex] = useState(r);
      useEffect(() => {
        const interval = setInterval(() => {
            if (currentTrendingIndex === filteredTrendings.length - 1) {
                setCurrentTrendingIndex(0);
            } else {
                setCurrentTrendingIndex(currentTrendingIndex + 1);
            }
        }, 10000);
        return () => clearInterval(interval);
      }, [currentTrendingIndex]);

    if (trendings.length) {
        const heroTrending = filteredTrendings[currentTrendingIndex];
        const title = heroTrending.title || heroTrending.name;
        return (
          <div 
            style={{ backgroundImage: `url(${process.env.REACT_APP_ORIGINALIMGURL}/${heroTrending.backdrop_path})`}} 
            className="Hero-image-wrapper">
            <div className="Hero-image-info">
              <h2 className="Hero-image-title">{title}</h2>
              <p className="Hero-image-description">{heroTrending.overview}</p>
            </div>
          </div>
      )
    }
    return null;
  }

  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
        <HeroImage />
        <h1>Movie Database</h1>
        <div className="Movie-container">
          <TrendingList />
        </div>
      </header>
    </div>
  )
}

export default Third;