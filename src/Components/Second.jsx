import { useNavigate } from "react-router-dom"
import "../App.css"
import { searchTV, getTVList,} from "../api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import placeholderImage from '../Image_not_available.png';
import { Sling as Hamburger } from 'hamburger-react'

const Second = () => {
  const navigate = useNavigate()  
  const [popularTV, setPopularTV] = useState([])
  const [defaultTV, setDefaultTV] = useState(popularTV)

  useEffect(() => {
    getTVList().then((result) => {
      setPopularTV(result)
      setDefaultTV(result)
    })
  }, []) 

  const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hamburgerSize, setHamburgerSize] = useState(24);

    const updateHamburgerSize = () => {
      if (window.innerWidth <= 480) {
        setHamburgerSize(18);
      } else {
        setHamburgerSize(24);
      }
    };

    useEffect(() => {
      updateHamburgerSize();
      window.addEventListener('resize', updateHamburgerSize);
      return () => window.removeEventListener('resize', updateHamburgerSize);
    }, []);

    return (
      <nav className="navbar">
      <h1 className="logo">Movie Database</h1>

        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
            <li><a href="/" onClick={() => navigate('/')}>Movies</a></li>
            <li><a href="/tv" onClick={() => navigate('/tv')}>TV</a></li>
            <li><a href="/trending" onClick={() => navigate('/trending')}>Trending</a></li>
        </ul>

        <div className="hamburger">
          <Hamburger
            rounded
            size={hamburgerSize}
            duration={0.8} 
            toggled={menuOpen}
            toggle={setMenuOpen}
          />
        </div>
      </nav>
    )
    }

  const PopularTVList = () => {
    return popularTV.map((tv, i) => {
      return (
        <div className="Movie-wrapper" key={i}>
          <div className="Movie-title">{tv.name}</div>
          <LazyLoadImage 
            className="Movie-image" 
            src={`${process.env.REACT_APP_BASEIMGURL}/${tv.poster_path}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage
            }}
          />
          <div className="Movie-date">release: {tv.first_air_date}</div>
          <div className="Movie-rate">{tv.vote_average}</div>
        </div>
      )
    })
  }

  const HeroImage = () => {
    const r = Math.floor(Math.random() * popularTV.length)
    const [currentTVIndex, setCurrentTVIndex] = useState(r);
      useEffect(() => {
        const interval = setInterval(() => {
            if (currentTVIndex === popularTV.length - 1) {
                setCurrentTVIndex(0);
            } else {
                setCurrentTVIndex(currentTVIndex + 1);
            }
        }, 10000);
        return () => clearInterval(interval);
      }, [currentTVIndex]);

    if (popularTV.length) {
        const heroTV = popularTV[currentTVIndex];
        return (
          <div 
            style={{ backgroundImage: `url(${process.env.REACT_APP_ORIGINALIMGURL}/${heroTV.backdrop_path})`}} 
            className="Hero-image-wrapper">
            <div className="Hero-image-info">
              <h2 className="Hero-image-title">{heroTV.name}</h2>
              <p className="Hero-image-description">{heroTV.overview}</p>
            </div>
          </div>
      )
    }
    return null;
  }

  const search = async (q) => {
    if (q.length > 2) {
      const query = await searchTV(q)
      setPopularTV(query.results)
    } else {
      setPopularTV(defaultTV)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
      </header>
      <HeroImage />
        
        <input 
          placeholder="Search movies..."
          className="Movie-search"
          onChange={({ target }) => search(target.value)}
        />
        <div className="Movie-container">
          <PopularTVList />
        </div>
    </div>
  )
}

export default Second;