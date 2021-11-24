const express = require('express')
const operations = require("./db-operation/list-db")


const router = express.Router()

//NO-LOGIN ENDPOINT
router.get("/", operations.getAll)
router.get("/getList/:subject", operations.getList)
router.get("/getID/:ID", operations.getById)
router.get("/getSubject/:subject", operations.getBySubject)
router.get("/getName/:name", operations.getByName)

//ADMIN ENDPOINT
router.post("/login", operations.logIn)


module.exports = router