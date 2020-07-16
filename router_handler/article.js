const path = require("path")
const db = require(path.join(__dirname, "../utils/db"))

// 获取文章列表
module.exports.getArticleList = async (req, res) => {
  let pagenum = req.query.pagenum || 1
  let pagesize = req.query.pagesize || 2
  let cate_id = req.query.cate_id
  let state = req.query.state
  // 定义可选参数查询条件
  let condition = ""
  if (cate_id) {
    condition += `cate_id = ${cate_id}  and `
  }
  if (state) {
    condition += `state = '${state}'  and`
  }
  let r1 = await db(
    `select a.Id,a.title,a.pub_date,a.state ,b.name cate_name from article a inner join category b 
    on a.cate_id= b.Id where  ${condition} a.is_delete=0 and a.author_id=? limit ${(pagenum - 1) * pagesize},${pagesize}`,
    req.user.id
  )
  let r2 = await db(`select count(*) total from article where ${condition} author_id = ? and is_delete= 0 `, req.user.id)
  if (r1 && r2) {
    res.send({
      status: 0,
      message: "获取文章列表成功！",
      data: r1,
      total: r2[0].total,
    })
  } else {
    res.cc("获取文章列表失败！")
  }
}

// 根据文章Id删除文章
module.exports.delArticle = async (req, res) => {
  let r = await db("update article set is_delete=1 where id=? ", req.params.id, (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.affectedRows !== 1) {
    return res.cc("删除文章失败!")
  }

  res.cc("删除文章成功！", 0)
}

// 添加文章
module.exports.addArticle = async (req, res) => {
  // 判断文章封面是否上传
  if (!req.file || req.file.fieldname !== "cover_img") return res.cc("文章封面是必选参数！")

  console.log(req.file.filename)
  const data = { ...req.body, cover_img: path.join("/upload", req.file.filename), author_id: req.user.id }

  let r = await db("insert into article set ?", data, (err, result) => {
    if (err) return res.cc(err)
  })

  if (r.length <= 0) {
    return res.cc("添加文章失败！")
  }

  res.cc("添加文章成功！", 0)
}

// 根据Id获取文章详情
module.exports.getArticle = async (req, res) => {
  let r = await db("select * from article where id=?", req.params.id, (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.length <= 0) return res.cc("获取文章详情失败！")

  res.send({
    status: 0,
    message: "获取文章详情成功！",
    data: r[0],
  })
}

// 根据Id更新文章数据
module.exports.updateArticle = async (req, res) => {
  // 判断文章封面是否上传
  if (!req.file || req.file.fieldname !== "cover_img") return res.cc("文章封面是必选参数！")

  const data = { ...req.body, cover_img: path.join("../upload", req.file.filename), author_id: req.user.id }

  let r = await db("update article set ? where id=?", [data, data.Id], (err, result) => {
    if (err) return res.cc(err)
  })
  if (r.affectedRows !== 1) {
    return res.cc("更新文章数据失败！")
  }

  res.cc("更新文章数据成功！", 0)
}
