const joi = require("@hapi/joi")

const id = joi.number().integer().min(1).required()
const username = joi.string().alphanum().min(1).max(18)
const nickname = joi.string().min(1).max(10).required()
const email = joi.string().email().required()
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required()
const avatar = joi.string().dataUri().required()

module.exports.update_user_schema = {
  body: {
    id,
    nickname,
    email,
    username,
  },
}

module.exports.reset_pwd_schema = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref("oldPwd")).concat(password),
    rePwd: joi.string().pattern(/^[\S]{6,12}$/),
  },
}

module.exports.update_avatar = {
  body: {
    avatar,
  },
}
