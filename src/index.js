const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const opeRouter = require('./router.js')
const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).send('API ONLINE')
})

app.use("/api", opeRouter)


app.use ("", (req,res)=>{
    res.status(404).send()
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))


