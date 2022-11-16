import React, { useEffect } from 'react'
import './MainPage.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState } from 'react'
import ProjectCard from '../Project/ProjectCard'
import ProjectCardNotSign from '../Project/ProjectCardNotSign'

export default function MainPage({ profile }) {

  const [projectsLiked, setProjectsLiked] = useState([])
  const [projects, setProjects] = useState([])
  const [update, setUpdate] = useState(false);
  const [currUserId, setCurrUserId] = useState(localStorage.id);
  const [titleProject, setTitleProject] = useState([]);
  // const [checked, setChecked] = useState(false);

  // useEffect(() => {
  //   const itsliked = localStorage.getItem('liked');
  //   if (itsliked) {
  //     setChecked(JSON.parse(itsliked))
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.liked = JSON.stringify(checked)
  // }, [checked])



  useEffect(() => {
    if (localStorage.id) {
      (async () => {
        const res = await fetch(`https://api.showyourproject.online/project/projectliked/${currUserId}`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data = await res.json();
        if (data.err) {
          alert(data.err)
        } else {
          setProjectsLiked(data)
        }
      })();

      // (async () => {
      //   const res = await fetch(`https://api.showyourproject.online/project/getlikelist`, {
      //     method: 'GET',
      //     headers: { 'content-type': 'application/json' },
      //     credentials: "include"
      //   })
      //   const data = await res.json();
      //   if (data.err) {
      //     alert(data.err)
      //   } else {
      //     const items = JSON.parse(localStorage.getItem('items'));
      //     if (items) {
      //       setItems(items);
      //     }
      //     console.log(data);
      //   }
      // })();


    } else {

      (async () => {
        const res = await fetch(`https://api.showyourproject.online/project/all`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data = await res.json();
        if (data.err) {
          alert(data.err)
        } else {
          setProjects(data)
        }
      })();

    }

  }, [update])

  useEffect(() => {

    (async () => {
      const res = await fetch(`https://api.showyourproject.online/project`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        setTitleProject(data)
      }
    })();

  }, [])

  return (
    <div className='mainpage'>
      <Container>
        <Row>
          <Col xs={9} className='project'>
            {
              localStorage.id ?
                <>
                  {
                    projectsLiked.map(projectliked => <ProjectCard key={projectliked.projectid} projectliked={projectliked} setUpdate={setUpdate} profile={profile} />)
                  }
                </>
                :
                <>
                  {
                    projects.map(project => <ProjectCardNotSign key={project.projectid} project={project} setUpdate={setUpdate} />)
                  }
                </>
            }
          </Col>
          <Col xs={3} className='projecttitle'>
            <h4>Last Projects Add</h4>
            {
              titleProject.map((pop) => (
                <div key={pop.title}>
                  <p>{pop.title}</p>
                </div>
              ))
            }
          </Col>
        </Row>
      </Container>
    </div>
  )
}
