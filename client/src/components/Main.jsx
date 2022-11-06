import React, { useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import About from './About/About'
import Login from './Login-Register/Login'
import Register from './Login-Register/Register'
import MainPage from './MainPage/MainPage'
import EditProfile from './Profile/EditProfile'
import Profile from './Profile/Profile'
import ProfileOfAUser from './Profile/ProfileOfAUser'
import AddProject from './Project/AddProject'




export default function Main() {

  const [profile, setProfile] = useState([])
  const [projectUser, setProjectUser] = useState([])
  const [userid, setUserid] = useState(localStorage.id ? localStorage.id : localStorage.projectUid)
  const [update, setUpdate] = useState(false)

  let { userIdNum } = useParams();


  useEffect(() => {
    if (localStorage.id) {
      (async () => {
        const res = await fetch(`http://api.eyalsberro.com/profile/${userid}`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data = await res.json();
        if (data.err) {
          alert(data.err)
        } else {
          setProfile(data[0])
          setUpdate(st => !st)
        }
      })();

      (async () => {
        const res = await fetch(`http://api.eyalsberro.com/project/${userid}`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data = await res.json();
        if (data.err) {
          alert(data.err)
        } else {
          setProjectUser(data[0])
        }
      })();

    } else {
      return undefined
    }

  }, [])

  return (
    <div>
      <Routes>
        <Route path='/' element={<MainPage profile={profile} />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profileOfTheUser/:userIdNum' element={<ProfileOfAUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/add-project' element={<AddProject />} />
        <Route path='/editmyprofile' element={<EditProfile profile={profile} projectUser={projectUser} />} />
        <Route path='/about-us' element={<About />} />
      </Routes>
    </div>
  )
}
