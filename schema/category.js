const joi = require("@hapi/joi")

const name = joi.string().required()
const alias = joi.string().alphanum().required()

const id = joi.number().integer().min(1).required()

module.exports.add_cate_schema = {
  body: {
    name,
    alias,
  },
}

module.exports.get_cate_schema = {
  params: {
    id,
  },
}

module.exports.update_cate_schema = {
  body: {
    Id: id,
    name,
    alias,
  },
}
