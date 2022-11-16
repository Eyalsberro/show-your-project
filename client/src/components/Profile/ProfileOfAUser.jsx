import React from 'react'
import './ProfileOfAUser.css'
import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { LoginIdUser } from '../../Helper/Context';


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


export default function ProfileOfAUser() {

  const [profile1, setProfile1] = useState([])
  const [projectUser1, setProjectUser1] = useState([])

  useEffect(() => {
    (async () => {
      const res = await fetch(`https://api.showyourproject.online/profile/${localStorage.projectUid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        // console.log(data[0]);
        setProfile1(data[0])

      }
    })();

    (async () => {
      const res = await fetch(`https://api.showyourproject.online/project/${localStorage.projectUid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        setProjectUser1(data)

      }
    })();

  }, [])


  return (
    <div>

      <Container>
        <Row>
          <Col sm={4}>
            <div className='profileImg'>
              <img src={profile1.image} alt="profileimage" />
              {
                localStorage.name ? <button>Edit</button> : <></>
              }
            </div>
          </Col>
          <Col sm={8}>
            <div className='profileGenralInfo'>
              <h3>{profile1.name}</h3>
              <p>{profile1.position}</p>
              <p><LocationOnTwoToneIcon />{profile1.city}, {profile1.country}</p>
              <p>{profile1.email}</p>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col sm={4}>
            <div className="profileLinkInfo">
              <p>Personal Website: <a href={profile1.website} target="_blank" rel="noopener noreferrer"><LanguageIcon /></a></p>
              <p>Linkedin: <a href={profile1.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a></p>
              <p>GitHub: <a href={profile1.github} target="_blank" rel="noopener noreferrer"><GitHubIcon /></a></p>
              <p>Facebook: <a href={profile1.facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon /></a></p>
              <p>Instagram: <a href={profile1.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /></a></p>
            </div>
          </Col>
          <Col sm={8}>
            <div className="profileAboutme">
              <h2>About Me</h2>
              <p>{profile1.aboutme}</p>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <div className="projectarea">
              <h2>My Projects</h2>
              {
                projectUser1.map(projecofuser =>
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
                      < Carousel.Item>
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
                      </Carousel.Item>

                    </Carousel>
                  </Card>
                )
              }

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
