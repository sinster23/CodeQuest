// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../sections/Home";
import Signin from "../backend/signin";
import Languages from "../sections/Languages";
import Login from "../backend/login";
import Games from '../pages/Games';
import SkillsPathPage from '../pages/SkillPath';
import Battles from '../pages/Battle';
import StoryQuest from "../pages/storyMode";
import ProtectedRoute from '../components/ProtectedRoute';
import Plans from "../sections/Plans";
import AIAssistantButton from "../components/SeekhoAI";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Home />
              <Languages />
              <Plans />
            </>
          } 
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/login" element={<Login />} />
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
        <Route 
          path="/story-mode" 
          element={
            <ProtectedRoute>
              <StoryQuest />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {/* AI Assistant Button is always visible */}
      <AIAssistantButton />
    </>
  );
}

export default App;
