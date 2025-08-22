import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from '../sections/Home'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <section id="Home">
      <Home />
    </section>
  )
}

export default App
