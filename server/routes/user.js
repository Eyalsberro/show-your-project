const { SQL } = require('../dbconfig')
const router = require('express').Router()
const bcrypt = require('bcrypt');



//LOGIN CUSTOMER/ADMIN
router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send({ err: "You are missing Email or/and Passwored" })

        }

        const user = await SQL(`SELECT userid,name,password,email
        FROM users
        WHERE email="${email}"`)

        if (!await bcrypt.compare(password, user[0].password)) {
            return res.status(400).send({ err: "Wrong Password" })
        }

        if (user.length < 1) {
            return res.status(400).send({ err: "**Wrong Email or/and Password" })

        }
        // res.send({ msg: "Succefull login "})
        req.session.name = user[0].name
        req.session.userid = user[0].userid
        req.session.save();
        res.send(req.session)

    } catch (err) {
        console.log(err);
        return res.status(400).send({ err: "**wrong Name or/and password" })
    }

})


//REGISTER CUSTOMER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, country, city, website, facebook, instagram, linkedin, github, position, aboutme } = req.body

        if (!name) {
            return res.status(400).send({ err: "**Missing Name, all filed are required" })
        }
        if (!password) {
            return res.status(400).send({ err: "**Missing Password, all filed are required" })
        }
        if (!email) {
            return res.status(400).send({ err: "**Missing Email, all filed are required" })
        }
        if (!country) {
            return res.status(400).send({ err: "**Missing Country, all filed are required" })
        }
        if (!city) {
            return res.status(400).send({ err: "**Missing City, all filed are required" })
        }
        if (!position) {
            return res.status(400).send({ err: "**Missing Position, all filed are required" })
        }
        // if (!aboutme) {
        //     return res.status(400).send({ err: "**Missing About Me, all filed are required" })
        // }


        const usertaken = await SQL(`SELECT * 
        FROM users
        WHERE name  = '${name}'`)

        if (usertaken.length !== 0) {
            return res.status(400).send({ err: "**Name already exist, Chosse anoter name" })
        }

        const emailtaken = await SQL(`SELECT * 
        FROM users
        WHERE email = '${email}'`)

        if (emailtaken.length !== 0) {
            return res.status(400).send({ err: "**Email already existed" })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const register = await SQL(`INSERT into users(name,password,email,country,city,website,facebook,instagram,linkedin,github,position,aboutme,image)
        VALUES ('${name}','${hashPassword}' ,'${email}','${country}','${city}', '${website}','${facebook}','${instagram}','${linkedin}','${github}','${position}','${aboutme}','img_568656.png')`)


        console.log(req.body);
        res.send({ msg: "Your profile was created, welcome " + name })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
})


router.delete('/logout', (req, res) => {

    req.session.destroy()
    res.send({ msg: "bye bye! see you soon" })

})


module.exports = router