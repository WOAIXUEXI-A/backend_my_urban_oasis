const mysql = require('mysql2/promise');
require('dotenv').config();

class DBUtils {
  constructor(config) {
    if (!DBUtils.instance) {
      this.pool = mysql.createPool({
        host: config.host || process.env.DB_HOST,
        port: config.port || process.env.DB_PORT,
        user: config.user || process.env.DB_USER,
        password: config.password || process.env.DB_PASSWORD,
        database: config.database || process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: config.connectionLimit || 20,
        queueLimit: 0
      });
      DBUtils.instance = this;
    }
    return DBUtils.instance;
  }


  static getInstance(config) {
    if (!DBUtils.instance) {
      DBUtils.instance = new DBUtils(config);
    }
    return DBUtils.instance;
  }


  async query(sql, params = []) {
    const [rows] = await this.pool.query(sql, params);
    return rows;
  }

  async execute(sql, params = []) {
    const [result] = await this.pool.execute(sql, params);
    return result;
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async close() {
    await this.pool.end();
    DBUtils.instance = null;
  }
}
  
module.exports = DBUtils;