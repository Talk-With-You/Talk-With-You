// 配置解析token字符串中间件
module.exports = require("express-jwt")({
    secret: require("./../config").secretKey,
    algorithms: ['HS256']
}).unless({
    path: [/^\/info\//]
})