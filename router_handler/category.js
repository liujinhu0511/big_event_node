const path = require("path")
const db = require(path.join(__dirname, "../utils/db"))

// 获取文章分类列表
module.exports.getCategory = async (req, res) => {
  let r = await db("select * from category where is_delete=0", null, (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.length <= 0) return res.cc("获取文章分类列表失败！")

  res.send({
    status: 0,
    message: "获取文章分类列表成功！",
    data: r,
  })
}

// 添加文章分类
module.exports.addCategory = async (req, res) => {
  let r1 = await db("select * from category where name=? or alias=?", [req.body.name, req.body.alias], (err, result) => {
    if (err) return res.cc(err)
  })
  if (r1.length === 2) return res.cc("分类名称与别名被占用，请稍后重试！")
  if (r1.length === 1 && r1[0].name === req.body.name && r1[0].alias === req.body.alias) return res.cc("分类名称与别名被占用，请稍后重试！")
  if (r1.length === 1 && r1[0].name === req.body.name) return res.cc("分类名称被占用，请稍后重试！")
  if (r1.length === 1 && r1[0].alias === req.body.alias) return res.cc("分类别名被占用，请稍后重试！")

  let r2 = await db("insert into category set ?", req.body, (err, result) => {
    if (err) return res.cc(err)
  })
  if (r2.affectedRows !== 1) {
    return res.cc("添加文章分类失败！")
  }
  res.cc("添加文章分类成功！", 0)
}

// 根据Id删除文章分类
module.exports.delCategory = async (req, res) => {
  let r = await db("update category set is_delete=1 where id=? ", req.params.id, (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.affectedRows !== 1) {
    return res.cc("删除文章分类失败!")
  }

  res.cc("删除文章分类成功！", 0)
}

// 根据Id获取文章分类详情
module.exports.getCateInfo = async (req, res) => {
  let r = await db("select * from category where id=?", req.params.id, (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.length <= 0) return res.cc("获取文章分类详情失败！")

  res.send({
    status: 0,
    message: "获取文章分类详情成功！",
    data: r[0],
  })
}

// 根据Id更新文章分类数据
module.exports.updateCateInfo = async (req, res) => {
  let r1 = await db("select * from category where Id!=? and (name=? or alias =?)", [req.body.Id, req.body.name, req.body.alias], (err, result) => {
    if (err) return res.cc(err)
  })
  if (r1.length === 2) return res.cc("分类名称与别名被占用，请稍后重试！")
  if (r1.length === 1 && r1[0].name === req.body.name) return res.cc("分类名称被占用，请稍后重试！")
  if (r1.length === 1 && r1[0].alias === req.body.alias) return res.cc("分类别名被占用，请稍后重试！")

  let r2 = await db("update category set ? where id=?", [req.body, req.body.Id], (err, result) => {
    if (err) return res.cc(err)
  })
  if (r2.affectedRows !== 1) {
    return res.cc("更新文章分类数据失败！")
  }

  res.cc("更新文章分类数据成功！", 0)
}
