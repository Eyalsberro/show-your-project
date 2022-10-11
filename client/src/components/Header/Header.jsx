import React from 'react'
import './Header.css'

import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const navigate = useNavigate()

  const goTo = (des) => {
    navigate('/' + des)
  }

  const logout = async () => {
    const res = await fetch('http://localhost:5000/user/logout', {
      method: "delete",
      credentials: "include"
    })
    const data = await res.json()
    if (data.err) {
      alert(data.err)
    } else {
      localStorage.removeItem('name')
      localStorage.removeItem('id')
      navigate('/login')
    }
  }

  return (
    <div className='header'>
      <div className="insideHeader">
        <h1 className='logo' onClick={() => goTo("")}>SYP</h1>
        {
          localStorage.name ?
            <>
              <div>
                <Button onClick={() => {goTo("profile"); window.location.reload();}} color="inherit">Profile</Button>
                <Button onClick={() => goTo("add-project")} color="inherit">Add project</Button>
                <Button onClick={logout} color="inherit">Logout</Button>
              </div>
            </>
            :
            <>
              <div>
                <Button onClick={() => goTo("login")} color="inherit">Login</Button>
                <Button onClick={() => goTo("register")} color="inherit">Resiter</Button>
              </div>
            </>
        }

      </div>

    </div>
  )
}
