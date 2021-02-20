const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG, EILSEQ } = require('constants');
const { Router } = require('express');
const express = require('express');
const router = express.Router();
const db = require("./../db/mysql");

//获取论坛列表
router.get("/set", (req, res) => {
    let sqlstr = "SELECT twy_post.id,text,twy_user.username,datatime FROM twy_post JOIN twy_user WHERE twy_post.isdel != 1";

    db.query(sqlstr, (err, resaults) => {
        //200成功，500失败
        if (err) {
            res.send({
                status: 500,
                msg: err.message,
                data: null
            })
        } else {
            res.send({
                status: 200,
                msg: '获取论坛列表成功',
                data: resaults
            })
        }
    })
})

//发布论坛（将论坛添加进数据库）
router.post("/add", (req, res) => {
    let post = {
        id: 0,
        user_id: req.body.id,
        text: req.body.text,
        datatime: req.body.datatime = new Date(),
        isdel: 0
    }

    let sqlstr = "INSERT INTO twy_post SET ?";

    //200发布成功，400发布失败，500报错
    db.query(sqlstr, post, (err, resaults) => {
        if (err) {
            res.send({
                status: 500,
                msg: err.message,
                data: null
            })
        } else {
            if (resaults.affectedRows === 1) {
                res.send({
                    status: 200,
                    msg: "发布成功",
                    data: resaults.affectedRows
                })
            } else {
                res.send({
                    status: 400,
                    msg: "发布失败",
                    data: resaults.affectedRows
                })
            }
        }
    })
})

//删除论坛
router.get(`/delete/:id`, (req, res) => {
    let id = req.params.id;
    let sqlstr = `UPDATE twy_post SET twy_post.isdel = 1 WHERE id = ?`;

    //200删除成功，400删除失败，500报错
    db.query(sqlstr, [id], (err, resaults) => {
        if (err) {
            res.send({
                status: 500,
                msg: err.message,
                data: null
            })
        } else {
            if (resaults.affectedRows === 1) {
                res.send({
                    status: 200,
                    msg: "删除成功",
                    data: resaults.affectedRows
                })
            } else {
                res.send({
                    status: 400,
                    msg: "删除失败",
                    data: resaults.affectedRows
                })
            }
        }
    })
})

//修改论坛
router.post("/update/:id", (req, res) => {
    let text = req.body.text;
    let id = req.params.id;
    let sqlstr = `UPDATE twy_post SET twy_post.text = ? WHERE id = ?`;

    //200修改成功，400修改失败，500报错
    db.query(sqlstr, [text, id], (err, resaults) => {
        if (err) {
            res.send({
                status: 500,
                msg: err.message,
                data: null
            })
        } else {
            if (resaults.affectedRows === 1) {
                res.send({
                    status: 200,
                    msg: "修改成功",
                    data: resaults.affectedRows
                })
            } else {
                res.send({
                    status: 400,
                    msg: "修改失败",
                    data: resaults.affectedRows
                })
            }
        }
    })
})

//通过论坛标题查询论坛
router.post("/like", (req, res) => {
    let like = `%${req.body.text}%`;
    let sqlstr = `SELECT twy_post.id,text,twy_user.username,datatime FROM twy_post JOIN twy_user WHERE twy_post.isdel != 1 and twy_post.text LIKE ?`;

    db.query(sqlstr, [like], (err, resaults) => {
        //200成功，500失败
        if (err) {
            res.send({
                status: 500,
                msg: err.message,
                data: null
            })
        } else {
            res.send({
                status: 200,
                msg: '获取论坛列表成功',
                data: resaults
            })
        }
    })
})

module.exports = router;