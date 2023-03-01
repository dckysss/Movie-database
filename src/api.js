import axios from "axios"

const apiKey = process.env.REACT_APP_APIKEY
const baseUrl = process.env.REACT_APP_BASEURL

export const getMovieList = async() => {
    const movie = await axios.get(`${baseUrl}/movie/popular?page=1&api_key=${apiKey}`)
    return movie.data.results
}

export const searchMovie = async (q) => {
    const search = await axios.get(`${baseUrl}/search/movie?query=${q}&page=1&api_key=${apiKey}`)
    return search.data
}

export const getTVList = async() => {
    const tv = await axios.get(`${baseUrl}/tv/top_rated?page=1&api_key=${apiKey}`)
    return tv.data.results
}

export const getTrendingList = async() => {
    const trending = await axios.get(`${baseUrl}/trending/all/week?page=1&api_key=${apiKey}`)
    return trending.data.results
}

export const searchTV = async (q) => {
    const search = await axios.get(`${baseUrl}/search/tv?query=${q}&page=1&api_key=${apiKey}`)
    return search.data
}