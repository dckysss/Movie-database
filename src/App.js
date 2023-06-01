import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Movies from "./Pages/Movies";
import Trending from './Pages/Trending';
import TV from "./Pages/TV"
import LoginPage from './Pages/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Movies />}></Route>
        <Route path='/tv' element={<TV />}></Route>
        <Route path='/trending' element={<Trending />}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
      </Routes>
    </Router>
  )
}

export default App;