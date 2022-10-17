const { SQL } = require('../dbconfig');
const { loggedUser } = require('../helper/loggedUser');
const router = require('express').Router()
const multer = require('multer')
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto')
const dotenv = require('dotenv');
const { headersHelp } = require('../helper/headersHelp');


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

// GET INFO OF USER (for profile)
router.get('/:user_id', async (req, res) => {

    try {
        const useraddress = await SQL(`SELECT userid,name,email,country,city,website,facebook,instagram,linkedin,github,position,aboutme,image 
        FROM users
        WHERE userid = ${req.params.user_id}`)

        const getObjectParams = { 
            Bucket: bucketName,
            Key: useraddress[0].image
        }
        
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        useraddress[0].image = url

        res.send(useraddress)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});

// EDIT PROFILE
router.put('/generalinfo/:user_id', async (req, res) => {
    try {

        const { name, email, country, city, position } = req.body

        await SQL(`UPDATE users
        SET email='${email}', country='${country}',city='${city}', position='${position}', name='${name}'
        WHERE userid = ${req.params.user_id}`)

        res.send({ msg: "Your General info was updated!" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})

// EDIT PROFILE
router.put('/social/:user_id', async (req, res) => {
    try {

        const { website, facebook, instagram, linkedin, github } = req.body

        await SQL(`UPDATE users
        SET website='${website}', facebook='${facebook}', instagram='${instagram}',linkedin='${linkedin}', github='${github}'
        WHERE userid = ${req.params.user_id}`)

        res.send({ msg: "Your Social links was updated!" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})

// EDIT PROFILE
router.put('/aboutme/:user_id', async (req, res) => {
    try {

        const { aboutme } = req.body

        await SQL(`UPDATE users
        SET aboutme='${aboutme}'
        WHERE userid = ${req.params.user_id}`)

        res.send({ msg: "About me was updated!" })

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})



//////// Use of Multer ////////////////////
// let storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, './public/images/')
//     },
//     filename: (req, file, callBack) => {
//         console.log(file);
//         const mimeExtension = {
//             'image/jpeg': '.jpeg',
//             'image/jpg': '.jpg',
//             'image/png': '.png',
//             'image/gif': '.gif',
//         }
//         // callBack(null, file.fieldname + '-' + Date.now() + mimeExtension[file.mimetype])
//         callBack(null, file.originalname)
//     }
// })

let storage = multer.memoryStorage()


let upload = multer({
    storage: storage,
    fileFilter: (req, file, callBack) => {
        console.log(file.mimetype)
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

// EDIT picture PROFILE
router.post('/pic/:user_id', upload.single('image'),headersHelp, async (req, res) => {

    try {

        const imageName = randonImageName() + req.file.originalname

        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: req.file.buffer,
            contentType: req.file.mimetype,
        }

        const command = new PutObjectCommand(params)

        await s3Client.send(command)


        await SQL(`UPDATE users SET image = '${imageName}' WHERE userid = ${req.params.user_id}`)

        res.send({ msg: "You update the profile picture" })

    } catch (err) {
        console.log(err);
        return res.send(500).send("Image type not support")
    }

})



module.exports = router