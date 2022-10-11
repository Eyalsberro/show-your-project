import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './components/Header/Header'
import Main from './components/Main'

export default function App() {
  return (
    <div className='app'>
      <Router>
        <Header />
        <Main/>
      </Router>
    </div >
  )
}
