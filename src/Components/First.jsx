import { useNavigate, useLocation } from "react-router-dom"
import "../App.css"
import { getMovieList, searchMovie} from "../api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import placeholderImage from '../Image_not_available.png';
import { Sling as Hamburger } from 'hamburger-react';
import AOS from "aos";
import "aos/dist/aos.css";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

const First = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [popularMovies, setPopularMovies] = useState([])
  const [defaultMovies, setDefaultMovies] = useState(popularMovies)
  // const { transcript, resetTranscript } = useSpeechRecognition();

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

  const PopularMovieList = () => {
    useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);

    return popularMovies.map((movie, i) => {
      return (
        <div className="Movie-wrapper" key={i} title={movie.title}>
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

  const HeroImage = () => {
    const r = Math.floor(Math.random() * popularMovies.length)
    const [currentMovieIndex, setCurrentMovieIndex] = useState(r);
      useEffect(() => {
        const interval = setInterval(() => {
            if (currentMovieIndex === popularMovies.length - 1) {
                setCurrentMovieIndex(0);
            } else {
                setCurrentMovieIndex(currentMovieIndex + 1);
            }
        }, 10000);
        return () => clearInterval(interval);
      }, [currentMovieIndex]);

    if (popularMovies.length) {
        const heroMovie = popularMovies[currentMovieIndex];
        return (
          <div 
            style={{ backgroundImage: `url(${process.env.REACT_APP_ORIGINALIMGURL}/${heroMovie.backdrop_path})`}} 
            className="Hero-image-wrapper">
            <div className="Hero-image-info">
              <h2 className="Hero-image-title">{heroMovie.title}</h2>
              <p className="Hero-image-description">{heroMovie.overview}</p>
            </div>
          </div>
      )
    }
    return null;
  }

  const search = async (q) => {
    // if (transcript) {
    //   q = transcript;
    //   const movieSearch = document.getElementsByClassName("Movie-search");
    //   movieSearch.value = transcript;
    // }
    // <button onClick={SpeechRecognition.startListening}>Start</button>
    // <button onClick={() => {SpeechRecognition.stopListening(); resetTranscript();}}>Stop</button>

    if (q.length > 2) {
      const query = await searchMovie(q)
      setPopularMovies(query.results)
    } else {
      setPopularMovies(defaultMovies)
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
        <div className="Movie-container" data-aos="fade-up">
          <PopularMovieList />
        </div>
    </div>
  )
}

export default First;