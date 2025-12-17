import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { ElectricalData } from './pages/ElectricalData'
import './App.css'

export const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<ElectricalData />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

