const path = require("path")
const db = require(path.join(__dirname, "../utils/db"))

// 加载生成token
const jwt = require("jsonwebtoken")

// 加载密码加密
const bcrypt = require("bcryptjs")
const { resolveSoa } = require("dns")
const { promises } = require("fs")

// 导入配置文件
const config = require(path.join(__dirname, "../config"))

// 登录处理函数
module.exports.login = async (req, res) => {
  // 查询当前用户是否存在
  let r = await db("select * from user where username = ?", req.body.username)
  if (r.length <= 0) {
    return res.cc("用户不存在，请重新输入！")
  }

  if (!bcrypt.compareSync(req.body.password, r[0].password)) {
    return res.cc("登录失败！")
  }
  const user = { ...r[0], password: "", user_pic: "" }

  const tokenStr = jwt.sign(user, config.jwtSecretKey, {
    expiresIn: "12h", //token的有效期
  })

  res.send({
    status: 0,
    message: "登陆成功！",
    token: "Bearer " + tokenStr,
  })
}

// 注册处理函数
module.exports.regUser = async (req, res) => {
  // 判断用户名是否已经存在
  // console.log(req.body)

  let r1 = await db("select * from user where username = ?", req.body.username, (err, result) => {
    if (err) {
      return res.cc(err)
    }
  })
  if (r1.length > 0) {
    return res.cc("用户名已被占用！")
  }
  // 给用户密码进行加密
  req.body.password = bcrypt.hashSync(req.body.password, 10)

  // 注册新用户
  let r2 = await db("insert into user set ?", { username: req.body.username, password: req.body.password }, (err, result) => {
    if (err) {
      return res.cc(err)
    }
  })
  if (r2.affectedRows !== 1) {
    return res.cc("注册用户失败，请重新输入！")
  }
  res.cc("注册成功！", 0)
}
