import "./App.css"
import { getMovieList, searchMovie} from "./api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component'

const App = () => {
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

  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => {
      return (
        <div className="Movie-wrapper" key={i}>
          <div className="Movie-title">{movie.title}</div>
          <LazyLoadImage 
            className="Movie-image" 
            src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`}
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

  return (
    <div className = "App">
      <header className="App-header">
        <HeroImage />
        <h1>Movie Database</h1>
        <input 
          placeholder="Search..." 
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

export default App;