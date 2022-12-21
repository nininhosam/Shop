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
async function getPerms(id) {
  return new Promise((resolve, reject) => {
    db.query(`select *
    from perms
    where user_id = ${id}`, (err, response)=>{
      if (err) return reject(err)
      resolve(response)
    })
  })
}
const AccountController = {
  async getUsers(req, res) {

    if (req.user.perms > 0){
      db.query(`select users.id, users.username, count(carts.cart_id) orders, perms.perm_level
      from users
      left join carts on users.id = carts.user_id
      left join perms on users.id = perms.user_id
      group by users.id;`, (err, response)=>{
        if (err) res.status(500).send({"msg": "something went wrong"})
        res.send(response)
      })
    } else {
      res.status(403).send({"msg": "Unauthorized."})
    }
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

        let newUser = await findUser(req.body.username)
        db.query(`insert into perms (user_id, perm_level) values (${newUser[0].id}, 0);`, (err, res)=>{
          if (err) console.log(err)
        })
  
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
        const perms = await getPerms(user[0].id)
        let permLevel = 0
        if (perms != 0) {
          permLevel = perms[0].perm_level
        }

        const userInfo = { name: user[0].username, id: user[0].id, perms: permLevel}
        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 300})
        res.json({ accessToken: accessToken, perms: permLevel, username: user[0].username})
      } else {
        res.status(401).send({ "msg": "Incorrect username or password"})
      }

    } catch (error) {
      res.status(500).send({ "msg": "Something went wrong"})
    }
  },
  async setPerms(req, res) {
    if (req.user.perms > 1){
      const reqPerm = req.body.perm_level
      const user = await findUser(req.body.username)
      if (user == 0) {
        return res.status(400).send({ "msg": "Username does not exist"})
      } else {
          db.query(`update perms set perm_level = ${reqPerm} where user_id = ${user[0].id};`, (err)=>{
            if (err) res.status(500).send({"msg": "Something went wrong"})
            else res.send({"msg": "Updated perms"})
          })
      }
    } else {
      res.status(403).send({"msg": "Unauthorized."})
    }
  },
  async delUser(req, res) {
    if (req.user.perms > 1){
      let { id } = req.params
      const user = await findUser(id)
      db.query(`delete from users 
        where id = ${user[0].id};`, (err, result)=>{
          if (err) res.status(500).send({"msg": "something went wrong"})
          else res.send({"msg": "deleted."})
      })
    } else {
      res.status(403).send({"msg": "unauthorized"})
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
  },
}

module.exports = AccountController;