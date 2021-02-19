// 导入数据库模块
const db = require("./../db/mysql");
// 导入密码加密中间件
const bcrypt = require("bcryptjs");
// 导入用户信息检验模块
const checkInfo = require("./../check/userinfo");

// 获取用户信息路由处理函数
module.exports.getinfo = (req, res) => {
    if (!req.user.islogin) {
        return res.ck("请重新登录!");
    }
    const sql = "SELECT id,username,useremail,userlogid,telnumber,usernick,userpicimage FROM twy_users WHERE isDel = 0 AND id = ?";
    db.query(sql, [req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("获取信息失败，请稍后再试！");
        }
        res.send({
            status: 0,
            msg: "获取用户信息成功！",
            data: result[0]
        });
    });
}

// 修改用户信息路由处理函数
module.exports.editinfo = (req, res) => {
    // 获取前端传入的用户信息
    const userInfo = req.body;
    // 检查前端的数据
    const err = checkInfo.validate(userInfo, checkInfo.schema.editInfo_schema);
    if (err) {
        return res.ck(err);
    }
    if (!req.user.islogin) {
        return res.ck("请重新登录!");
    }
    // 修改的sql语句
    const sql = "UPDATE twy_users SET ? WHERE id = ?";
    db.query(sql, [userInfo, req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("修改信息失败，请稍后再试！");
        }
        res.ck("修改信息成功！", 0);
    });
}

// 修改密码路由处理函数
module.exports.editpwd = (req, res) => {
    // 获取前端传入的用户信息
    const userInfo = req.body;
    // 检验前端传入数据
    const err = checkInfo.validate(userInfo, checkInfo.schema.editPwd_schema1, checkInfo.schema.editPwd_schema2);
    if (err) {
        return res.ck(err);
    }
    if (!req.user.islogin) {
        return res.ck("请重新登录!");
    }
    // 判断用户是否存在
    const is_exist_sql = "SELECT * FROM twy_users WHERE isDel = 0 AND id = ?";
    db.query(is_exist_sql, [req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.length !== 1) {
            return res.ck("该用户不存在！");
        }
        // 判断旧密码和数据库中的密码是否一致
        const comparepwd = bcrypt.compareSync(userInfo.olduserpwd, result[0].userpwd);
        if (!comparepwd) {
            return res.ck("旧密码错误！");
        }
        // 对新密码加密
        userInfo.newuserpwd = bcrypt.hashSync(userInfo.newuserpwd, 10);
        // 修改密码sql
        const editPwd_sql = "UPDATE twy_users SET userpwd = ? WHERE id = ?";
        db.query(editPwd_sql, [userInfo.newuserpwd, req.user.id], (err, result) => {
            if (err) {
                return res.ck(err);
            }
            if (result.affectedRows !== 1) {
                return res.ck("修改密码失败，请稍后再试！");
            }
            res.ck("修改密码成功！", 0);
        });
    });
}

// 修改头像路由处理函数
module.exports.editavatar = (req, res) => {
    // 获取前端传入的用户信息
    const userInfo = req.body;
    // 检验前端传入的信息
    const err = checkInfo.validate(userInfo, checkInfo.schema.editAvatar_schema);
    if (err) {
        return res.ck(err);
    }
    if (!req.user.islogin) {
        return res.ck("请重新登录!");
    }
    // 修改头像sql
    const sql = "UPDATE twy_users SET ? WHERE id = ?";
    db.query(sql, [userInfo, req.user.id], (err, result) => {
        if (err) {
            return res.ck(err);
        }
        if (result.affectedRows !== 1) {
            return res.ck("修改头像失败，请稍后再试！");
        }
        res.ck("修改头像成功！", 0);
    });
}