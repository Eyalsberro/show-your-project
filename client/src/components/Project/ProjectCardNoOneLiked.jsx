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
import ShareIcon from '@mui/icons-material/Share';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

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
    navigate(`profileOfTheUser/${project.user_id}`)
  }

  const projectPicture = [project.image, project.image1, project.image2].filter((projimg => projimg !== ""))
  const theLangu = JSON.parse(project.languages).filter((lang => lang !== ""))

  const GiveLike = async () => {
    if (localStorage.id) {
      const res = await fetch('http://52.0.110.158/project/addlike', {
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

  }

  const toggleChecked = () => {
    setChecked(prev => !prev);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://52.0.110.158/project/comment/${project.projectid}`, {
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
    const res = await fetch(`http://52.0.110.158/project/addcomment`, {
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

          title={<b>{project.title}</b>}
          subheader={`By: ${project.name}`}
        />
        <CardContent>
          <Typography paragraph variant="subtitle1" color="text.secondary">
            {project.about_the_project}
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
                JSON.parse(project.Framework).filter((lang => lang !== "")).map(lang =>
                  <Chip key={lang} label={lang} />
                )
              }
            </span>
          </div>
          <div className="language">
            <span>Database:

              {
                JSON.parse(project.databaseName).filter((lang => lang !== "")).map(lang =>
                  <Chip key={lang} label={lang} />
                )
              }
            </span>
          </div>

          <a target="_blank" rel="noopener noreferrer" href={project.project_link}>Link To Project</a>
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
          {
            localStorage.id ?
              <FormControlLabel
                className='iconbtn'
                label={project.LikesToPorject}
                onChange={GiveLike}
                control={
                  <Checkbox checked={checked} inputProps={{ 'aria-label': 'controlled' }} icon={<ThumbUpOffAltIcon />} checkedIcon={<ThumbUpAltIcon />} />
                }
              />
              :
              <Tooltip title="You Cant Like The Picture">

                <FormControlLabel
                  className='iconbtn'
                  label={project.LikesToPorject}
                  onChange={GiveLike}
                  control={
                    <Checkbox checked={checked} inputProps={{ 'aria-label': 'controlled' }} icon={<ThumbUpOffAltIcon />} checkedIcon={<ThumbUpAltIcon />} />
                  }
                />
              </Tooltip>
          }


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
