const e = module.exports
const mysql = require("mysql2")
const {pool} = require("./utils-db")

e.getAll = async(req, res)=>{
  var query = `SELECT * FROM calendar WHERE status = "Non interrogato" ORDER BY date ASC`
  const {start, limit} = req.query
  if (start && limit) {
    query+= ` LIMIT ?,?`
  }
  var [data] = await pool.promise().query(query, [Number(start), Number(limit)])
  if (!data.length ) return res.sendStatus(204)
  res.status(200).send(data)
}

e.getList = async(req, res)=>{
  var query = `SELECT * FROM calendar WHERE subject = ? ORDER BY date ASC`
  const {start, limit} = req.query
  if (start && limit) {
    query+= ` LIMIT ?,?`
  }
  var [data] = await pool.promise().query(query, [req.params.subject, Number(start), Number(limit)])
  if (!data.length) return res.sendStatus(204)
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
  var [data] = await pool.promise().query(query, [req.params.subject, Number(start), Number(limit)])
  if (!data.length)  return res.sendStatus(204)
  res.status(200).send(data)
}

e.getByName = async(req, res)=>{
  var query = `SELECT * FROM calendar WHERE name = ? AND status = "Non interrogato" ORDER BY date ASC`
  const {start, limit} = req.query
  if (start && limit) {
    query+=` LIMIT ?, ?`
  }
  var [data] = await pool.promise().query(query, [req.params.name, Number(start), Number(limit)])
  if (!data.length) return res.sendStatus(204)
  res.status(200).send(data)
}

e.test = async()=>{
  for(var i = 0; i<10000000000; i++){
    if (i%10000000 === 0){
    }
  }
  console.log("finish")
}