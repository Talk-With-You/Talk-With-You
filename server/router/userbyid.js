// 导入express框架
const express = require("express");
// 创建路由模块
const router = express.Router();
// 导入路由处理函数模块
const userByIdHandler = require("./../router_handler/userbyid");

// 邮箱动态码验证接口
router.post("/yzecode", userByIdHandler.yzecode);
// 重置密码接口
router.post("/resetpwd", userByIdHandler.resetpwd);

// 共享路由
module.exports = router;