const express = require("express")
const path = require("path")
const router = express.Router()
// 加载验证规则模块
const expressJoi = require("@escook/express-joi")

const { add_cate_schema, get_cate_schema, update_cate_schema } = require(path.join(__dirname, "../schema/category"))
// 加载文章分类相关的处理函数
const categoryHandler = require(path.join(__dirname, "../router_handler/category"))
router.get("/cates", categoryHandler.getCategory)

router.post("/addcates", expressJoi(add_cate_schema), categoryHandler.addCategory)

router.get("/deletecate/:id", expressJoi(get_cate_schema), categoryHandler.delCategory)

router.get("/cates/:id", expressJoi(get_cate_schema), categoryHandler.getCateInfo)

router.post("/updatecate", expressJoi(update_cate_schema), categoryHandler.updateCateInfo)

module.exports = router
