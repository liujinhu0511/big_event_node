const path = require("path")
const db = require(path.join(__dirname, "../utils/db"))

// 加载密码加密
const bcrypt = require("bcryptjs")

// 获取用户信息处理函数
module.exports.getUserInfo = async (req, res) => {
  let r = await db("select id,username,nickname,email,user_pic from user where id=?", req.user.id, (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.length === 1) {
    res.send({
      status: 0,
      message: "获取用户基本信息成功！",
      data: r[0],
    })
  } else {
    return res.cc("获取用户信息失败！")
  }
}

// 更新用户基本信息处理函数
module.exports.updateUserInfo = async (req, res) => {
  let r = await db("update user set ? where id=?", [req.body, req.body.id], (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.affectedRows === 1) {
    res.cc("更新用户信息成功！", 0)
  }
  return res.cc("更新用户信息失败！")
}

// 重置密码
module.exports.resetPwd = async (req, res) => {
  // 查询该用户是否存在
  let r1 = await db("select * from user where id=?", req.user.id, (err, result) => {
    if (err) return res.cc(err)
  })

  if (r1.length !== 1) {
    return res.cc("用户不存在")
  }
  const flog = bcrypt.compareSync(req.body.oldPwd, r1[0].password)
  if (!flog) {
    return res.cc("原密码错误！")
  }
  //加密新密码
  const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

  let r2 = await db("update user set password=? where id=?", [newPwd, req.user.id], (err, result) => {
    if (err) return res.cc(err)
  })
  if (r2.affectedRows !== 1) {
    return res.cc("修改密码失败！")
  }
  res.cc("修改密码成功！", 0)
}

// 更换头像
module.exports.updateAvatar = async (req, res) => {
  let r = await db("update user set user_pic=? where id=?", [req.body.avatar, req.user.id], (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.affectedRows !== 1) {
    return res.cc("更新头像失败！")
  }
  res.send({
    status: 0,
    message: "更新头像成功！",
  })
}
