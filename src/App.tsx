import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { ElectricalData } from './pages/ElectricalData'
import './App.css'

const baseUrl = import.meta.env.BASE_URL
const basename = baseUrl === '/' ? undefined : baseUrl.replace(/\/$/, '')


export const App = () => {
  return (
    <Router basename={basename}>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<ElectricalData />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

