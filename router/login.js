const express = require("express")
const path = require("path")
const router = express.Router()
// 加载验证规则模块
const expressJoi = require("@escook/express-joi")

const { reg_login_schema } = require(path.join(__dirname, "../schema/login"))

// 导入处理登录页面的处理函数
const loginHandler = require(path.join(__dirname, "../router_handler/login"))

router.post("/reguser", expressJoi(reg_login_schema), loginHandler.regUser)

router.post("/login", expressJoi(reg_login_schema), loginHandler.login)

module.exports = router
