import axios from "axios"

const apiKey = process.env.REACT_APP_APIKEY
const baseUrl = process.env.REACT_APP_BASEURL

export const getMovieList = async(page = 1) => {
    const movie = await axios.get(`${baseUrl}/discover/movie?page=${page}&api_key=${apiKey}`)
    return movie.data.results
}

export const searchMovie = async (q, page = 1) => {
    const search = await axios.get(`${baseUrl}/search/movie?query=${q}&page=${page}&api_key=${apiKey}`)
    const { results, total_pages } = search.data;
    return {
        results,
        totalPages: total_pages
    };
};

export const getMovieDetails = async (movieId) => {
  const response = await axios.get(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
  return response.data;
};

export const getMovieCredits = async (movieId) => {
  const response = await axios.get(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`);
  return response.data;
};

export const getMovieTrailer = async (movieId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/movie/${movieId}/videos`,
      {
        params: {
          api_key: apiKey,
        },
      }
    );
    const trailers = response.data.results;
    const officialTrailer = trailers.find(trailer => trailer.type === 'Trailer' && trailer.site === 'YouTube');
    if (officialTrailer) {
      const trailerKey = officialTrailer.key;
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    } else {
      alert("No trailers found for this movie.");
    }
  } catch (error) {
    alert("Error fetching movie trailers:", error);
  }
};

export const getTVList = async(page = 1) => {
    const tv = await axios.get(`${baseUrl}/discover/tv?page=${page}&api_key=${apiKey}`)
    return tv.data.results
};

export const searchTV = async (q, page = 1) => {
    const search = await axios.get(`${baseUrl}/search/tv?query=${q}&page=${page}&api_key=${apiKey}`)
    const { results, total_pages } = search.data;
    return {
        results,
        totalPages: total_pages
    };
};

export const getTVDetails = async (tvId) => {
  const response = await axios.get(`${baseUrl}/tv/${tvId}?api_key=${apiKey}`);
  return response.data;
};

export const getTVCredits = async (tvId) => {
  const response = await axios.get(`${baseUrl}/tv/${tvId}/credits?api_key=${apiKey}`);
  return response.data;
};

export const getTVTrailer = async (tvId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/tv/${tvId}/videos`,
      {
        params: {
          api_key: apiKey,
        },
      }
    );
    const trailers = response.data.results;
    const officialTrailer = trailers.find(trailer => trailer.type === 'Trailer' && trailer.site === 'YouTube');
    if (officialTrailer) {
      const trailerKey = officialTrailer.key;
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    } else {
      alert("No trailers found for this movie.");
    }
  } catch (error) {
    alert("Error fetching movie trailers:", error);
  }
};

export const getTrendingList = async() => {
  const trending = await axios.get(`${baseUrl}/trending/all/week?page=1&api_key=${apiKey}`)
  return trending.data.results
}