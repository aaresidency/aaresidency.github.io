import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { WhatsAppChatButton } from './components/WhatsAppChatButton'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Rooms } from './pages/Rooms'
import { Gallery } from './pages/Gallery'
import { B2B } from './pages/B2B'
import { Events } from './pages/Events'
import { Reviews } from './pages/Reviews'
import { Nearby } from './pages/Nearby'
import { Facilities } from './pages/Facilities'
import { Contact } from './pages/Contact'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { HotelsInTirupati } from './pages/HotelsInTirupati'
import { RoomsInTirupati } from './pages/RoomsInTirupati'
import { HotelsNearTirupatiTemple } from './pages/HotelsNearTirupatiTemple'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/b2b" element={<B2B />} />
          <Route path="/events" element={<Events />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hotels-in-tirupati" element={<HotelsInTirupati />} />
          <Route path="/rooms-in-tirupati" element={<RoomsInTirupati />} />
          <Route path="/hotels-near-tirupati-temple" element={<HotelsNearTirupatiTemple />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppChatButton />
    </>
  )
}

export default App
