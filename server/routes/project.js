const { SQL } = require('../dbconfig')
const router = require('express').Router()
const multer = require('multer')





// GET ALL THE PROJECTS///
router.get('/', async (req, res) => {

    try {
        const project = await SQL(`SELECT 
            project.*,
            users.name,
            users.image AS profileimage,
            COUNT(likeapost.isLike) AS LikesToPorject
        FROM
            project
                INNER JOIN
            users ON project.user_id = users.userid
                INNER JOIN
            likeapost ON likeapost.project_id = projectid
        GROUP BY projectid`)

        // const projectnotlike = await SQL(`SELECT project.*, users.name
        // FROM project
        // INNER JOIN users ON project.user_id = users.userid
        // WHERE NOT EXISTS(
        // SELECT NULL
        // FROM likeapost
        // WHERE likeapost.project_id = project.projectid
        // )`)


        // const project = await SQL(`SELECT project.*, users.name 
        // FROM project
        // inner join users on project.user_id = users.userid`)

        res.status(200).send(project)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});
 
// Get all projects liked by user_id 
router.get('/projectliked/:id', async (req, res) => {
    try {
        const { id } = req.params

        const projectliked = await SQL(`SELECT 
            project.*,users.name, users.image AS profileimage, COUNT(likeapost.project_id) AS LikesToPorject
        FROM
            likeapost
                LEFT JOIN
            project ON likeapost.project_id = project.projectid
            LEFT JOIN
            users ON project.user_id = users.userid
        WHERE
            EXISTS( SELECT 
                    *
                FROM
                    likeapost
                WHERE
                    project.projectid = likeapost.project_id
                        AND likeapost.user_id = ${id})
        GROUP BY project.projectid`)
        res.send(projectliked)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
})
 
// Get all projects unliked by user_id 
router.get('/projectunliked/:id', async (req, res) => {
    try {
        const { id } = req.params

        const projectunliked = await SQL(`SELECT 
            project.*,
            users.name,
            users.image AS profileimage,
            COUNT(likeapost.project_id) AS LikesToPorject
        FROM
            likeapost
                LEFT JOIN
            project ON likeapost.project_id = project.projectid
                LEFT JOIN
            users ON project.user_id = users.userid
        WHERE
            NOT EXISTS( SELECT 
                    *
                FROM
                    likeapost
                WHERE
                    project.projectid = likeapost.project_id
                        AND likeapost.user_id = ${id})
        GROUP BY project.projectid`)

        res.send(projectunliked)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
})
  
// GET ALL THE not LIKE pROJECT///
router.get('/projectnotlike', async (req, res) => {

    try {

        const projectnotlike = await SQL(`SELECT project.*, users.name,users.image AS profileimage
        FROM project
        INNER JOIN users ON project.user_id = users.userid
        WHERE NOT EXISTS(
        SELECT NULL
        FROM likeapost
        WHERE likeapost.project_id = project.projectid
        )`)

        res.status(200).send(projectnotlike)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});

// Get comment
router.get('/comment/:id', async (req, res) => {

    try {
        const { id } = req.params

        const getcomment = await SQL(`SELECT comments.*,users.name, users.image AS profileimage
        FROM comments 
        INNER JOIN
            users ON comments.user_id = users.userid WHERE project_id = ${id}`)
        res.status(200).send(getcomment)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
 
});

// GET A SPCIFIC PROJECT BY USER ID///
router.get('/:user_id', async (req, res) => {

    try {
        const project = await SQL(`SELECT * FROM project WHERE user_id = ${req.params.user_id}`)
        res.send(project)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});


//////// Use of Multer ////////////////////
let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')
    },
    filename: (req, file, callBack) => {
        const mimeExtension = {
            'image/jpeg': '.jpeg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
        }
        callBack(null, file.originalname)
    }
})

let upload = multer({
    storage: storage,
    fileFilter: (req, file, callBack) => {
        // console.log(file.mimetype)
        if (file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/gif') {
            callBack(null, true);
        } else {
            callBack(null, false);
            req.fileError = 'File format is not valid';
        }
    }
});


// POST A NEW PROJECT///
// router.post('/', async (req, res) => {
//     try {

//         const { title, about_the_project, project_link,languages, user_id } = req.body

//         const projectnum = await SQL(`INSERT into project(title,about_the_project,project_link,languages,user_id)
//         VALUES('${title}','${about_the_project}','${project_link}','${JSON.stringify(languages)}',${user_id}) `)
//         console.log(projectnum.insertId); 


//         res.send({ msg: "You add a new project"}) 

//     } catch (err) {
//         console.log(err);
//         return res.sendStatus(500)
//     }

// })


// // POST A NEW PROJECT///
router.post('/', upload.single('image'), async (req, res) => {
    try {

        if (!req.file) {
            console.log("You didnt upload a picture for your project");
        }

        const { title, about_the_project, project_link, languages, user_id } = req.body

        const projectnum = await SQL(`INSERT into project(title,about_the_project,project_link,languages,user_id)
        VALUES('${title}','${about_the_project}','${project_link}','${languages}',${user_id}) `)
        console.log(projectnum.insertId);

        console.log(req.file && req.file.filename)
        let imagesrc = 'http://52.0.110.158/images/' + req.file && req.file.filename
        // let imagesrc = 'http://127.0.0.1:5000/images/' + req.file && req.file.filename

        // await SQL(`INSERT into project(image)
        // VALUES('${imgsrc}') `)

        await SQL(`UPDATE project SET image = '${'http://52.0.110.158/images/' + imagesrc}' WHERE projectid = ${projectnum.insertId}`)
        // await SQL(`UPDATE project SET image = '${'http://127.0.0.1:5000/images/' + imagesrc}' WHERE projectid = ${projectnum.insertId}`)

        res.send({ msg: "You add a new project" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})

// router.post('/1', async (req, res) => {

//     try {
//         const { title, about_the_project, project_link, user_id } = req.body

//         const projectnum = await SQL(`INSERT into project(title,about_the_project,project_link,user_id)
//         VALUES('${title}','${about_the_project}','${project_link}',${user_id}) `)
//         console.log(projectnum.insertId);

//         // const { title, about_the_project, image, project_link, user_id } = req.body


//         // await SQL(`INSERT into project(title,about_the_project,image,project_link,user_id)
//         // VALUES('${title}','${about_the_project}',${image},'${project_link}',${user_id}) `)

//         res.send({ msg: "You add a new project" })

//     } catch (err) {
//         console.log(err);
//         return res.sendStatus(500)
//     }

// })  

////////////// Update a project ///////////////



// Update a project /// 
router.put('/:projectid', async (req, res) => {

    try {
        const { title, about_the_project, project_link } = req.body

        await SQL(`UPDATE project SET title = '${title}',about_the_project = '${about_the_project}' ,project_link = '${project_link}' WHERE projectid = ${req.params.projectid} `)

        res.send({ msg: "You update the project" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})

////////////// Update a picture in a project ///////////////

router.post('/picture/:projectid', upload.single('image'), async (req, res) => {

    try {

        let imgsrc = 'http://127.0.0.1:5000/images/' + req.file.filename
        await SQL(`UPDATE project SET image = '${imgsrc}' WHERE projectid = ${req.params.projectid}`)

        res.send({ msg: "You update the project" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})
router.post('/picture1/:projectid', upload.single('image'), async (req, res) => {

    try {

        let imgsrc1 = 'http://127.0.0.1:5000/images/' + req.file.filename
        await SQL(`UPDATE project SET image = '${imgsrc1}' WHERE projectid = ${req.params.projectid}`)

        res.send({ msg: "You update the project" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})
router.post('/picture2/:projectid', upload.single('image'), async (req, res) => {

    try {

        let imgsrc2 = 'http://127.0.0.1:5000/images/' + req.file.filename
        await SQL(`UPDATE project SET image = '${imgsrc2}' WHERE projectid = ${req.params.projectid}`)

        res.send({ msg: "You update the project" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})


// Upload 3 picures to a project /////////
router.post('/pic/:projectid', upload.array('image'), async (req, res) => {

    try {

        let imgsrc = 'http://127.0.0.1:5000/images/' + req.files[0].filename
        let imgsrc1 = 'http://127.0.0.1:5000/images/' + req.files[1].filename
        let imgsrc2 = 'http://127.0.0.1:5000/images/' + req.files[2].filename

        await SQL(`UPDATE project SET image = '${imgsrc}',image1 = '${imgsrc1}' ,image2 = '${imgsrc2}' WHERE projectid = ${req.params.projectid}`)


        // if (!req.files.filename === undefined) {
        //     imgsrc = 'http://127.0.0.1:5000/images/' + req.files[0].filename
        //     imgsrc1 = 'http://127.0.0.1:5000/images/' + req.files[1].filename
        //     imgsrc2 = 'http://127.0.0.1:5000/images/' + req.files[2].filename
        //     await SQL(`UPDATE project SET image = '${imgsrc}',image1 = '${imgsrc1}' ,image2 = '${imgsrc2}' WHERE projectid = ${req.params.projectid}`)
        // } else {
        //     imgsrc1 = null
        //     imgsrc2 = null
        //     await SQL(`UPDATE project SET image = '${imgsrc}',image1 = '${imgsrc1}' ,image2 = '${imgsrc2}' WHERE projectid = ${req.params.projectid}`)

        // }


        // req.files.map((file) => {
        //     let imgsrc = 'http://127.0.0.1:5000/images/' + file.filename
        //     let imgsrc1 = 'http://127.0.0.1:5000/images/' + file[1].filename
        //     // let imgsrc2 = 'http://127.0.0.1:5000/images/' + file[2].filename
        //     // let imgsrc = 'http://127.0.0.1:5000/images/' + file.filename
        //     // let imgsrc1 = 'http://127.0.0.1:5000/images/' + file.filename
        //     // SQL(`UPDATE project SET image = '${imgsrc}'  WHERE projectid = ${req.params.projectid}`)
        //     SQL(`UPDATE project SET image = '${imgsrc}',image1 = '${imgsrc1}' ,image2 = '${imgsrc}' WHERE projectid = ${req.params.projectid}`)


        // })
        // res.send({ msg: "You update the project"})
        res.send(req.files)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})





// Add a comment
router.post('/addcomment', async (req, res) => {
    try {
        const { postComment, user_id, project_id } = req.body

        const addcomment = await SQL(`INSERT into comments(the_comment,user_id,project_id)
        VALUES ('${postComment}',${user_id},${project_id})`)

        res.send({ msg: "Your comment was added successfully" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})

// Delete a Comment
router.delete('/delcomment', async (req, res) => {
    try {
        const { user_id, commentsid } = req.body

        await SQL(`DELETE FROM comments WHERE user_id=${user_id} AND commentsid= ${commentsid} `)

        res.send({ msg: "Comment was deleted" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})

// Add a like
router.post('/addlike', async (req, res) => {
    try {
        const { user_id, project_id } = req.body

        const addlike = await SQL(`INSERT into likeapost(user_id,project_id,isLike)
        VALUES (${user_id},${project_id},1)`)

        res.send({ msg: "You've like the project" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})

// Delete a like
router.delete('/dellike', async (req, res) => {
    try {
        const { user_id, project_id } = req.body

        await SQL(`DELETE FROM likeapost WHERE user_id=${user_id} AND project_id= ${project_id} `)

        res.send({ msg: "like was deleted" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})




module.exports = router



// router.put('imag/:projectid', async (req, res) => {

//     try {
//         const { image } = req.body

//         await SQL(`UPDATE project SET image = '${image}' WHERE projectid = ${req.params.projectid} `)

//         res.send({ msg: "You image the project" })

//     } catch (err) {
//         console.log(err);
//         return res.sendStatus(500)
//     }

// })