var e = require("../../config/api"), t = e.req_userProblemList, a = e.req_userProblemRplyList, i = require("../../utils/util");

Page({
    data: {
        typeData: [ {
            id: 1,
            name: "发布记录",
            checked: !0
        }, {
            id: 2,
            name: "回复记录",
            checked: !1
        } ],
        publicData: [],
        replyData: [],
        id: 1
    },
    onLoad: function(e) {
        this.handlePublic();
    },
    onShow: function() {},
    handleChangeType: function(e) {
        var t = this.data.typeData, a = e.currentTarget.dataset.item;
        this.setData({
            typeData: t.map(function(e) {
                return e.checked = e.id === a.id, e;
            }),
            id: a.id
        }), 1 === a.id && this.handlePublic(), 2 === a.id && this.handleReply();
    },
    handlePublic: function() {
        var e = this;
        t().then(function(t) {
            2e4 === t.data.code ? e.setData({
                publicData: t.data.data.map(function(e) {
                    return e.time = e.problem_create_time ? i.formatDateLine(new Date(e.problem_create_time)) : "", 
                    e;
                })
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    handleReply: function() {
        var e = this;
        a().then(function(t) {
            2e4 === t.data.code ? e.setData({
                replyData: t.data.data.map(function(e) {
                    return e.time = e.reply_time ? i.formatDateLine(new Date(e.reply_time)) : "", e;
                })
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    handleDetails: function(e) {
        wx.navigateTo({
            url: "../topicDetails/index?id=" + e.currentTarget.dataset.id
        });
    }
});