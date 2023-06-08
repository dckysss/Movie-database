import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import "../navbar.css";
import { searchTV, getTVList, getTVTrailer, getTVDetails, getTVCredits} from "../api";
import { useEffect, useState, useRef } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholderImage from '../Image_not_available.png';
import { Sling as Hamburger } from 'hamburger-react'
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollTopButton from "./scrollTop/scrollTop";
import HeroImageTV from './heroImage/heroImageTV';
import SpeechToText from "./speechRecognition/speechRecognition";
import PlaceholderSkeleton from "./Placeholder/Skeleton";
import { debounce } from "lodash";
import Bookmark from '../Assets/bookmark.svg';
import Rating from '../Assets/star.svg';

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
  const [isListening, setIsListening] = useState(false);
  const [selectedTV, setSelectedTV] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [TVCredits, setTVCredits] = useState([]);
  const popupContentRef = useRef(null);
  const [isNoResults, setIsNoResults] = useState(false);

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
      <button onClick={() => navigate('/')} className="logo">Movie Search</button>

        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <li><button onClick={() => navigate('/')}>Movies</button></li>
          <li><button onClick={refresh}>TV</button></li>
          <li><button onClick={() => navigate('/trending')}>Trending</button></li>
          <li><button onClick={() => navigate('/login')}>Login</button></li>
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupContentRef.current && !popupContentRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const TVPopup = () => {
      if (!isPopupOpen || !selectedTV) {
        return null;
      }
  
      const handleWatchTrailer = async () => {
        try {
          const trailerUrl = await getTVTrailer(selectedTV.id);
          if (trailerUrl) {
            window.open(trailerUrl);
          }
        } catch (error) {
          console.error("Error fetching tv show trailer:", error);
        }
      };
  
      return (
        <div className="movie-popup-overlay">
          <div 
            ref={popupContentRef}
            style={{backgroundImage: `url(${process.env.REACT_APP_ORIGINALIMGURL}/${selectedTV.backdrop_path})`}}
            className="movie-popup"
          >
          <div className="background-overlay">
          </div>
            <img
              className="movie-popup-image"
              src={`${process.env.REACT_APP_BASEIMGURL}/${selectedTV.poster_path}`}
              alt={selectedTV.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImage;
              }}
              draggable="false"
            />
            <div className="movie-popup-details">
              <div className="movie-popup-title">{selectedTV.name}</div>
              <div className="movie-popup-genres">
                {selectedTV.genres && selectedTV.genres.slice(0, 5).map((genre, i) => (
                    <span className="movie-popup-genre-items" key={i}>{genre.name}</span>
                  ))
                }
              </div>
              <p>{selectedTV.overview}</p>
              <div>
                <h2>Casts</h2>
                <div className="cast-container">
                  {TVCredits && TVCredits.slice(0, 6).map((cast, i) => (
                    <div key={i} className="cast-item">
                      {cast.profile_path ? (
                        <img
                          src={`${process.env.REACT_APP_BASEIMGURL}/${cast.profile_path}`}
                          alt={cast.name}
                          className="cast-photo"
                          draggable="false"
                        />
                      ) : (
                        <div className="no-photo">No Photo</div>
                      )}
                      <div className="cast-name">{cast.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="detail-btn-container">
                <div className="icon-btn-container">
                  <button className="icon-btn" onClick={() => navigate('/login')}>
                    <img 
                      src={Bookmark} 
                      alt='watchlist' 
                      className="icon-img"
                      title="Add to watchlist"
                    />
                  </button>
                  <button className="icon-btn" onClick={() => navigate('/login')}>
                    <img 
                      src={Rating} 
                      alt='rating' 
                      className="icon-img"
                      title="Rate"
                    />
                  </button>
                </div>
                <button className="trailer-btn" onClick={handleWatchTrailer}>Watch trailer</button>
              </div>
            </div>
            <button className="close" onClick={() => setIsPopupOpen(false)}>&#10005;</button>
          </div>
        </div>
      );
  };

  const PopularTVList = () => {
    useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);

    const handleClick = async (tv) => {
      try {
        const tvDetails = await getTVDetails(tv.id);
        const credits = await getTVCredits(tv.id);
        setTVCredits(credits.cast);
    
        setSelectedTV({
          ...tvDetails,
          genres: tvDetails.genres || [],
        });
    
        setIsPopupOpen(true);
      } catch (error) {
        console.error("Error fetching tv details:", error);
      }
    };

    if (isNoResults) {
      return <div>No results found</div>;
    }

    return popularTV.map((tv, i) => {
      return (
        <div className="Movie-wrapper" key={i} onClick={() => handleClick(tv)}>
          <div className="Movie-title">{tv.name}</div>
          <LazyLoadImage 
            className="Movie-image" 
            src={`${process.env.REACT_APP_BASEIMGURL}/${tv.poster_path}`}
            placeholder={<PlaceholderSkeleton />}
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

  useEffect(() => {
    search(searchQuery, page);
    // eslint-disable-next-line
  }, [searchQuery]);

  const handleListeningChange = (isListening) => {
    setIsListening(isListening);
    setPage(1)
  };

  const debouncedSearch = debounce((q) => {
    setSearchQuery(q);
  }, 300);

  const search = async (q, page) => {
    if (q.length > 2) {
      const query = await searchTV(q, page);
      setPopularTV(query.results);
      setHasMorePages(query.results.length > 0);
      setPage(1);
      setTotalPages(query.totalPages);
      setIsSearching(true);
      setIsNoResults(query.results.length === 0);
    } else {
      setPopularTV(defaultTV);
      setHasMorePages(true);
      setPage(1);
      setIsSearching(false);
      setIsNoResults(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
      </header>
      <TVPopup />
      <HeroImageTV />
        
      <div className="search-container">
        {!isListening && (
          <input 
          placeholder="Search TV shows..."
          className="Movie-search"
          onChange={({ target }) => debouncedSearch(target.value, page)}
        />
        )}
        {isListening && (
          <input 
          placeholder="Search TV shows..."
          className="Movie-search"
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value, page)}
        />
        )}
        <SpeechToText setSearchQuery={setSearchQuery} onListeningChange={handleListeningChange} />
      </div>

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