const express = require("express")
const path = require("path")
const router = express.Router()
// 加载验证规则模块
const expressJoi = require("@escook/express-joi")
const multer = require("multer")
//创建multer实例对象
const upload = multer({ dest: "upload/" })
// 加载验证规则
const { get_article_schema, add_article_schema, update_article_schema } = require(path.join(__dirname, "../schema/article"))
// 加载文章列表相关处理函数
const articleHandler = require(path.join(__dirname, "../router_handler/article"))

router.get("/list", articleHandler.getArticleList)
router.get("/delete/:id", expressJoi(get_article_schema), articleHandler.delArticle)
router.post("/add", upload.single("cover_img"), expressJoi(add_article_schema), articleHandler.addArticle)
router.get("/:id", articleHandler.getArticle)
router.post("/edit", upload.single("cover_img"), expressJoi(update_article_schema), articleHandler.updateArticle)

module.exports = router
