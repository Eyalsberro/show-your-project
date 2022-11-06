import React from 'react'
import './EditProfile.css'
import { useEffect, useState } from 'react';



import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Carousel from 'react-bootstrap/Carousel';
import Input from '@mui/material/Input';
import TextareaAutosize from '@mui/material/TextareaAutosize';




export default function EditProfile({ profile, projectUser }) {

  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [country, setCountry] = useState(profile.country)
  const [city, setCity] = useState(profile.city)
  const [website, setWebsite] = useState(profile.website)
  const [facebook, setFacebook] = useState(profile.facebook)
  const [instagram, setInstagram] = useState(profile.instagram)
  const [linkedin, setLinkedin] = useState(profile.linkedin)
  const [github, setGithub] = useState(profile.github)
  const [position, setPosition] = useState(profile.position)
  const [aboutme, setAboutme] = useState(profile.aboutme)
  const [imgsrc, setImgsrc] = useState({})
  const [updaetd, setUpdaetd] = useState(true)

  const UpdateGeneralInfo = async () => {
    const res = await fetch(`http://api.eyalsberro.com/profile/generalinfo/${localStorage.id}`, {
      method: "put",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, country, city, position }),
      credentials: "include"
    })
    const data = await res.json()
    if (data.err) {
      alert(data.err)
    } else {
      document.getElementById("succecd2").innerHTML = data.msg
      console.log(data);

    }

  }

  const UpdateSocial = async (e) => {
    const res = await fetch(`http://api.eyalsberro.com/profile/social/${localStorage.id}`, {
      method: "put",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ website, facebook, instagram, linkedin, github }),
      credentials: "include"
    })
    const data = await res.json()
    if (data.err) {
      alert(data.err)
    } else {
      console.log(data);
      document.getElementById("succecd1").innerHTML = data.msg
    }

  }

  const UpdateAboutMe = async () => {
    const res = await fetch(`http://api.eyalsberro.com/profile/aboutme/${localStorage.id}`, {
      method: "put",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ aboutme }),
      credentials: "include"
    })
    const data = await res.json()
    if (data.err) {
      alert(data.err)
    } else {
      document.getElementById("succecd").innerHTML = data.msg
      console.log(data);

    }

  }

  const UpdateProfilePic = async (e) => {
    // e.preventDefault()
    let formData = new FormData()
    formData.append('image', imgsrc)

    const res = await fetch(`http://api.eyalsberro.com/profile/pic/${localStorage.id}`, {
      method: "post",
      // headers: {mode: 'no-cors'},
      // headers:{'Content-Type': 'multipart/form-data','Access-Control-Allow-Origin':'*'},
      body: formData,
    })
    const data = await res.json()
    if (data.err) {
      document.getElementById("err").innerHTML = data.err
    } else {
      console.log(data);
      document.getElementById("err").innerHTML = data.msg
      setUpdaetd((up) => !up)
    }

  }

  return (
    <div>
      <Container>
        <Row>
          <Col sm={4}>
            <div className='profileImg'>
              <span id="err"></span>
              <img src={profile.image} alt="Profileimage" />
              <Input
                type='file'
                name='image'
                accept="image/*"
                sx={{ width: '25ch' }}
                onChange={(e) => setImgsrc(e.target.files[0])}
              />
              <button className='btn' onClick={UpdateProfilePic}>Update</button>
            </div>
          </Col>
          <Col sm={8}>
            <div className='profileGenralInfo'>
              <h3>Name: <Input
                type='text'
                placeholder={profile.name}
                sx={{ width: '25ch' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              /></h3>
              <div className='positoninput'>Position: <Input
                type='text'
                placeholder={profile.position}
                sx={{ width: '25ch' }}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              /></div>
              <br />
              <div className='cityinput'><span>City: </span>
                <Input
                  type='text'
                  placeholder={profile.city}
                  sx={{ width: '15ch' }}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                /></div>
              <br />
              <div><span>Country: </span>
                <Input
                  type='text'
                  placeholder={profile.country}
                  sx={{ width: '15ch' }}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                /></div>
              <br />
              <span>Email: <Input
                type='text'
                placeholder={profile.email}
                sx={{ width: '25ch' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              /></span>
              <p id="succecd2"></p>
              <br />
              <button className='btn' onClick={UpdateGeneralInfo}>Update</button>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col sm={4}>
            <div className="profileLinkInfo">
              <p>Personal Website:</p>
              <Input
                type='text'
                placeholder={profile.website}
                sx={{ width: '25ch' }}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <p>Linkedin:</p>
              <Input
                type='text'
                placeholder={profile.linkedin}
                sx={{ width: '25ch' }}
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              <p>GitHub:</p>
              <Input
                type='text'
                placeholder={profile.github}
                sx={{ width: '25ch' }}
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
              <p>Facebook:</p>
              <Input
                type='text'
                placeholder={profile.facebook}
                sx={{ width: '25ch' }}
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
              <p>Instagram:</p>
              <Input
                type='text'
                placeholder={profile.instagram}
                sx={{ width: '25ch' }}
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
              <br />
              <p id="succecd1"></p>
              <button className='btn' onClick={UpdateSocial}>Update</button>

            </div>
          </Col>
          <Col sm={8}>
            <div className="profileAboutme">
              <h2>About Me</h2>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                value={aboutme}
                onChange={(e) => setAboutme(e.target.value)}
                placeholder={profile.aboutme}
                style={{ width: '100%' }}
              />
              <p id="succecd"></p>
              <button className='btn' onClick={UpdateAboutMe}>Update</button>

            </div>
          </Col>
        </Row>
      </Container>

      {/* <Container>
        <Row>
          <Col>
            <div className="projectarea">
              <div className='kaka'>
                <h2>My Projects</h2>
                {
                  localStorage.name ? <button className='btn'>Update</button> : <></>
                }
              </div>
              {
                projectUser?.map(projecofuser =>

                  <Card sx={{ maxWidth: 545 }}>
                    <CardHeader
                      title={<b>{projecofuser.title}</b>}
                    />
                    <CardContent>
                      <Typography paragraph variant="subtitle1" color="text.secondary">
                        {projecofuser.about_the_project}
                      </Typography>
                    </CardContent>
                    <Carousel interval="10000">
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={projecofuser.image}
                          alt="First slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={projecofuser.image1}
                          alt="Second slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={projecofuser.image2}
                          alt="Third slide"
                        />
                      </Carousel.Item>
                    </Carousel>
                  </Card>
                )
              }

            </div>
          </Col>
        </Row>
      </Container> */}
    </div>
  )
}
