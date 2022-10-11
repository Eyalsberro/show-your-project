import React from 'react'
// import { useNavigate } from 'react-router-dom'

export default function Footer() {

  // const navigate = useNavigate()

  // const takeMe = (des) => {
  //     navigate('/' + des)
  // }

  return (
    <div className='footercomp'>
      <div className='footersection'>
        <div>
          <a href="https://www.facebook.com/"><img className='iconsfooter' src="https://i.ibb.co/PMSRjRy/facebook.png" alt="facebook"></img></a>
          <a href="https://www.facebook.com/"><img className='iconsfooter' src="https://i.ibb.co/5Gxv9cr/send.png" alt="facebook"></img></a>
          <a href="https://www.facebook.com/"><img className='iconsfooter' src="https://i.ibb.co/BwSb2GG/instagram-1.png" alt="facebook"></img></a>
          <a href="https://www.facebook.com/"><img className='iconsfooter' src="https://i.ibb.co/bXy2gs2/linkedin.png" alt="facebook"></img></a>
        </div>
        <div className='linksfooter'>
          <p>About Us</p>
          {/* <p onClick={() => takeMe("contactus")}>צור קשר</p> */}
          {/* <p>הצוות שלנו</p>
          <p>אודות</p> */}
        </div>
      </div>
      <hr></hr>
      <p className='rights'><a href='https://www.buymeacoffee.com/eyalsberro'>Support Me Here</a></p>
      <p className='rights'> © 2022 Eyal Sberro </p>
    </div>
  )
}
