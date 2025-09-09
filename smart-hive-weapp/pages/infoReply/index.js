var e = require("../../config/api"), t = e.req_findUserReply, a = e.req_seeReply, i = require("../../utils/util");

Page({
    data: {
        data: []
    },
    onLoad: function(e) {
        this.handleComment();
    },
    handleTopicDetails: function(e) {
        var t = e.currentTarget.dataset.item;
        a({
            reply_id: t.reply_id
        }).then(function(e) {
            2e4 === e.data.code ? wx.navigateTo({
                url: "../topicDetails/index?id=" + t.problem_id
            }) : wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        });
    },
    onShow: function() {
        this.handleComment();
    },
    handleComment: function() {
        var e = this;
        t().then(function(t) {
            2e4 === t.data.code ? e.setData({
                data: t.data.data.map(function(e) {
                    return e.time = e.reply_time ? i.formatTime(new Date(e.reply_time)) : "", e;
                })
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    }
});