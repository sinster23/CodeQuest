import { Routes, Route } from "react-router-dom";
import Home from "../sections/Home";
import Signin from "../backend/signin";
import Languages from "../sections/Languages"
import "./App.css";

function App() {
  return (
    <Routes>
      <>
      <Route path="/" element={
        <>  
        <Home />
        <Languages />
        </>
        } />
      <Route path="/signin" element={<Signin />} />
     </>
    </Routes>
  );
}

export default App;
