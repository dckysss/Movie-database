import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import "../navbar.css";
import { searchTV, getTVList,} from "../api";
import { useEffect, useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholderImage from '../Image_not_available.png';
import { Sling as Hamburger } from 'hamburger-react'
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollTopButton from "./scrollTop/scrollTop";

const Second = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [popularTV, setPopularTV] = useState([]);
  const [defaultTV, setDefaultTV] = useState(popularTV);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getTVList().then((result) => {
      setPopularTV(result)
      setDefaultTV(result)
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
          <li><button onClick={refresh}>TV</button></li>
          <li><button onClick={() => navigate('/trending')}>Trending</button></li>
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

    const loadMore = async () => {
      const nextPage = page + 1;
      if (isSearching) {
        const newTV = await searchTV(searchQuery, nextPage);
        if (newTV.results.length > 0) {
          setPopularTV((prevTV) => [...prevTV, ...newTV.results]);
          setPage(nextPage);
        } else {
          setHasMorePages(false);
        }
      } else {
        const newTV = await getTVList(nextPage);
        if (newTV.length > 0) {
          setPopularTV((prevTV) => [...prevTV, ...newTV]);
          setPage(nextPage);
        } else {
          setHasMorePages(false);
        }
      }
    }

  const PopularTVList = () => {
    useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);

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

  const search = async (q, page) => {
    if (q.length > 2) {
      const query = await searchTV(q, page)
      setPopularTV(query.results)
      setHasMorePages(query.results.length > 0);
      setPage(1)
      setTotalPages(query.totalPages);
      setIsSearching(true)
    } else {
      setPopularTV(defaultTV)
      setHasMorePages(true);
      setPage(1)
      setIsSearching(false)
    }
    setSearchQuery(q);
  }

  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
      </header>
      <HeroImage />
        
        <input 
          placeholder="Search TV shows..."
          className="Movie-search"
          onChange={({ target }) => search(target.value, page)}
        />
        <div className="Movie-container" data-aos="fade-up">
          <PopularTVList />
        </div>
        <div>
          {isSearching && hasMorePages && page < totalPages && (
            <button className="load-more" onClick={loadMore}>
              Load more
            </button>
          )}

          {!isSearching && hasMorePages && (
            <button className="load-more" onClick={loadMore}>
              Load more
            </button>
          )}

          <ScrollTopButton />
        </div>
    </div>
  )
}

export default Second;