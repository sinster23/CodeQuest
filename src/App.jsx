import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../sections/Home";
import Signin from "../backend/signin";
import Languages from "../sections/Languages"
import Games from '../pages/Games'      
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
      <Route path="/games" element={<Games />} />
   </Routes>
  );
}

export default App;
