import axios from 'axios';
import Auth from './Auth';
import Home from './Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import './App.css';




function App() {
  

  return (

      <BrowserRouter>
        <Routes>
          <Route path="/Auth" element={<Auth />} />
          <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        </Routes> 
      </BrowserRouter>

  );
}

export default App;
