import { useState } from 'react'
import Home from '../sections/Home'
import Language from '../sections/Languages'
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
   </> 
  )
}

export default App
