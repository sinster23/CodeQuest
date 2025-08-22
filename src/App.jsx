import { Routes, Route } from "react-router-dom";
import Home from "../sections/Home";
import Signin from "../backend/signin";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

export default App;
