import React from 'react'
import './Profile.css'
import { useEffect, useState } from 'react';



import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Carousel from 'react-bootstrap/Carousel';

import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';


export default function Profile() {

  const [profile, setProfile] = useState([])
  const [projectUser, setProjectUser] = useState([])
  const [userid, setUserid] = useState(localStorage.id ? localStorage.id : localStorage.projectUid)

  const navigate = useNavigate()

  const handleClickOpen = () => {
    navigate('/editmyprofile')
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://52.0.110.158/profile/${userid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        setProfile(data[0])
      }
    })();

    (async () => {
      const res = await fetch(`http://52.0.110.158/project/${userid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        setProjectUser(data)
      }
    })();

  }, [])




  return (
    <div>
      {
        localStorage.name ? <button onClick={handleClickOpen} className='btn1'>Edit</button> : <></>
      }
      <Container>
        <Row>
          <Col sm={4}>
            <div className='profileImage'>
              <img src={profile.image} alt="profileimg" />
            </div>
          </Col>
          <Col sm={8}>
            <div className='profileGenralInfo'>
              <h3>{profile.name}</h3>
              <p>{profile.position}</p>
              <p><LocationOnTwoToneIcon />{profile.city}, {profile.country}</p>
              <p>{profile.email}</p>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col sm={4}>
            <div className="profileLinkInfo">
              <p>Personal Website: <a href={profile.website} target="_blank" rel="noopener noreferrer"><LanguageIcon /></a></p>
              <p>Linkedin: <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a></p>
              <p>GitHub: <a href={profile.github} target="_blank" rel="noopener noreferrer"><GitHubIcon /></a></p>
              <p>Facebook: <a href={profile.facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon /></a></p>
              <p>Instagram: <a href={profile.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /></a></p>
            </div>
          </Col>
          <Col sm={8}>
            <div className="profileAboutme">
              <h2>About Me</h2>
              <p>{profile.aboutme}</p>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <div className="projectarea">
              <div className='kaka'>
                <h2>My Projects</h2>
              </div>
              {
                projectUser.map(projecofuser =>
                  <Card sx={{ maxWidth: 545 }} key={Math.random()}>
                    <CardHeader
                      title={<b>{projecofuser.title}</b>}
                    />
                    <CardContent>
                      <Typography paragraph variant="subtitle1" color="text.secondary">
                        {projecofuser.about_the_project}
                      </Typography>
                    </CardContent>
                    <Carousel interval="10000">

                      < Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={projecofuser.image}
                          alt="Slide Image"
                        />
                      </Carousel.Item>
                      {/* < Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={projecofuser.image1 ? projecofuser.image1 : projecofuser.image}
                          alt="Slide Image 1"
                        />
                      </Carousel.Item>
                      < Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={projecofuser.image2 ? projecofuser.image2 : projecofuser.image}
                          alt="Slide Image 2 "
                        />
                      </Carousel.Item> */}

                    </Carousel>
                  </Card>
                )
              }
            </div>
          </Col>
        </Row>
      </Container>
    </div >
  )
}
