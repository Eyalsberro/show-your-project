import React, { useState } from 'react'
import './AddProject.css'
import { javasctiprLanguges, framework, databaseName } from './languagesList';

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


function getStyles(name, languages, theme) {
  return {
    fontWeight:
      languages.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function getStyles1(name, frameworkName, theme) {
  return {
    fontWeight:
      frameworkName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
function getStyles2(name, dbName, theme) {
  return {
    fontWeight:
      dbName.indexOf(name) === -1
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
  const [frameworkName, setFrameworkName] = useState([""])
  const [dbName, setDbName] = useState([""])
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
  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    setFrameworkName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleChange2 = (event) => {
    const {
      target: { value },
    } = event;
    setDbName(
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
    formData.append('Framework', JSON.stringify(frameworkName))
    formData.append('databaseName', JSON.stringify(dbName))
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
        <h1 className='newprojectpage'>Add New Project</h1>
        <Row className='rowsection'>
          <Col className='projectdiv'>
            <div className='inline'>
              <h5>Project Title:</h5>
              <Input
                type='text'
                sx={{ width: '25ch' }}
                placeholder="Give a title to your project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='inline'>
              <h5>Project Link:</h5>
              <Input
                type='text'
                sx={{ width: '25ch' }}
                value={project_link}
                onChange={(e) => setproject_link(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LanguageIcon />
                  </InputAdornment>
                }
              />
            </div>
          </Col>

          <Col className='languCoulum'>
            <h5>Languages:</h5>
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Languages</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={languages}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.filter((chiolangu => chiolangu !== "")).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {javasctiprLanguges.sort().map((name) => (
                    <MenuItem
                      key={Math.random()}
                      value={name}
                      style={getStyles(name, languages, theme)}

                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Framework </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={frameworkName}
                  onChange={handleChange1}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.filter((chiolangu => chiolangu !== "")).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {framework.sort().map((name) => (
                    <MenuItem
                      key={Math.random()}
                      value={name}
                      style={getStyles(name, framework, theme)}

                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Database </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={dbName}
                  onChange={handleChange2}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.filter((chiolangu => chiolangu !== "")).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {databaseName.sort().map((name) => (
                    <MenuItem
                      key={Math.random()}
                      value={name}
                      style={getStyles(name, framework, theme)}

                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </div>
          </Col>
        </Row>

        <Row className='rowsection'>
          <Col className='projectdivabout'>
            <h5>About The Project:</h5>

            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              value={about_the_project}
              onChange={(e) => setabout_the_project(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col>
            <div className='profileImg'>
              <h5>Drop some pictures of your project:</h5>

              <span id="err"></span>

              <Input
                type='file'
                name='image'
                inputProps={{ multiple: true }}
                sx={{ width: '25ch' }}
                onChange={(e) => setImagesrc(e.target.files)}
              />
              <p>Max 3 Pictures</p>
            </div>
          </Col>
        </Row>
        <div className='uploadProject'>
          <button className='btn' onClick={PostNewProject}>Add My Project</button>

        </div>
      </Container>
    </div >
  )
}
