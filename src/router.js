const express = require('express')
const operations = require("./db-operation/list-db")
const {verifyToken} = require("./middleware/authJwt")


const router = express.Router()

//NO-LOGIN ENDPOINT
router.get("/", operations.getAll)
router.get("/getList/:subject", operations.getList)
router.get("/getID/:ID", operations.getById)
router.get("/getSubject/:subject", operations.getBySubject)
router.get("/getName/:name", operations.getByName)

//ADMIN ENDPOINT
router.post("/login", operations.logIn)
router.post("/add", verifyToken, operations.addElements)
router.post("/logOut")
router.post("/remove", verifyToken, operations.removeElements)
router.post("/modify", verifyToken, operations.modifyElements)

//SUPERADMIN ENDPOINT
router.post("/sAdmin/signup", verifyToken, operations.newSignUp)
router.post("/sAdmin/delete", verifyToken, operations.deleteUser)
router.post("/sAdmin/role", verifyToken, operations.changeRole)

router.get("/test", (req, res)=>{
    res.send(req.status)
})


module.exports = router