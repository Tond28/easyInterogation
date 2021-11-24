const jwt = require("jsonwebtoken");
const SECRET = require("../../SECRET/SECRET.js")
const e = module.exports

e.verifyToken = async(req, res, next) => {
    let token = req.headers["x-access-token"]

    if (!token) return res.sensStatus(403)

    //jwt.verify
}

