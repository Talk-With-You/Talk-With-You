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

// 验证邮箱动态码的路由处理函数
module.exports.yzecode = (req, res) => {
    if (req.user.islogin) {
        return res.ck("请重新找回密码！");
    }
    // 如果邮箱动态码不一致
    if (req.user.code !== req.body.code) {
        return res.ck("邮箱动态码错误,请重新输入的邮箱动态码!");
    }
    // 如果一致,则生成新的token,用于进行找回密码的下一步操作
    const userStr = {
        id: req.user.id,
        islogin: false
    };
    const tokenStr = jwt.sign(userStr, config.secretKey, {
        expiresIn: '10m'
    });
    res.send({
        status: 0,
        msg: "邮箱动态码验证成功!",
        token: tokenStr
    });
}

// 重置密码的路由处理函数
module.exports.resetpwd = (req, res) => {
    if (req.user.islogin) {
        return res.ck("请重新找回密码!");
    }
    const userInfo = req.body;
    const err = checkUser.validate(userInfo, checkUser.schema.resetPwd_schema);
    if (err) {
        return res.ck(err);
    }
    const sql = "SELECT * FROM twy_users WHERE isDel = 0 AND id = ?";
    db.query(sql, [req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("用户不存在,请稍后再试！");
        }
        // 执行修改密码操作
        const sqleditpwd = "UPDATE twy_users SET userpwd = ? WHERE id = ?";
        // 对新密码进行加密
        userInfo.newuserpwd = bcrypt.hashSync(userInfo.newuserpwd, 10);
        db.query(sqleditpwd, [userInfo.newuserpwd, req.user.id], (err, results) => {
            if (err) {
                return res.ck(err);
            }
            if (results.affectedRows !== 1) {
                return res.ck("重置密码失败,请稍后再试！");
            }
            res.ck("重置密码成功！", 0);
        });
    });
}