import { useNavigate } from "react-router-dom"
import "../App.css"
import { getMovieList, searchMovie} from "../api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import placeholderImage from '../Image_not_available.png';
import { Sling as Hamburger } from 'hamburger-react'

const First = () => {
  const navigate = useNavigate()
  const [popularMovies, setPopularMovies] = useState([])
  const [defaultMovies, setDefaultMovies] = useState(popularMovies)

  useEffect(() => {
    getMovieList().then((result) => {
      setPopularMovies(result)
      setDefaultMovies(result)
    })
  }, []) 

  // onClick={() =>
    // window.open(`https://www.youtube.com/watch?v=Nfgh5MBd_b0`)}

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

  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => {
      return (
        <div className="Movie-wrapper" key={i}>
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
    if (q.length > 2) {
      const query = await searchMovie(q)
      setPopularMovies(query.results)
    } else {
      setPopularMovies(defaultMovies)
    }
  }

  // window.addEventListener('scroll', function() {
  //   var scrollPosition = window.scrollY;
  //   var heroImageHeight = document.querySelector('.Hero-image-wrapper').offsetHeight;
  //   var navbar = document.querySelector('.navbar');
  //   if (scrollPosition >= heroImageHeight) {
  //     navbar.classList.add('sticky');
  //   } else {
  //     navbar.classList.remove('sticky');
  //   }
  // });

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
          <PopularMovieList />
        </div>
    </div>
  )
}

export default First;