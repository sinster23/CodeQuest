import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../sections/Home'
import Language from '../sections/Languages'
import Games from '../pages/Games'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
   <> 
    <section id="Home">
      <Home />
    </section>
    <section id="Languages">
      <Language />
    </section>
    <section id="Games">
      <Games />
    </section>
   </> 
  )
}

export default App
