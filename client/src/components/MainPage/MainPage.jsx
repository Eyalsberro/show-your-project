import React, { useEffect } from 'react'
import './MainPage.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState } from 'react'
import ProjectCard from '../Project/ProjectCard'
import ProjectCardNotLiked from '../Project/ProjectCardNotLiked'
import ProjectCardNoOneLiked from '../Project/ProjectCardNoOneLiked'

export default function MainPage({ profile }) {

  const [projectsLiked, setProjectsLiked] = useState([])
  const [projectsUnLike, setProjectsUnLike] = useState([])
  const [projectsNoOneLike, setProjectsNoOneLike] = useState([])
  const [projects, setProjects] = useState([])
  const [update, setUpdate] = useState(false);
  const [currUserId, setCurrUserId] = useState(localStorage.id);
  const [titleProject, setTitleProject] = useState([]);


  useEffect(() => {
    if (localStorage.id) {
      (async () => {
        const res = await fetch(`http://52.0.110.158/project/projectliked/${currUserId}`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data = await res.json();
        if (data.err) {
          alert(data.err)
        } else {
          console.log(data);
          setProjectsLiked(data)
        }
      })();

      (async () => {
        const res = await fetch(`http://52.0.110.158/project/projectunliked/${currUserId}`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data = await res.json();
        if (data.err) {
          alert(data.err)
        } else {
          console.log(data);
          setProjectsUnLike(data)
        }
      })();

      (async () => {
        const res = await fetch('http://52.0.110.158/project/projectnotlike', {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data1 = await res.json();
        if (data1.err) {
          alert(data1.err)
        } else {
          console.log(data1);
          setProjectsNoOneLike(data1)
        }
      })();
    } else {

      (async () => {
        const res = await fetch(`http://52.0.110.158/project/all`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data = await res.json();
        if (data.err) {
          alert(data.err)
        } else {
          console.log(data);
          setProjects(data)
        }
      })();



      (async () => {
        const res = await fetch('http://52.0.110.158/project/projectnotlike', {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data1 = await res.json();
        if (data1.err) {
          alert(data1.err)
        } else {
          console.log(data1);
          setProjectsNoOneLike(data1)
        }
      })();
    }

  }, [update])

  useEffect(() => {

    (async () => {
      const res = await fetch(`http://localhost:5000/project`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        console.log(data);
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
                  {
                    projectsUnLike.map(projectunliked => <ProjectCardNotLiked key={projectunliked.projectid} projectunliked={projectunliked} setUpdate={setUpdate} profile={profile} />)
                  }
                  {
                    projectsNoOneLike.map(project => <ProjectCardNoOneLiked key={project.projectid} project={project} setUpdate={setUpdate} profile={profile} />)
                  }

                </>
                :
                <>
                  {
                    projects.map(project => <ProjectCardNoOneLiked key={project.projectid} project={project} setUpdate={setUpdate} />)
                  }
                  {
                    projectsNoOneLike.map(project => <ProjectCardNoOneLiked key={project.projectid} project={project} setUpdate={setUpdate} />)
                  }
                </>
            }
          </Col>
          <Col xs={3} className='project'>
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
