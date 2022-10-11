import React, { useEffect, useState } from 'react'
import './ProjectCard.css'

import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <button {...other} className='iconbtn'><ModeCommentOutlinedIcon /> Comment</button>;
})(({ theme }) => ({
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ProjectCard({ project, setUpdate, profile }) {

  const navigate = useNavigate()
  const [checked, setChecked] = useState(false);
  const [comment, setComment] = useState([]);
  const [postComment, setPostComment] = useState("");
  const [conmmentUpdate, setConmmentUpdate] = useState(false);


  const GoToProfile = () => {
    localStorage.projectUid = project.user_id
    navigate('profileOfTheUser')
  }

  const projectPicture = [project.image, project.image1, project.image2]
  const theLangu = JSON.parse(project.languages)

  const GiveLike = async () => {
    const res = await fetch('http://localhost:5000/project/addlike', {
      method: "post",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ user_id: localStorage.id, project_id: project.projectid }),
      credentials: "include"
    })
    toggleChecked()
    const data = await res.json()
    if (data.err) {
      alert(data.err)
    } else {
      setUpdate(up => !up)
    }
    console.log(data);

  }

  const toggleChecked = () => {
    setChecked(prev => !prev);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:5000/project/comment/${project.projectid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        console.log(data);
        setComment(data)
      }
    })();
  }, [conmmentUpdate])

  const PostAComment = async () => {
    const res = await fetch(`http://localhost:5000/project/addcomment`, {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ postComment, user_id: localStorage.id, project_id: project.projectid }),
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

  return (
    <div>

      <Card sx={{ maxWidth: 545 }}>
        <CardHeader
          avatar={
            <Avatar src={project.profileimage} aria-label="profileimage" onClick={GoToProfile} />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={<b>{project.title}</b>}
          subheader={`By: ${project.name}`}
        />
        <CardContent>
          <Typography paragraph variant="subtitle1" color="text.secondary">
            {project.about_the_project}
          </Typography>
          <a target="_blank" rel="noopener noreferrer" href={project.project_link}>Link To Project</a>
          {

            theLangu?.map(lang =>

              <p key={Math.random()}>
                {lang}
              </p>
            )
          }
          {/* <ul>
              <li>{JSON.parse(project.languages)}</li>
            </ul> */}

          {/* <p>{JSON.parse(project.languages)}</p> */}
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
            label={project.LikesToPorject}
            onChange={GiveLike}
            control={
              <Checkbox checked={checked} inputProps={{ 'aria-label': 'controlled' }} icon={<ThumbUpOffAltIcon />} checkedIcon={<ThumbUpAltIcon />} />
            }
          />


          {/* <span className='iconbtn' onChange={handleChange}></span>
          <Checkbox inputProps={{ 'aria-label': 'controlled' }} label="Call me" icon={<ThumbUpOffAltIcon />} checkedIcon={<ThumbUpAltIcon />} />  */}

          {/* <button className='iconbtn' onChange={handleChange}>
            <ThumbUpOffAltIcon /> Like
          </button> */}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
          </ExpandMore>
          {/* <button className='iconbtn'><ModeCommentOutlinedIcon /> Comment</button> */}
          <button className='iconbtn'><SendOutlinedIcon /> Send</button>
          <button className='iconbtn'><ShareIcon /> Share</button>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {localStorage.id ?
              <div className='commentsection'>
                <Avatar className='avatarcomment' src={profile.image} aria-label="nameofuser" />
                {/* {localStorage.id ? <Avatar className='avatarcomment' src={profile.image} aria-label="nameofuser" /> : ""} */}


                <input
                  className='inputComment'
                  type="text"
                  placeholder='Add a comment...'
                  value={postComment}
                  onChange={(e) => setPostComment(e.target.value)}
                  onKeyPress={handleKeypress} />
              </div>
              :
              ""

            }
            {/* <div className='commentsection'>
              {localStorage.id ? <Avatar className='avatarcomment' src={profile.image} aria-label="nameofuser" /> : ""}


              <input
                className='inputComment'
                type="text"
                placeholder='Add a comment...'
                value={postComment}
                onChange={(e) => setPostComment(e.target.value)}
                onKeyPress={handleKeypress} />
            </div> */}

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
