// 导入密码加密中间件
const bcrypt = require("bcryptjs");
// 导入项目配置模块
const config = require("./../config");
// 导入生成token字符串中间件
const jwt = require("jsonwebtoken");
// 导入数据库模块
const db = require("./../db/mysql");
// 导入登录注册信息检验模块
const checkUser = require("./../check/user");

// 注册模块路由处理函数
module.exports.register = (req, res) => {
    // 获取前端传进来的数据
    const userInfo = req.body;
    // 检验前端数据
    const err = checkUser.validate(userInfo, checkUser.schema.register_schema);
    if (err) {
        return res.ck(err);
    }
    // 判断用户名是否存在
    const is_exist_username = "SELECT * FROM twy_users WHERE isDel = 0 AND username=?";
    db.query(is_exist_username, [userInfo.username], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length > 0) {
            return res.ck("该用户名已经被占用，请使用其他用户名！");
        }
        // 判断账号是否存在
        const is_exist_userlogid = "SELECT * FROM twy_users WHERE isDel = 0 AND userlogid=?";
        db.query(is_exist_userlogid, [userInfo.userlogid], (err, result) => {
            if (err) {
                return res.ck(err);
            }
            if (result.length > 0) {
                return res.ck("该账号已经被占用，请使用其他账号！");
            }
            // 用户名和账号都不存在,则对密码进行加密
            userInfo.userpwd = bcrypt.hashSync(userInfo.userpwd, 10);
            // 注册用户sql语句
            const sql = "INSERT INTO twy_users SET ?";
            db.query(sql, [userInfo], (err, result) => {
                if (err) {
                    return res.ck(err);
                }
                if (result.affectedRows !== 1) {
                    return res.ck("注册失败，请稍后再试！");
                }
                res.ck("注册成功！", 0);
            });
        });
    });
}

// 登录模块路由处理函数
module.exports.login = (req, res) => {
    // 获取前端传进来的数据
    const userInfo = req.body;
    // 检验前端数据
    const err = checkUser.validate(userInfo, checkUser.schema.login_schema);
    if (err) {
        return res.ck(err);
    }
    // 判断账号是否存在
    const is_exist_userlogid = "SELECT * FROM twy_users WHERE isDel = 0 AND userlogid = ?";
    db.query(is_exist_userlogid, [userInfo.userlogid], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("登陆失败，登录账号不存在！");
        }
        // 账号存在,判断密码是否正确
        const comparepwd = bcrypt.compareSync(userInfo.userpwd, result[0].userpwd);
        if (!comparepwd) {
            return res.ck("登陆失败，登录密码错误！");
        }
        // 登陆成功,生成token字符串
        const userStr = {
            ...result[0],
            userpwd: '',
            userpicimage: '',
            islogin: true
        };
        // 生成token字符串
        const tokenStr = jwt.sign(userStr, config.secretKey, {
            expiresIn: '24h'
        });
        // 向客户端发送token字符串
        res.send({
            status: 0,
            msg: "登陆成功！",
            token: tokenStr
        });
    });
}

// 根据账号获取用户信息路由处理函数
module.exports.getUser = (req, res) => {
    const userInfo = req.query;
    const err = checkUser.validate(userInfo, checkUser.schema.getUser_schema);
    if (err) {
        return res.ck(err);
    }
    const sql = "SELECT id,userlogid,useremail FROM twy_users WHERE isDel = 0 AND userlogid = ?";
    db.query(sql, [userInfo.userlogid], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("该账号不存在，请检查账号！");
        }
        res.send({
            status: 0,
            msg: "获取用户信息成功！",
            data: result[0]
        });
    });
}

// 发送邮件路由处理函数
module.exports.sendECode = (req, res) => {
    const ecode = require("./../common/createcode");
    const code = ecode(6);
    const sendEmail = require("./../common/sendecode");
    const userInfo = req.body;
    const err = checkUser.validate(userInfo, checkUser.schema.sendCode_schema);
    if (err) {
        return res.ck(err);
    }
    const results = sendEmail(code, userInfo.useremail);
    if (results != 0) {
        return res.ck("邮箱验证码接收失败，请稍后再试！");
    }
    const userStr = {
        id: userInfo.id,
        useremail: userInfo.useremail,
        code: code,
        islogin: false
    };
    const tokenStr = jwt.sign(userStr, config.secretKey, {
        expiresIn: '60s'
    });
    res.send({
        status: 0,
        msg: "邮箱成功接收验证码，有效时间为60s",
        token: tokenStr
    });
}