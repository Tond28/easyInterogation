const express = require('express')
const operations = require("./db-operation/list-db")


const router = express.Router()

router.get("/", operations.getAll)
router.get("/getList/:subject", operations.getList)
router.get("/getID/:ID", operations.getById)
router.get("/getSubject/:subject", operations.getBySubject)
router.get("/getName/:name", operations.getByName)


module.exports = router