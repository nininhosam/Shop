const db = require('../database');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

async function findUser(username) {
  return new Promise((resolve, reject) => {
    db.query(`select * 
      from users 
      where username like "${username}";`, (err, response)=>{
        if (err) return reject(err)
        resolve(response)
      })
  })
}

const AccountController = {
  async getUsers(req, res) {
    db.query(`select * from users;`, (err, response)=>{
      if (err) res.status(500).send({"msg": "something went wrong"})
      res.send(response)
    })
  },
  async register(req, res){
    
    const user = await findUser(req.body.username)
    
    if (user == 0) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        
        db.query(`insert 
        into users (username, password) 
        values ('${req.body.username}', '${hashedPassword}');
        `)
  
        res.status(201).send({"msg": "User Registered"})
      } catch (error) {
        res.status(500).send({"msg": "Something went wrong"})
      }
    } else {
      res.status(400).send({"msg": "Username not available"})
    }
  },
  async login(req, res){

    const user = await findUser(req.body.username)

    if (user == 0) {
      return res.status(400).send({ "msg": "Username does not exist"})
    }
    try {
      if(await bcrypt.compare(req.body.password, user[0].password)) {
        const userInfo = { name: user[0].username, id: user[0].id}
        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 300})
        res.json({ accessToken: accessToken})
      } else {
        res.status(401).send({ "msg": "Incorrect username or password"})
      }

    } catch (error) {
      res.status(500).send({ "msg": "Something went wrong"})
    }
  },
  async authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).send({ "msg": "Something went wrong"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userInfo)=>{
      if (err) return res.status(403).send({ "msg": "Unauthorized"})
      req.user = userInfo 
      next()
    })
  }
}

module.exports = AccountController;