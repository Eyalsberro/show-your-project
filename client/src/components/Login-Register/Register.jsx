import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'


import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';


import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Register() {



  const navigate = useNavigate()


  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [website, setWebsite] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [github, setGithub] = useState("")
  const [position, setPosition] = useState("")
  const [aboutme, setAboutme] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  // const positionSelect = ["Junior FullStack Developer", "Junior Backend", "Junior Frontend", "Junior UX" ]


  const register = async () => {
    const res = await fetch('http://52.0.110.158/user/register', {
      method: "post",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, password, country, city, website, facebook, instagram, linkedin, github, position, aboutme }),
      credentials: "include"
    })
    const data = await res.json()
    if (data.err) {
      alert(data.err)
    } else {
      navigate('/login')
    }
    console.log(data);

  }


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  return (
    <div>

      <h1 className='title'>Sign Up</h1>
      <div className='register'>


        <div className="welcomeregister">
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Name</InputLabel>
                <Input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Email</InputLabel>
                <Input
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Password</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}

                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Job Position</InputLabel>
                {/* <Input
                  type='text'
                  placeholder='Junior Developer/UX/Product...'
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                /> */}
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  label="Job Position"
                >
                  <MenuItem value={"Junior FullStack Developer"}>Junior FullStack Developer</MenuItem>
                  <MenuItem value={"Junior Backend"}>Junior Backend</MenuItem>
                  <MenuItem value={"Junior Frontend"}>Junior Frontend</MenuItem>
                  <MenuItem value={"Junior UX"}>Junior UX</MenuItem>
                  <MenuItem value={"Something Else"}>Something Else</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Country</InputLabel>
                <Input
                  type='text'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>City</InputLabel>
                <Input
                  type='text'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>


        </div>

        <div className="registercard">
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Website</InputLabel>
                <Input
                  type='text'
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Facebook</InputLabel>
                <Input
                  type='text'
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Instagram</InputLabel>
                <Input
                  type='text'
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Linkedin</InputLabel>
                <Input
                  type='text'
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <InputLabel>Github</InputLabel>
                <Input
                  type='text'
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </FormControl>
            </div>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={3}
                  value={aboutme}
                  onChange={(e) => setAboutme(e.target.value)}
                  placeholder='Hey, I"m Toni Stark, im a Junior FullStack Developer, im coding in Javascript....'
                  style={{ width: '30ch' }}
                />
              </FormControl>
            </div>
          </Box>

        </div>


      </div>

      <div className='thebutton'>
        <button className='btn' onClick={register} variant="contained">Register</button>
        <p> Have an account? <Link to="/login">Login Now</Link></p>
      </div>

    </div>
  )
}
