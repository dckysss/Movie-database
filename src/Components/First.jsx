import { useNavigate } from "react-router-dom"
import "../App.css"
import { getMovieList, searchMovie} from "../api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import placeholderImage from '../Image_not_available.png';

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
        <HeroImage />
        <h1>Movie Database</h1>
        <input 
          placeholder="Search movies..."
          className="Movie-search"
          onChange={({ target }) => search(target.value)}
        />
        <div className="Movie-container">
          <PopularMovieList />
        </div>
      </header>
    </div>
  )
}

export default First;