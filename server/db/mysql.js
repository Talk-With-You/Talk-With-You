// 导入mysql模块
const mysql = require("mysql");

// 导入config模块
const config = require("./../config");

// 创建数据库连接
const db = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

// 共享数据库连接
module.exports = db;