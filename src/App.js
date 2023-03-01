import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import "./App.css"
import Movies from "./Pages/Movies";
import Trending from './Pages/Trending';
import TV from "./Pages/TV"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Movies />}></Route>
        <Route path='/tv' element={<TV />}></Route>
        <Route path='/trending' element={<Trending />}></Route>
      </Routes>
    </Router>
  )
}

export default App;