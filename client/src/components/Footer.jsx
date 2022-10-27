import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function Footer() {

  const navigate = useNavigate()

  const takeMe = (des) => {
    navigate('/' + des)
  }

  return (
    <div className='footercomp'>
      <div className='footersection'>
        <div>
          <a href="https://www.github.com/Eyalsberro" target='_blank'><FontAwesomeIcon icon="fa-brands fa-github" className='iconsfooter' /></a>
          <a href="https://www.instagram.com/Eyalsberro" target='_blank'><FontAwesomeIcon icon="fa-brands fa-instagram" className='iconsfooter' /></a>
          <a href="https://www.linkedin.com/in/eyalsberro" target='_blank'><FontAwesomeIcon icon="fa-brands fa-linkedin-in" className='iconsfooter' /></a>
        </div>
        <div className='linksfooter'>
          <p onClick={() => takeMe("about-us")}>About Us</p>
        </div>
      </div>
      <hr></hr>
      <p className='rights'><a href='https://www.buymeacoffee.com/eyalsberro' target='_blank'>Support Me Here</a></p>
      <p className='rights'> © 2022 Eyal Sberro </p>
    </div>
  )
}
