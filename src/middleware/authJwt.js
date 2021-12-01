const jwt = require("jsonwebtoken");
const {jwtSECRET} = require("../../SECRET/SECRET.js")
const e = module.exports

e.verifyToken = async(req, res, next) => {
    let token = req.headers["x-access-token"]

    if (!token) return res.sendStatus(403)

    jwt.verify(token, jwtSECRET, (err, decoded)=>{
        if (err){
            return res.status(401).send({message: "Non autorizzato"})
        }
        req.status = decoded.userStatus
        req.userID = decoded.userID
        next()
    })
}

