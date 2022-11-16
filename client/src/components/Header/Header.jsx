import React from 'react'
import './Header.css'

import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function Header() {

  const navigate = useNavigate()

  const goTo = (des) => {
    navigate('/' + des)
  }

  const logout = async () => {
    const res = await fetch('https://api.showyourproject.online/user/logout', {
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



  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    setState(open);
  };

  const theme = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#eff2f6eb',
            color: "black",
          },
        },
      },
    },
  });

  return (
    <div className='header'>
      <div className="insideHeader">
        <h1 className='logo' onClick={() => goTo("")}>SYP</h1>
        {
          localStorage.name ?
            <>
              <div>
                <Button onClick={() => { goTo("profile"); window.location.reload(); }} color="inherit">Profile</Button>
                <Button onClick={() => goTo("add-project")} color="inherit">Add project</Button>
                <Button onClick={() => goTo("about-us")} color="inherit">About</Button>
                <Button onClick={logout} color="inherit">Logout</Button>
              </div>
            </>
            :
            <>
              <div>
                <Button onClick={() => goTo("about-us")} color="inherit">About</Button>
                <Button onClick={() => goTo("login")} color="inherit">Login</Button>
                <Button onClick={() => goTo("register")} color="inherit">Resiter</Button>
              </div>
            </>
        }

      </div>

      <div className='mobilemenu'>

        <h1 className='logo' onClick={() => goTo("")}>SYP</h1>
        <div className='formobileonly'>
          <React.Fragment>

            <Button onClick={toggleDrawer(true)}><MenuIcon /></Button>
            <ThemeProvider theme={theme}>

              <Drawer
                anchor={"left"}
                open={state}
                onClose={toggleDrawer(false)}
              >
                {
                  localStorage.id ?
                    <>
                      <Button onClick={() => goTo("")} color="inherit">Feed</Button>
                      <Button onClick={() => { goTo("profile"); window.location.reload(); }} color="inherit">Profile</Button>
                      <Button onClick={() => goTo("add-project")} color="inherit">Add project</Button>
                      <Button onClick={() => goTo("about-us")} color="inherit">About</Button>
                      <Button onClick={logout} color="inherit">Logout</Button>
                    </>
                    :
                    <>
                      <Button onClick={() => goTo("about-us")} color="inherit">About</Button>
                      <Button onClick={() => goTo("login")} color="inherit">Login</Button>
                      <Button onClick={() => goTo("register")} color="inherit">Resiter</Button>
                    </>

                }

              </Drawer>
            </ThemeProvider>
          </React.Fragment>
        </div>
      </div>

    </div >
  )
}
