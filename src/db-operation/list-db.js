const e = module.exports
const mysql = require("mysql2")
const {pool} = require("./utils-db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { createHmac } = require("crypto")
const {jwtSECRET, jwtEXPIRES, cipher, password} = require("../../SECRET/SECRET.js")


const getPasswordHmac = (password, cipher) => {
  return createHmac("sha256", cipher)
    .update(password)
    .digest("hex")
}

e.getAll = async(req, res)=>{
  var query = `SELECT * FROM calendar WHERE status = "Non interrogato" ORDER BY date ASC`
  const {start, limit} = req.query
  if (start && limit) {
    query+= ` LIMIT ?,?`
  }
  var [numValues] = await pool.promise().query(`SELECT COUNT(*) FROM calendar WHERE status = "Non interrogato"`)
  if (!numValues[0]["COUNT(*)"]) return res.sendStatus(204)
  var [data] = await pool.promise().query(query, [Number(start), Number(limit)])
  data[data.length] = numValues[0]
  res.status(200).send(data)
}

e.getList = async(req, res)=>{
  var query = `SELECT * FROM calendar WHERE subject = ? ORDER BY date ASC`
  const {start, limit} = req.query
  if (start && limit) {
    query+= ` LIMIT ?,?`
  }
  var [numValues] = await pool.promise().query(`SELECT COUNT(*) FROM calendar WHERE subject = ?`, req.params.subject)
  if (!numValues[0]["COUNT(*)"]) return res.sendStatus(204)
  var [data] = await pool.promise().query(query, [req.params.subject, Number(start), Number(limit)])
  data[data.length] = numValues[0]
  res.status(200).send(data)
}

e.getById = async(req, res)=>{
  var [data] = await pool.promise().query(`SELECT * FROM calendar WHERE id = ?`, [req.params.ID])
  if (!data.length)  return res.sendStatus(204)
  res.status(200).send(data)
}

e.getBySubject = async(req, res)=>{
  var query = `SELECT * FROM calendar WHERE subject = ? AND status = "Non interrogato" ORDER BY date ASC`
  const {start, limit} = req.query
  if (start && limit) {
    query+= ` LIMIT ?, ?`
  }
  var [numValues] = await pool.promise().query(`SELECT COUNT(*) FROM calendar WHERE subject = ? AND status = "Non interrogato"`, req.params.subject)
  if (!numValues[0]["COUNT(*)"]) return res.sendStatus(204)
  var [data] = await pool.promise().query(query, [req.params.subject, Number(start), Number(limit)])
  data[data.length] = numValues[0]
  res.status(200).send(data)
}

e.getByName = async(req, res)=>{
  var query = `SELECT * FROM calendar WHERE name = ? AND status = "Non interrogato" ORDER BY date ASC`
  const {start, limit} = req.query
  if (start && limit) {
    query+=` LIMIT ?, ?`
  }
  var [numValues] = await pool.promise().query(`SELECT COUNT(*) FROM calendar WHERE name = ? AND status = "Non interrogato"`, req.params.name)
  if (!numValues[0]["COUNT(*)"]) return res.sendStatus(204)
  var [data] = await pool.promise().query(query, [req.params.name, Number(start), Number(limit)])
  data[data.length] = numValues[0]
  res.status(200).send(data)
}

//ADMIN ENDPOINT
e.logIn = async(req, res) =>{
  try {
    if (!req.body.email || !req.body.password){
      return res.status(401).json({message: "Inserire email e password"})
    }
    var [data] = await pool.promise().query(`SELECT * FROM admins WHERE email = ?`, req.body.email)
    if (!data.length) return res.status(204).send({message: "UserNotFound"})
    const {id, firtName, secondName, email, password: DBPassword, status} = data[0]

    if (bcrypt.compareSync(getPasswordHmac(req.body.password, cipher), DBPassword)){
      const JWT = jwt.sign({userId:id, userStatus:status}, jwtSECRET, {
        algorithm: "HS512",
        expiresIn: jwtEXPIRES
      })
      return res.status(200).json({
        userId: id,
        userFirstName: firtName,
        userSecondName: secondName,
        userEmail: email,
        userStatus: status,
        jwt: JWT
      })
    } else {
      return res.status(401).send({message: "checkPassword"})
    }
  } catch (err){
    res.status(500).json({error: err})
  }
}

e.test = async()=>{
  for(var i = 0; i<10000000000; i++){
  }
  console.log("finish")
}