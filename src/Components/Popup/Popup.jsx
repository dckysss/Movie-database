import React from "react"
import './popup.css'

const MovieDetailPopup = ({ movie, onClose }) => {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>{movie.release_date}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };  

export default MovieDetailPopup