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
import Tooltip from '@mui/material/Tooltip';

import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';


export default function ProjectCardNotSign({ project }) {

  const navigate = useNavigate()
  const [checked, setChecked] = useState(false);
  const [comment, setComment] = useState([]);
  const [conmmentUpdate, setConmmentUpdate] = useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <button {...other} className='iconbtn'><ModeCommentOutlinedIcon /> Comment {comment.length === 0 ? "" : comment.length}</button>;
  })(({ theme }) => ({
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const GoToProfile = () => {
    localStorage.projectUid = project.user_id
    navigate(`profileOfTheUser/${project.user_id}`)
  }

  const projectPicture = [project.image, project.image1, project.image2].filter((projimg => projimg !== ""))
  const theLangu = JSON.parse(project.languages).filter((lang => lang !== ""))



  useEffect(() => {
    (async () => {
      const res = await fetch(`http://54.205.248.142/project/comment/${project.projectid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        credentials: "include"
      })
      const data = await res.json();
      if (data.err) {
        alert(data.err)
      } else {
        setComment(data)
      }
    })();
  }, [conmmentUpdate])



  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const emailtab = () => {
    window.open(`mailto:${project.email}`)
  };

  return (
    <div>

      <Card sx={{ maxWidth: 545 }}>
        <CardHeader
          avatar={
            <Avatar className='profileimage' src={project.profileimage} aria-label="profileimage" onClick={GoToProfile} />
          }

          title={<b>{project.title}</b>}
          subheader={`By: ${project.name}`}
        />
        <CardContent>
          <Typography paragraph variant="subtitle1" color="text.secondary" className='abouttheproject'>
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
          <Tooltip title="You Cant Like The Picture">

            <FormControlLabel
              className='iconbtn'
              label={project.LikesToPorject}
              control={
                <Checkbox checked={checked} inputProps={{ 'aria-label': 'controlled' }} icon={<ThumbUpOffAltIcon />} checkedIcon={<ThumbUpAltIcon />} />
              }
            />
          </Tooltip>

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
