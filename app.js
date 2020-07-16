const express = require("express")
const cors = require("cors")
const path = require("path")
const joi = require("@hapi/joi")

// 导入配置文件
const config = require(path.join(__dirname, "./config"))
// 解析token的插件
const expressJWT = require("express-jwt")

// 创建服务器对象
const app = express()

// 解决表单数据
app.use(express.urlencoded({ extended: false }))

// 解决跨域
app.use(cors())

// 托管静态资源
app.use("/upload", express.static("./upload"))

// 定义一个全局中间件 ，优化res.send
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 指定哪些接口不需要惊醒token认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 登录模块路由
const loginRouter = require(path.join(__dirname, "./router/login"))
app.use("/api", loginRouter)

// 导入用户信息路由模块
const userRouter = require(path.join(__dirname, "./router/user"))
app.use("/my", userRouter)

// 导入文章分类模块
const categoryRouter = require(path.join(__dirname, "./router/category"))
app.use("/my/article", categoryRouter)

// 导入文章列表模块
const articleRouter = require(path.join(__dirname, "./router/article"))
app.use("/my/article", articleRouter)

// 错误中间件
app.use((err, req, res, next) => {
  // 数据验证错误
  if (err instanceof joi.ValidationError) return res.cc(err)

  // 捕获身份认证失败错误
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败！")
  // 未知错误
  res.cc(err)
})
// 监听事件启动
app.listen(3007, () => {
  console.log("启动了")
})
