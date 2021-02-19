// 导入express框架
const express = require("express");
// 创建路由
const router = express.Router();
// 导入用户信息路由处理函数
const userInfoHandler = require("./../router_handler/userinfo");

// 获取用户信息接口
router.get("/getinfo", userInfoHandler.getinfo);
// 修改用户信息的接口
router.post("/editinfo", userInfoHandler.editinfo);
// 修改密码的接口
router.post("/editpwd", userInfoHandler.editpwd);
// 修改头像的接口
router.post("/editavatar", userInfoHandler.editavatar);

// 共享路由
module.exports = router;