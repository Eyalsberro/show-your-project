import React, { useEffect, useState } from 'react'
import './ProjectCard.css'

import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';


import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';




export default function ProjectCard({ projectliked, setUpdate, profile, getLikedList, projectsLiked }) {

  const navigate = useNavigate()
  const [comment, setComment] = useState([]);
  const [postComment, setPostComment] = useState("");
  const [conmmentUpdate, setConmmentUpdate] = useState(false);
  const [checked, setChecked] = useState(false);
  

  useEffect(() => {
    const itsliked = localStorage.getItem(`${projectliked.projectid}`);
    if (itsliked) {
      setChecked(JSON.parse(itsliked))
    }
  }, []);

  useEffect(() => {

    localStorage.setItem(`${projectliked.projectid}`, JSON.stringify(checked));

  }, [checked])

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <button {...other} className='iconbtn'><ModeCommentOutlinedIcon /> Comment {comment.length == 0 ? "" : comment.length}</button>;
  })(({ theme }) => ({
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const GoToProfile = () => {
    localStorage.projectUid = projectliked.user_id
    navigate(`profileOfTheUser/${projectliked.user_id}`)
  }

  const projectPicture = [projectliked.image, projectliked.image1, projectliked.image2].filter((projimg => projimg !== ""))
  const theLangu = JSON.parse(projectliked.languages).filter((lang => lang !== ""))

  // let existlike = getLikedList.filter(liked => liked.project_id = 2)
  // let kaka = getLikedList.filter(liked => projectsLiked.includes(liked.project_id))
  // let kaka = getLikedList.filter(liked => projectsLiked.includes(liked.user_id))
  // let kaka = projectliked.includes(getLikedList.project_id)
  // console.log(kaka);

  // useEffect(() => {
  //   if (kaka) {
  //     setChecked(true)
  //   } else {

  //   }
  // }, [])


  const likeAndUnliked = async (e) => {
    if (checked === false) {
      const res = await fetch('http://localhost:8080/project/addlike', {
        method: "post",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_id: localStorage.id, project_id: projectliked.projectid }),
        credentials: "include"
      })
      const data = await res.json()
      if (data.err) {
        alert(data.err)
      } else {
        console.log(data);
        toggleChecked()
        setUpdate(up => !up)
      }

    } else {

      const res = await fetch('http://localhost:8080/project/dellike', {
        method: "delete",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_id: localStorage.id, project_id: projectliked.projectid }),
        credentials: "include"
      })
      const data = await res.json()
      console.log(data);
      toggleChecked()
      setUpdate(up => !up)
    }


  }

  const toggleChecked = () => {
    setChecked(prev => !prev);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:8080/project/comment/${projectliked.projectid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        // console.log(data);
        setComment(data)
      }
    })();
  }, [conmmentUpdate])


  const PostAComment = async () => {
    const res = await fetch(`http://localhost:8080/project/addcomment`, {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ postComment, user_id: localStorage.id, project_id: projectliked.projectid }),
      credentials: "include"
    })
    const data = await res.json()
    console.log(data);
    setConmmentUpdate(up => !up)
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      PostAComment();
      setPostComment("")
    }
  };



  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const emailtab = () => {
    window.open(`mailto:${projectliked.email}`)
  };


  return (
    <div>

      <Card sx={{ maxWidth: 545 }}>
        <CardHeader
          avatar={
            <Avatar className='profileimage' src={projectliked.profileimage} aria-label="profileimage" onClick={GoToProfile} />
          }

          title={<b>{projectliked.title}</b>}
          subheader={`By: ${projectliked.name}`}
        />
        <CardContent>
          <Typography paragraph variant="subtitle1" color="text.secondary" className='abouttheproject'>
            {projectliked.about_the_project}
          </Typography>
          <div className="language">
            <span>Language:

              {
                theLangu.map(lang =>
                  <Chip key={lang} label={lang} />
                )
              }
            </span>
          </div>
          <div className="language">
            <span>Framework:

              {
                JSON.parse(projectliked.Framework).filter((lang => lang !== "")).map(lang =>
                  <Chip key={lang} label={lang} />
                )
              }
            </span>
          </div>
          <div className="language">
            <span>Database:

              {
                JSON.parse(projectliked.databaseName).filter((lang => lang !== "")).map(lang =>
                  <Chip key={lang} label={lang} />
                )
              }
            </span>
          </div>

          <a target="_blank" rel="noopener noreferrer" href={projectliked.project_link}>Link To Project</a>

        </CardContent>
        <Carousel interval="10000">
          {
            projectPicture.map(image =>
              < Carousel.Item key={Math.random()}>
                <img
                  className="d-block w-100"
                  src={image || 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA='}
                  onError={e => e.target.style.display = 'none'}
                  alt="Slide"
                />
              </Carousel.Item>
            )
          }

        </Carousel>


        <CardActions className='iconsproject'>
          <FormControlLabel
            className='iconbtn'
            label={projectliked.LikesToPorject}
            onChange={likeAndUnliked}
            control={
              <Checkbox checked={checked} inputProps={{ 'aria-label': 'controlled' }} icon={<ThumbUpOffAltIcon />} checkedIcon={<ThumbUpAltIcon />} />
            }
          />

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
          </ExpandMore>

          <button className='iconbtn' onClick={emailtab}><SendOutlinedIcon /> Email</button>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>

            <div className='commentsection'>
              <Avatar className='avatarcomment' src={profile.image} aria-label="nameofuser" />

              <input
                className='inputComment'
                type="text"
                placeholder='Add a comment...'
                value={postComment}
                onChange={(e) => setPostComment(e.target.value)}
                onKeyPress={handleKeypress} />
            </div>

            {
              comment.map((comments) =>

                <div key={comments.commentsid} className='commentsection'>
                  <Avatar className='avatarcomment' src={comments.profileimage} aria-label="nameofuser" />
                  <Typography className='typocomment'><b>{comments.name}</b>{comments.the_comment}</Typography>
                </div>

              )
            }

          </CardContent>
        </Collapse>

      </Card>
    </div>
  )
}

