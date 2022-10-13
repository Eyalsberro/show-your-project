import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
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



  useEffect(() => {
    if (localStorage.id) {
      (async () => {
        const res = await fetch(`http://52.0.110.158/profile/${userid}`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          credentials: "include"
        })
        const data = await res.json();
        if (data.err) {
          alert(data.err)
        } else {
          console.log(data[0]);
          setProfile(data[0])
        }
      })();

      (async () => {
        const res = await fetch(`http://52.0.110.158/project/${userid}`, {
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
        <Route path='/profileOfTheUser' element={<ProfileOfAUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/add-project' element={<AddProject />} />
        <Route path='/editmyprofile' element={<EditProfile profile={profile} projectUser={projectUser} />} />
        <Route path='/about-us' element={<About />} />
      </Routes>
    </div>
  )
}
