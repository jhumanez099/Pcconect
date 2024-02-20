const {Pool} = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'root',
  database: 'PCCONECT'
})

module.exports = pool;