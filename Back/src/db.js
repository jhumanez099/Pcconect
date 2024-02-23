const {Pool} = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'root',
  database: 'pcconect'
})

module.exports = pool;