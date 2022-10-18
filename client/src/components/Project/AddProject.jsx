import React, { useState } from 'react'
import './AddProject.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Input from '@mui/material/Input';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const javasctiprLiberey = ['AngularJS', 'Bootstrap', 'Backbone.js', 'Cappuccino', 'Chart.js', 'Dojo Toolkit', 'Ext JS', 'Echo', 'Ember.js', 'Enyo', 'Express.js', 'Foundation', 'jQuery', 'jQWidgets', 'OpenUI5', 'Polymer', 'qooxdoo', 'React.js', 'Vue.js', 'Webix', 'WinJS', 'Svelte', 'Google Closure Library', 'Joose', 'JsPHP', 'Microsoft Ajax library', 'MochiKit', 'PDF.js', 'Socket.IO', 'Spry framework', 'Velocity.js', 'Underscore.js'];

function getStyles(name, languages, theme) {
  return {
    fontWeight:
      languages.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}




export default function AddProject() {

  // title, about_the_project, project_link
  const [imagesrc, setImagesrc] = useState([])
  const [title, setTitle] = useState("")
  const [project_link, setproject_link] = useState("https://")
  const [about_the_project, setabout_the_project] = useState("")
  const [languages, setLanguages] = useState([""])
  const [user_id, setUser_id] = useState(localStorage.id)

  const theme = useTheme();


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setLanguages(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const PostNewProject = async () => {

    let formData = new FormData()

    for (const key of Object.keys(imagesrc)) {
      formData.append('image', imagesrc[key])
    }
    formData.append('title', title)
    formData.append('about_the_project', about_the_project)
    formData.append('project_link', project_link)
    formData.append('languages', JSON.stringify(languages))
    formData.append('user_id', user_id)


    const res = await fetch(`http://52.0.110.158/project`, {
      method: "post",
      // headers: {mode: 'no-cors'},
      body: formData,
    })
    const data = await res.json()
    if (data.err) {
      document.getElementById("err").innerHTML = data.err
    } else {
      console.log(data);
      document.getElementById("err").innerHTML = data.msg
    }

  }


  return (
    <div>
      <Container>
        <Row>
          <Col className='projectdiv'>
            <div className='inline'>
              <h4>Project Title:</h4>
              <Input
                type='text'
                sx={{ width: '25ch' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='inline'>
              <h4>Project Link:</h4>
              <Input
                type='text'
                sx={{ width: '25ch' }}
                value={project_link}
                onChange={(e) => setproject_link(e.target.value)}
              />
            </div>
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={languages}
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {javasctiprLiberey.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, languages, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <select onChange={handleChange} multiple >
                {
                  javasctiprLiberey.map(lang =>
                    <option value={lang} key={lang} >{lang}</option>
                  )
                }
              </select> */}
            </div>
          </Col>
          <Container>
            <Row>
              <Col className='projectdivabout'>
                <h4>About The Project:</h4>

                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={3}
                  value={about_the_project}
                  onChange={(e) => setabout_the_project(e.target.value)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col>
                <div className='profileImg'>
                  <span id="err"></span>

                  <Input
                    type='file'
                    name='image'
                    inputProps={{ multiple: true }}
                    sx={{ width: '25ch' }}
                    onChange={(e) => setImagesrc(e.target.files)}
                  />
                  <button className='btn' onClick={PostNewProject}>Update</button>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </div >
  )
}
