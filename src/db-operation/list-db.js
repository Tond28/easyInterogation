const e = module.exports
const mysql = require("mysql2")
const {pool} = require("./utils-db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { createHmac } = require("crypto")
const {jwtSECRET, jwtEXPIRES, cipher} = require("../../SECRET/SECRET.js")



const getPasswordHmac = (password, cipher) => {
  return createHmac("sha256", cipher)
    .update(password)
    .digest("hex")
}

e.getAll = async(req, res)=>{
  try {
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
  } catch (err) {
    return res.status(500).send({error: err})
  }
}
  

e.getList = async(req, res)=>{
  try {
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
  } catch (err){
    return res.status(500).send({error: err})
  }
  
}

e.getById = async(req, res)=>{
  try {
    var [data] = await pool.promise().query(`SELECT * FROM calendar WHERE id = ?`, [req.params.ID])
    if (!data.length)  return res.sendStatus(204)
    res.status(200).send(data)
  } catch (err){
      return res.status(500).send({error: err})
  }
  
}

e.getBySubject = async(req, res)=>{
  try {
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
  } catch (err){
    return res.status(500).send({error: err})
  }
  
}

e.getByName = async(req, res)=>{
  try {
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
  } catch (err){
    return res.status(500).send({error: err})
  }
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

e.addElements = async (req, res) =>{
  /* DA INSERIRE NEL CLIENT, DEVE ESSERE PASSATA UNA LISTA CON UNA LISTA CON LE LISTE [[[value1], [value2]]], INVIARE COME JSON
  var date = new Date()
  date = date. getFullYear () + '-' + (date. getMonth () + 1 ) + '-' + date. getDate ();
  console.log(date)
  var values = [[["cane relativamente asciutto", "filosofia", "2022-01-10", date, "Non interrogato"],
                 ["cane relativamente asciutto", "filosofia", "2022-01-15", date, "Non interrogato"]]]
  */
  try {
    await pool.promise().query(`INSERT INTO calendar (name, subject, date, insertDate, status) VALUES ?`, req.body.values)
    res.status(200).send("OK")
  } catch (err) {
    return res.status(500).send({error: err})
  }
}

e.removeElements = async (req, res) =>{
  try {
    await pool.promise().query(`DELETE FROM calendar WHERE id IN ?`, req.body.values)
    return res.status(200).send("OK")
  } catch (err) {
    return res.status(500).send({error: err})
  }
}

e.modifyElements = async (req, res) =>{
  var query = `INSERT INTO calendar (id, name, subject, date, insertDate, status) VALUES ? 
  ON DUPLICATE KEY UPDATE name=VALUES(name), subject=VALUES(subject), date=VALUES(date), insertDate=VALUES(insertDate), status=VALUES(status);`
  try{
    await pool.promise().query(query, req.body.values)
    return res.status(200).send("OK")
  } catch (err){
    return res.status(500).send({error: err})
  }
}

//SUPERADMIN ENDPOINT
e.newSignUp = async (req, res) =>{ //DA CONTROLLARE
  
  try {
  [data] = await pool.promise().query(`SELECT * FROM admins WHERE email = ?`, req.body.values[0][0][2])
  if (data.length){
    return res.status(409).send("email già presente")
  }
    if (req.status != "superAdmin"){
      return res.status(401).send({message: "Non autorizzato"})
    }
    
    var values = req.body.values
    values[0][0][3] = bcrypt.hashSync(getPasswordHmac(values[0][0][3], cipher), 10)
    await pool.promise().query(`INSERT INTO admins (firstName, SecondName, email, password, status) VALUES ?`, values)
    return res.status(200).send("OK")
  } catch (err){
    return res.status(500).send({error: err})
  }
}

e.deleteUser = async(req, res) =>{
  try {
    if (req.status != "superAdmin"){
      return res.status(401).send({message: "Non autorizzato"})
    }
    await pool.promise().query(`DELETE FROM admins WHERE id IN ?`, req.body.values)
    return res.status(200).send("OK")
  } catch (err){
    return res.status(500).send({error: err})
  }
}

e.changeRole = async(req, res) =>{
  try{
    if (req.status != "superAdmin"){
      return res.status(401).send({message: "Non autorizzato"})
    }
    console.log(data)
    var query = `UPDATE admins SET status = ? where id = ?`
    await pool.promise().query(query, [data[1], data[0]])
    return res.status(200).send("OK")
  }catch (err){
    res.status(500).send({error: err})
  }
}

e.test = async()=>{
  for(var i = 0; i<10000000000; i++){
  }
  console.log("finish")
}