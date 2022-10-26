import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Footer from './components/Footer'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

import Header from './components/Header/Header'
import Main from './components/Main'

export default function App() {
  library.add(faGithub, faInstagram, faLinkedinIn)

  return (
    <div className='app'>
      <Router>
        <Header />
        <Main />
        <Footer />
      </Router>
    </div >
  )
}
