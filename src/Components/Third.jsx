import { useNavigate, useLocation } from "react-router-dom"
import "../App.css"
import "../navbar.css"
import { getTrendingList} from "../api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import placeholderImage from '../Image_not_available.png';
import { Sling as Hamburger } from 'hamburger-react'
import AOS from "aos";
import "aos/dist/aos.css";

const Third = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [trendings, setTrendings] = useState([])

  useEffect(() => {
    getTrendingList().then((result) => {
      setTrendings(result)
    })
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hamburgerSize, setHamburgerSize] = useState(24);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    const updateHamburgerSize = () => {
      if (window.innerWidth <= 480) {
        setHamburgerSize(18);
      } else {
        setHamburgerSize(24);
      }
    };

    const refresh = () => {
      window.location.reload();
    };

    useEffect(() => {
      const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        const visible = prevScrollPos > currentScrollPos || menuOpen;
      
        setPrevScrollPos(currentScrollPos);
        setVisible(visible);
      };

      updateHamburgerSize();
      window.addEventListener('resize', updateHamburgerSize);
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('resize', updateHamburgerSize);
        window.removeEventListener('scroll', handleScroll);
      }
    }, [prevScrollPos, menuOpen]);

    return (
      <nav className={`navbar ${visible ? '' : 'hidden'}`}>
      <button onClick={() => navigate('/')} className="logo">Movie Database</button>

        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <li><button onClick={() => navigate('/')}>Movies</button></li>
          <li><button onClick={() => navigate('/tv')}>TV</button></li>
          <li><button onClick={refresh}>Trending</button></li>
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

  const filteredTrendings = trendings.filter((trending) => {
    return trending.media_type === "movie" || trending.media_type === "tv";
  });

  const TrendingList = () => {
    useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);
    
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
      </header>
      <HeroImage />
      <div className="Movie-container" data-aos="fade-up">
        <TrendingList />
      </div>
    </div>
  )
}

export default Third;