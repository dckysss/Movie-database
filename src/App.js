import "./App.css"
import { getMovieList, searchMovie} from "./api"
import { useEffect, useState } from "react"
import { LazyLoadImage } from 'react-lazy-load-image-component';

const App = () => {
  const [popularMovies, setPopularMovies] = useState([])

  useEffect(() => {
    getMovieList().then((result) => {
      setPopularMovies(result)
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

  const search = async (q) => {
    if (q.length > 2) {
      const query = await searchMovie(q)
      setPopularMovies(query.results)
    }
  }

  return (
    <div className = "App">
      <header className="App-header">
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
