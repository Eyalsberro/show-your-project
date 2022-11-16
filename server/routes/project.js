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


// GET ALL THE PROJECTS OF DATABASE///
router.get('/', async (req, res) => {

    try {
        const project = await SQL(`SELECT project.user_id, project.title From project`)

        res.status(200).send(project)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});

// GET ALL THE PROJECTS FOR UNSIGN USERS///
router.get('/all', async (req, res) => {

    try {
        const projects = await SQL(`SELECT 
        project.*,
        users.name,
        users.email,
        users.image AS profileimage,
        COUNT(likeapost.project_id) AS LikesToPorject
        FROM
        project
            LEFT JOIN
        users ON project.user_id = users.userid
            LEFT JOIN
        likeapost ON likeapost.project_id = projectid
        GROUP BY projectid `)

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
            if (project?.image) {
                project.image = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams1), { expiresIn: 3600 });
            }

            const getObjectParams2 = {
                Bucket: bucketName,
                Key: project.image1
            }
            if (project?.image1) {
                project.image1 = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams2), { expiresIn: 3600 });
            }

            const getObjectParams3 = {
                Bucket: bucketName,
                Key: project.image2
            }
            if (project?.image2) {
                project.image2 = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams3), { expiresIn: 3600 });
            }

        }

        res.status(200).send(projects)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});

// GET ALL THE PROJECTS FOR SIGN USERS//
router.get('/projectliked/:id', async (req, res) => {
    try {
        const { id } = req.params

        const projectliked = await SQL(`SELECT 
        project.*,
        users.name,
        users.email,
        users.image AS profileimage,
        COUNT(likeapost.project_id) AS LikesToPorject
        FROM
        project
            LEFT JOIN
        users ON project.user_id = users.userid
            LEFT JOIN
        likeapost ON likeapost.project_id = projectid
        GROUP BY projectid `)

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
            if (project?.image) {
                project.image = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams1), { expiresIn: 3600 });
            }

            const getObjectParams2 = {
                Bucket: bucketName,
                Key: project.image1
            }
            if (project?.image1) {
                project.image1 = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams2), { expiresIn: 3600 });
            }

            const getObjectParams3 = {
                Bucket: bucketName,
                Key: project.image2
            }
            if (project?.image2) {
                project.image2 = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams3), { expiresIn: 3600 });
            }

        }

        res.send(projectliked)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
})


// Get COMMENTS //
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

// Get Likes list //
router.get('/getlikelist', async (req, res) => {
    try {
        const getlikelists = await SQL(`SELECT likeapostid,user_id FROM likeapost`)
        res.status(200).send(getlikelists)
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

            const getObjectParams1 = {
                Bucket: bucketName,
                Key: project.image
            }
            if (project?.image) {
                project.image = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams1), { expiresIn: 3600 });
            }

            const getObjectParams2 = {
                Bucket: bucketName,
                Key: project.image1
            }
            if (project?.image1) {
                project.image1 = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams2), { expiresIn: 3600 });
            }

            const getObjectParams3 = {
                Bucket: bucketName,
                Key: project.image2
            }
            if (project?.image2) {
                project.image2 = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams3), { expiresIn: 3600 });
            }
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
            file.mimetype === 'image/svg' ||
            file.mimetype === 'image/webp' ||
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
router.post('/', upload.array('image', 3), async (req, res) => {
    try {

        const { title, about_the_project, project_link, languages, databaseName, Framework, user_id } = req.body

        const projectnum = await SQL(`INSERT into project(title,about_the_project,project_link,languages,databaseName,Framework,user_id)
        VALUES('${title}','${about_the_project}','${project_link}','${languages}','${databaseName}','${Framework}',${user_id}) `)
        console.log(projectnum.insertId);

        const files = req.files

        const params = files.map((file) => {
            return {
                Bucket: bucketName,
                Key: randonImageName() + file.originalname,
                Body: file.buffer,
                contentType: file.mimetype,
            };
        });

        await Promise.all(
            params.map((param) => s3Client.send(new PutObjectCommand(param)))
        );


        if (params[2]?.Key && params[1]?.Key) {
            await SQL(`UPDATE project SET image = '${params[0].Key}' ,image1 = '${params[1].Key}' ,image2 = '${params[2].Key}' WHERE projectid = ${projectnum.insertId}`)
            console.log("im params everthing");
        } else if (params[1]?.Key) {
            await SQL(`UPDATE project SET image = '${params[0].Key}' ,image1 = '${params[1].Key}' ,image2 = 'undefined' WHERE projectid = ${projectnum.insertId}`)
            console.log("im params 1");
        } else {
            await SQL(`UPDATE project SET image = '${params[0].Key}' ,image1 = 'undefined' ,image2 = 'undefined' WHERE projectid = ${projectnum.insertId}`)
            console.log("im parars 0");
        }

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
router.post('/pic/:id', upload.array('image', 3), async (req, res) => {

    try {

        const files = req.files

        const params = files.map((file) => {
            return {
                Bucket: bucketName,
                Key: randonImageName() + file.originalname,
                Body: file.buffer,
            };
        });

        const results = await Promise.all(
            params.map((param) => s3Client.send(new PutObjectCommand(param)))
        );

        console.log(params[0].Key, params[1].Key, params[2].Key);
        console.log(results);

        await SQL(`UPDATE project SET image = '${params[0].Key}',image1 = '${params[1].Key}' ,image2 = '${params[2].Key}' WHERE projectid = ${req.params.id}`)


        return res.json({ status: "success" });

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

        // const alreadyLike = await SQL(`SELECT * 
        // FROM likeapost
        // WHERE project_id = '${project_id}' AND user_id = '${user_id}'`)

        // if (alreadyLike.length !== 0) {
        //     return res.status(400).send({ err: "Cant like the project again" })
        // }

        const addlike = await SQL(`INSERT into likeapost(user_id,project_id,isLike)
        VALUES (${user_id},${project_id},1)`)

        res.send({ msg: "You've like the project", addlike })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})

// Delete a like
router.delete('/dellike', async (req, res) => {
    try {
        const { user_id, project_id } = req.body

        const deletelike = await SQL(`DELETE FROM likeapost WHERE user_id=${user_id} AND project_id= ${project_id} `)

        res.send({ msg: "like was deleted", deletelike })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})






module.exports = router
