// 导入express框架
const express = require("express");
// 创建服务器
const app = express();
// 导入项目配置文件
const config = require("./config");

// 导入用户信息路由
const userInfoRouter = require("./router/userinfo");
// 导入用户登录注册路由
const userRouter = require("./router/user");
// 导入找回密码路由
const userFindPwd_Router = require("./router/userbyid");
const post = require("./router/post");
const reply = require('./router/reply');

// 配置cors中间件为全局
app.use(require("cors")());
// 配置解析json数据中间件
app.use(express.json());
// 配置解析表单数据中间件
app.use(express.urlencoded({
    extended: false
}));

// 响应数据中间件
app.use(require("./middleware/response_data"));

// 配置解析token字符串中间件
app.use(require("./middleware/analysis_token"));

// 匹配用户信息模块路由
app.use("/info", userInfoRouter);
// 匹配用户登录注册模块路由
app.use("/logreg", userRouter);
// 匹配找回密码模块路由
app.use("/findpwd",userFindPwd_Router);
app.use("/post", post);
app.use("/reply", reply);

// 错误级中间件
app.use(require("./middleware/error_token"));

// 指定端口号并启动服务器
app.listen(config.port, config.url, () => {
    console.log(`服务器正常开启！访问http://${config.url}:${config.port}`);
});



