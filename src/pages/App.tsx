import { Route, Routes } from 'react-router';

import { Home } from './Home';
import Login from './login';
import Signup from './Signup';

import './App.css';

function App() {

  return (
  <div>
    <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path='/' element={<Login/>}/>
      <Route path ='/signup' element={<Signup/>}/>
    </Routes>
  </div>
  )
}

export default App;
