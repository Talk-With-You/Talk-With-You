//导入@hapi/joi第三方中间件
const joi = require("@hapi/joi");

// 创建检验规则
// 注册模块检验规则
const register_schema = joi.object({
    username: joi.string().required().error(new Error('输入用户名格式有误！')),
    useremail: joi.string().required().pattern(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).error(new Error('输入邮箱格式有误！')),
    telnumber: joi.string().required().pattern(/^[1][0-9]{10}$/).error(new Error('输入手机号格式有误！')),
    userlogid: joi.string().alphanum().min(6).max(11).required().error(new Error('输入账号格式有误！')),
    userpwd: joi.string().min(6).max(18).required().error(new Error('输入密码格式有误！'))
});
// 登录模块检验规则
const login_schema = joi.object({
    userlogid: joi.string().alphanum().min(6).max(11).required().error(new Error('输入账号格式有误！')),
    userpwd: joi.string().min(6).max(18).required().error(new Error('用户密码为6-18位任意字符！'))
});

// 根据账号获取用户信息检验规则
const getUser_schema = joi.object({
    userlogid: joi.string().alphanum().min(6).max(11).required().error(new Error('输入账号格式有误！')),
});

// 发送邮箱验证码验证规则
const sendCode_schema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error("id格式有误！")),
    useremail: joi.string().required().pattern(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).error(new Error('输入邮箱格式有误！'))
});

// 重置密码验证规则
const resetPwd_schema = joi.object({
    newuserpwd: joi.string().min(6).max(18).required().error(new Error('新密码为6-18位任意字符！')),
    // 重复密码和新密码的值保持一致,joi.ref()方法可以判断两个值是相等的
    aginuserpwd: joi.any().valid(joi.ref('newuserpwd')).error(new Error("重复密码和新密码不一致！"))
});

module.exports.schema = {
    register_schema: register_schema,
    login_schema: login_schema,
    getUser_schema: getUser_schema,
    sendCode_schema: sendCode_schema,
    resetPwd_schema: resetPwd_schema
};

// 共享检验规则函数
module.exports.validate = (data, schema) => {
    // 解构schema.validate对象
    const {
        error,
        value
    } = schema.validate(data);
    // 如果检验不匹配,那么返回检验提示信息,否则返回null
    if (error) {
        return error;
    }
    return null
}