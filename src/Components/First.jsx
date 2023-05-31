import { useNavigate, useLocation } from "react-router-dom"
import "../App.css"
import "../navbar.css"
import { getMovieList, searchMovie, getMovieTrailer} from "../api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import placeholderImage from '../Image_not_available.png';
import { Sling as Hamburger } from 'hamburger-react';
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollTopButton from "./scrollTop/scrollTop";
import HeroImageMovies from './heroImage/heroImage';
import SpeechToText from "./speechRecognition/speechRecognition";
import { debounce } from "lodash"

const First = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [popularMovies, setPopularMovies] = useState([])
  const [defaultMovies, setDefaultMovies] = useState(popularMovies)
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    getMovieList().then((result) => {
      setPopularMovies(result)
      setDefaultMovies(result)
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
    }

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
      <button onClick={refresh} className="logo">Movie Database</button>

        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
            <li><button onClick={refresh}>Movies</button></li>
            <li><button onClick={() => navigate('/tv')}>TV</button></li>
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
      const newMovies = await searchMovie(searchQuery, nextPage);
      if (newMovies.results.length > 0) {
        setPopularMovies((prevMovies) => [...prevMovies, ...newMovies.results]);
        setPage(nextPage);
      } else {
        setHasMorePages(false);
      }
    } else {
      const newMovies = await getMovieList(nextPage);
      if (newMovies.length > 0) {
        setPopularMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setPage(nextPage);
      } else {
        setHasMorePages(false);
      }
    }
  }

  const PopularMovieList = () => {
    useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);

    return popularMovies.map((movie, i) => {
      return (
        <div className="Movie-wrapper" key={i} title={movie.title} onClick={() => getMovieTrailer(movie.id)}>
          <div className="Movie-title">{movie.title}</div>
          <LazyLoadImage 
            className="Movie-image" 
            src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage
            }}
          />
          <div className="Movie-date">release: {movie.release_date}</div>
          <div className="Movie-rate">{movie.vote_average}</div>
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
  };

  const debouncedSearch = debounce((q) => {
    setSearchQuery(q);
  }, 300);

  const search = async (q, page) => {
    if (q.length > 2) {
      const query = await searchMovie(q, page)
      setPopularMovies(query.results)
      setHasMorePages(query.results.length > 0);
      setPage(1)
      setTotalPages(query.totalPages);
      setIsSearching(true)
    } else {
      setPopularMovies(defaultMovies)
      setHasMorePages(true);
      setPage(1)
      setIsSearching(false)
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
      </header>
      <HeroImageMovies />
        
      <div className="search-container">

        {!isListening && (
          <input 
          placeholder="Search movies..."
          className="Movie-search"
          onChange={({ target }) => debouncedSearch(target.value, page)}
        />
        )}
        {isListening && (
          <input 
          placeholder="Search movies..."
          className="Movie-search"
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value, page)}
        />
        )}
        <SpeechToText setSearchQuery={setSearchQuery} onListeningChange={handleListeningChange} />
      </div>
        
      <div className="Movie-container" data-aos="fade-up">
        <PopularMovieList />
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

export default First;