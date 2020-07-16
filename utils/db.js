module.exports = (sql, params = null, callback) => {
  const mysql = require("mysql")

  const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "980511",
    database: "bigevent_server",
  })

  return new Promise((resolve, reject) => {
    conn.connect()
    conn.query(sql, params, (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}
