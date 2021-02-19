// 导入@hapi/joi中间件
const joi = require("@hapi/joi");

// 创建检验规则
const editInfo_schema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error('用户信息暂时无法修改！')),
    username: joi.string().required().error(new Error('输入用户名格式有误！')),
    useremail: joi.string().required().pattern(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).error(new Error('输入邮箱格式有误！')),
    userlogid: joi.string().alphanum().min(6).max(11).required().error(new Error('输入账号格式有误！')),
    telnumber: joi.string().required().pattern(/^[1][0-9]{10}$/).error(new Error('输入手机号格式有误！')),
    usernick: joi.string().max(16).error(new Error('用户昵称格式有误！'))
});
// 判断旧密码、新密码、重复密码格式是否正确
const editPwd_schema1 = joi.object({
    olduserpwd: joi.string().min(6).max(18).required().error(new Error('旧密码为6-18位任意字符！')),
    // 新密码和旧密码检验规则一样
    newuserpwd: joi.string().min(6).max(18).required().error(new Error('新密码为6-18位任意字符！')),
    // 重复密码和新密码的值保持一致,joi.ref()方法可以判断两个值是相等的
    aginuserpwd: joi.any().valid(joi.ref('newuserpwd')).error(new Error("重复密码和新密码不一致"))
});
// 新密码和旧密码一致抛出的异常
const editPwd_schema2 = joi.object({
    olduserpwd: joi.string().min(6).max(18).required().error(new Error('旧密码为6-18位任意字符')),
    // 新密码和旧密码的值要不一致,如果一致抛出异常
    newuserpwd: joi.not(joi.ref('olduserpwd')).error(new Error("旧密码和新密码一致")),
    aginuserpwd: joi.any().valid(joi.ref('newuserpwd')).required().error(new Error("重复密码和新密码不一致"))
});

// 修改头像验证
const editAvatar_schema = joi.object({
    userpicimage: joi.string().dataUri().required().error(new Error('请选择头像！'))
});

module.exports.schema = {
    editInfo_schema: editInfo_schema,
    editPwd_schema1: editPwd_schema1,
    editPwd_schema2: editPwd_schema2,
    editAvatar_schema: editAvatar_schema
}

module.exports.validate = (data, schema1, schema2 = null) => {
    if (schema2 == null) {
        var {
            error,
            value
        } = schema1.validate(data);
        if (error) {
            return error;
        }
        return null;
    }
    else {
        var {
            error,
            value
        } = schema1.validate(data);
        if (error) {
            return error;
        }
        var {
            error,
            value
        } = schema2.validate(data);
        if (error) {
            return error;
        }
        return null;
    }
}