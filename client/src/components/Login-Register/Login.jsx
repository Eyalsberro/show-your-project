import * as React from 'react';
import './Login.css'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const theme = createTheme();

export default function Login() {

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")



  const LoginUser = async (event) => {
    event.preventDefault();
    const res = await fetch('http://localhost:8080/user/login', {
      method: "post",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    })
    const data = await res.json()

    if (data.err) {
      document.getElementById("err").innerHTML = data.err

    } else {
      localStorage.name = data.name
      localStorage.id = data.userid
      navigate('/profile')
      window.location.reload()
    }

  }


  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={LoginUser} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span id="err"></span>
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link to="/register" variant="body2">
                    {"Dont have an account yet?"}
                  </Link>
                </Grid>
              </Grid>

            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}





// import React from 'react'
// import './Login.css'

// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';

// export default function Login() {


//     const [name, setName] = useState("")
//     const [password, setPassword] = useState("")




//     const LoginUser = async () => {
//         const res = await fetch('http://localhost:8080/user/login', {
//             method: "post",
//             headers: { 'content-type': 'application/json' },
//             body: JSON.stringify({ name, password }),
//             credentials: "include"
//         })
//         const data = await res.json()

//         if (data.err) {
//             document.getElementById("err").innerHTML = data.err

//         } else {
//             localStorage.name = data.name
//             localStorage.id = data.userid
//         }

//     }

//     return (
//         <div>
//             <div className='login'>

//                 <Card sx={{ height: 320, width: 365, boxShadow: 3 }}>
//                     <span id="err"></span>
//                     <CardContent sx={{ margin: 1 }}>

//                         <TextField id="outlined-basic" label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
//                         <br />
//                         <TextField id="outlined-password-input" type="password" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />

//                     </CardContent>

//                     <CardActions>
//                         <Button onClick={LoginUser} size="small">Login</Button>
//                     </CardActions>
//                     <span>Dont have an account yet? <Link to="/register">Register Now</Link></span>
//                 </Card>

//             </div>
//         </div>
//     )
// }
