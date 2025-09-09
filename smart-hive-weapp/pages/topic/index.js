var e = require("../../config/api"), t = e.req_findProblemType, a = e.req_findHotProblem, n = e.req_findUserReply, i = getApp(), o = require("../../utils/util");

Page({
    data: {
        topicType: [],
        data: [],
        num: 0
    },
    onLoad: function(e) {
        this.handleTopicType(), this.handleTopic(), this.handleNotSeenComment();
    },
    onShow: function() {
        this.handleTopicType(), this.handleTopic(), this.handleNotSeenComment();
    },
    handleChange: function() {
        wx.navigateTo({
            url: "../topicSearch/index"
        });
    },
    handleTopicDetails: function(e) {
        wx.navigateTo({
            url: "../topicDetails/index?id=" + e.currentTarget.dataset.id
        });
    },
    handleReply: function() {
        wx.navigateTo({
            url: "../infoReply/index"
        });
    },
    handleTopicType: function() {
        var e = this;
        t({
            flag: 2
        }).then(function(t) {
            if (2e4 === t.data.code) {
                e.setData({
                    topicType: [ {
                        type_id: "",
                        type_name: "全部",
                        checked: !0
                    } ].concat((t.data.data || []).map(function(e) {
                        return e.checked = !1, e;
                    }))
                });
            } else wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    hanldeChangeType: function(e) {
        var t = this.data.topicType;
        this.setData({
            topicType: t.map(function(t) {
                return t.checked = t.type_id === e.currentTarget.dataset.id, t;
            })
        }), this.handleTopic(e.currentTarget.dataset.id);
    },
    handleTopic: function(e) {
        var t = this;
        a({
            typeId: e || ""
        }).then(function(e) {
            2e4 === e.data.code ? t.setData({
                data: e.data.data.map(function(e) {
                    return e.time = e.problem_create_time ? o.formatDateLine(new Date(e.problem_create_time)) : "", 
                    e.images = e.problem_images ? e.problem_images.split(",").slice(0, 3).map(function(e) {
                        return e = -1 !== e.indexOf("http") ? e : i.globalData.url + e;
                    }) : [], e;
                })
            }) : wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        });
    },
    handleNotSeenComment: function() {
        var e = this;
        n().then(function(t) {
            if (2e4 === t.data.code) {
                var a = (t.data.data || []).filter(function(e) {
                    return 0 === e.is_see;
                });
                e.setData({
                    num: a.length
                });
            } else wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    }
});