// Updated App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../sections/Home";
import Signin from "../backend/signin";
import Languages from "../sections/Languages";
import Login from "../backend/login";
import Games from '../pages/Games';
import SkillsPathPage from '../pages/SkillPath';
import Battles from '../pages/Battle'; // Assuming you have a Battles page
import ProtectedRoute from '../components/ProtectedRoute';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <Home />
          <Languages />
        </>
      } />
      <Route path="/signin" element={<Signin />} />
      <Route path ="/login" element={<Login />} />
      <Route 
        path="/games" 
        element={
          <ProtectedRoute>
            <Games />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/skill-paths" 
        element={
          <ProtectedRoute>
            <SkillsPathPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/battles" 
        element={
          <ProtectedRoute>
            <Battles />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;