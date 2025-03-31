import { Route, Routes } from 'react-router';

import { ProtectedRoute } from 'components';

import { Home } from './Home';
import Login from './login';
import Signup from './Signup';

import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
