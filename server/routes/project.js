const { SQL } = require('../dbconfig')
const router = require('express').Router()
const multer = require('multer')
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto')


const dotenv = require('dotenv')

dotenv.config()

const randonImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});




// GET ALL THE PROJECTS///
router.get('/', async (req, res) => {

    try {
        const projects = await SQL(`SELECT 
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

        for (const project of projects) {

            const getObjectParams = {
                Bucket: bucketName,
                Key: project.profileimage
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            project.profileimage = url

            const getObjectParams1 = {
                Bucket: bucketName,
                Key: project.image
            }
            const command1 = new GetObjectCommand(getObjectParams1);
            const url1 = await getSignedUrl(s3Client, command1, { expiresIn: 3600 });
            project.image = url1

        }

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

        for (const project of projectliked) {

            const getObjectParams = {
                Bucket: bucketName,
                Key: project.profileimage
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            project.profileimage = url

            const getObjectParams1 = {
                Bucket: bucketName,
                Key: project.image
            }
            const command1 = new GetObjectCommand(getObjectParams1);
            const url1 = await getSignedUrl(s3Client, command1, { expiresIn: 3600 });
            project.image = url1

        }

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

        for (const project of projectunliked) {

            const getObjectParams = {
                Bucket: bucketName,
                Key: project.profileimage
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            project.profileimage = url

            const getObjectParams1 = {
                Bucket: bucketName,
                Key: project.image
            }
            const command1 = new GetObjectCommand(getObjectParams1);
            const url1 = await getSignedUrl(s3Client, command1, { expiresIn: 3600 });
            project.image = url1

        }

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

        for (const project of projectnotlike) {

            const getObjectParams = {
                Bucket: bucketName,
                Key: project.profileimage
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            project.profileimage = url

            const getObjectParams1 = {
                Bucket: bucketName,
                Key: project.image
            }
            const command1 = new GetObjectCommand(getObjectParams1);
            const url1 = await getSignedUrl(s3Client, command1, { expiresIn: 3600 });
            project.image = url1

        }

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

        for (const theCommentImage of getcomment) {

            const getObjectParams = {
                Bucket: bucketName,
                Key: theCommentImage.profileimage
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            theCommentImage.profileimage = url

        }

        res.status(200).send(getcomment)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});

// GET A SPCIFIC PROJECT BY USER ID///
router.get('/:user_id', async (req, res) => {

    try {
        const projects = await SQL(`SELECT * FROM project WHERE user_id = ${req.params.user_id}`)

        for (const project of projects) {

            const getObjectParams = {
                Bucket: bucketName,
                Key: project.image
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            project.image = url

        }

        res.send(projects)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});


//////// Use of Multer ////////////////////

let storage = multer.memoryStorage()

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

        const imageName = randonImageName() + req.file.originalname

        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: req.file.buffer,
            contentType: req.file.mimetype,
        }

        const command = new PutObjectCommand(params)

        await s3Client.send(command)

        await SQL(`UPDATE project SET image = '${imageName}' WHERE projectid = ${projectnum.insertId}`)

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
