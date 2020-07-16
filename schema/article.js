const joi = require("@hapi/joi")

// const pagenum = joi.number().integer()
// const pagesize = joi.number().integer()
const id = joi.number().integer().min(1).required()

const cate_id = joi.number().integer().min(1).required()
const state = joi.string().valid("已发布", "草稿").required()
const content = joi.string().required().allow("")
const title = joi.string().required()

// module.exports.get_article_schema = {
//   params: {
//     pagenum,
//     pagesize,
//   },
// }
module.exports.get_article_schema = {
  params: {
    id,
  },
}

module.exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
}
module.exports.update_article_schema = {
  body: {
    Id: id,
    title,
    cate_id,
    content,
    state,
  },
}
