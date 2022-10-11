module.exports.loggedUser = (req, res, next) => {
    if (req.session) {
        next()
    }else {
        res.status(401).send({err: "It's only for logged users"})
    }

}