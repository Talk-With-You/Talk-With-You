const express = require('express');
const router = express.Router();
const db = require("./../db/mysql");

//显示评论
router.get("/set/:post_id", (req, res) => {
    let post_id = req.params.post_id;
    let sqlstr = 'SELECT twy_post_reply.text,twy_user.username,twy_post_reply.datetime FROM twy_post_reply JOIN twy_user WHERE twy_post_reply.isdel != 1 and twy_post_reply.post_id = ?';

    db.query(sqlstr, [post_id], (err, resaults) => {
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
                msg: '获取评论列表成功',
                data: resaults
            })
        }
    })
})

//发布评论
router.post("/add/:post_id/:user_id", (req, res) => {
    let post = {
        id: 0,
        post_id: req.params.post_id,
        user_id: req.params.user_id,
        text: req.body.text,
        datetime: req.body.datetime = new Date(),
        isdel: 0
    }
    let sqlstr = "INSERT INTO twy_post_reply SET ?";

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

//删除评论
router.get(`/delete/:id`, (req, res) => {
    let id = req.params.id;
    let sqlstr = `UPDATE twy_post_reply SET twy_post_reply.isdel = 1 WHERE id = ?`;

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

//修改评论
router.post("/update/:id", (req, res) => {
    let text = req.body.text;
    let id = req.params.id;
    let sqlstr = `UPDATE twy_post_reply SET twy_post_reply.text = ? WHERE id = ?`;

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

//通过评论内容查询评论
router.get("/like", (req, res) => {
    let like = `%${req.body.text}%`;
    let sqlstr = `SELECT twy_post_reply.id,text,twy_user.username,datetime FROM twy_post_reply JOIN twy_user WHERE twy_post_reply.isdel != 1 and twy_post_reply.text LIKE ?`;

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