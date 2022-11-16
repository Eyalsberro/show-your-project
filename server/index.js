//imports
 
const express = require('express')
const session = require('express-session')
const { SQL } = require('./dbconfig')
const cors = require('cors')
const bodyParser = require('body-parser');




//initializations
const app = express()
const port =  process.env.PORT || 8080


app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}))

 
app.use(express.json())

//use express static folder
app.use(express.static("./public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(session({
    secret:"myProject",
    name:"session",
    saveUninitialized: true,
    httpOnly: true,
    resave:true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24
    } 
})) 
 


app.use('/user', require('./routes/user'))
app.use('/profile', require('./routes/profile')) 
app.use('/project', require('./routes/project'))

app.listen(port, ()=> console.log(`Server connected Port ${port} `))
 