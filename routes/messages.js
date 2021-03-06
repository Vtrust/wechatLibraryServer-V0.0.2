/**
 * Created by 14798 on 2017/6/25.
 * 微信端获得所有消息
 */
var express = require('express');
var moment = require('moment');
var router = express.Router();
var UserModel = require('../models/users');// 用户模型
var BookStatusModel = require('../models/bookStatus');
var MessageModel = require('../models/messages');

var checkLogin = require('../middlewares/check').checkLogin;

// /messages 获得所有消息
router.get('/', function (req, res, next) {
    MessageModel.getUsers().then(function (users) {
        res.render('users', {
            users: users
        });
    }).catch(next);
});

// GET /messages/:userId/edit 更新用户页面
router.get('/:userId/edit', checkLogin, function (req, res, next) {
    var id = req.params.userId;
    UserModel.getUserById(id)
        .then(function (user) {
            if (!user) {
                throw new Error('该用户不存在');
            }
            BookStatusModel.getBookStatusByUserId(id).then(function (bstatus) {
                res.render('userEdit', {
                    user: user,
                    bstatus: bstatus
                });
            });

        })
        .catch(next);
});

// POST /users/:userId/edit 更新用户信息
router.post('/:userId/edit', checkLogin, function (req, res, next) {
    // 获取变量值
    var _id = req.params.userId;
    var phone = req.fields.phone;
    var idCard = req.fields.idCard;

    //模板赋值
    var user = {
        phone: phone,
        idCard: idCard
    };
    console.log(_id);
    UserModel.updateUserById(_id, user)
        .then(function () {
            console.log("成功");
            req.flash('success', '编辑用户成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/users/${_id}/edit`);
        })
        .catch(next);
});

// GET /users/:userId/remove 删除一个用户
router.get('/:userId/remove', checkLogin, function (req, res, next) {
    var userId = req.params.userId;
    UserModel.delUserById(userId)
        .then(function () {
            req.flash('success', '删除用户成功');
            // 删除成功后跳转到用户管理
            res.redirect('/users');
        })
        .catch(next);
});

// GET /users/:userId/status/:statusId/edit 更新状态页面
router.get('/:userId/status/:statusId/edit', checkLogin, function (req, res, next) {
    var id = req.params.statusId;
    BookStatusModel.getBookStatusByStatusId(id)
        .then(function (status) {
            if (!status) {
                throw new Error('该用户不存在');
            }
            res.render('bookStatusEdit', {
                bstatus: status
            });
        })
        .catch(next);
});

// POST /users/:userId/status/:statusId/edit 更新状态
router.post('/:userId/status/:statusId/edit', checkLogin, function (req, res, next) {
    // 获取变量值
    var userId = req.params.userId;
    var _id = req.params.statusId;
    var bookId = req.fields.bookId;
    var type = req.fields.type;

    //模板赋值
    var status = {
        bookId: bookId,
        type: type
    };
    BookStatusModel.updateStatusById(_id, status)
        .then(function () {
            console.log("成功");
            req.flash('success', '编辑状态成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/users/${userId}/status/${_id}/edit`);
        })
        .catch(next);
});

// POST /users/:userId/status/:statusId/remove 删除状态
router.get('/:userId/status/:statusId/remove', checkLogin, function (req, res, next) {
    // 获取变量值
    var userId = req.params.userId;
    var statusId = req.params.statusId;
    console.log('删除状态'+statusId );
    BookStatusModel. delBookStatusByStatusId(statusId)
        .then(function () {
            req.flash('success', '删除状态成功');
            // 删除成功后跳转到用户管理
            res.redirect(`/users/${userId}/edit`);
        })
        .catch(next);
});

module.exports = router;

