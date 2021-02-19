// 导入express框架
const express = require("express");
// 创建路由模块
const router = express.Router();
// 导入路由处理函数模块
const userHandler = require("./../router_handler/user");

// 注册路由接口
router.post("/register", userHandler.register);
// 登录路由接口
router.post("/login", userHandler.login);
// 根据账号获取用户信息路由接口
router.get("/getuser", userHandler.getUser);
// 发送邮件路由接口
router.post("/sendecode", userHandler.sendECode);

// 共享路由
module.exports = router;