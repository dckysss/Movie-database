import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Movies from "./Pages/Movies";
import Trendings from './Pages/Trendings';
import TVs from "./Pages/TVs"
import LoginPage from './Pages/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Movies />}></Route>
        <Route path='/tv' element={<TVs />}></Route>
        <Route path='/trending' element={<Trendings />}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
      </Routes>
    </Router>
  )
}

export default App;