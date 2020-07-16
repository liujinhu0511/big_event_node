const express = require("express")
const path = require("path")

const expressJoi = require("@escook/express-joi")

const router = express.Router()

// 导入关于用户相关接口的处理函数
const userHandler = require(path.join(__dirname, "../router_handler/user"))

// 导入自定义验证规则
const { update_user_schema, update_avatar, reset_pwd_schema } = require(path.join(__dirname, "../schema/user"))
// 获取用户信息
router.get("/userinfo", userHandler.getUserInfo)
// 更新用户信息
router.post("/userinfo", expressJoi(update_user_schema), userHandler.updateUserInfo)
// 重置密码
router.post("/updatepwd", expressJoi(reset_pwd_schema), userHandler.resetPwd)
// 更换头像
router.post("/update/avatar", expressJoi(update_avatar), userHandler.updateAvatar)

// 导出路由模块
module.exports = router
