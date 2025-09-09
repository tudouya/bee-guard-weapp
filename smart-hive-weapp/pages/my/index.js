var e = require("../../config/api"), t = e.req_userProejctCount, a = e.req_userProejctHiveCount, n = e.req_userProblemCount;

Page({
    data: {
        userInfo: {},
        hivData: {},
        projectNum: 0,
        hiveNum: 0,
        deviceNum: 0,
        postNum: 0
    },
    onLoad: function(e) {
        this.fetchProjectNum(), this.handleHiveNum(), this.handlePostNum(), this.setData({
            userInfo: wx.getStorageSync("userInfo") || {
                user_nick: "游客",
                user_avatar: "../../images/tabbar/my.png"
            }
        });
    },
    onShow: function() {
        this.fetchProjectNum(), this.handleHiveNum(), this.handlePostNum(), this.setData({
            userInfo: wx.getStorageSync("userInfo") || {
                user_nick: "游客", 
                user_avatar: "../../images/tabbar/my.png"
            }
        });
    },
    handleInfo: function() {
        wx.navigateTo({
            url: "../userInfo/index"
        });
    },
    handleWarnSet: function() {
        wx.navigateTo({
            url: "../warnSet/index"
        });
    },
    handleWarnRecord: function() {
        wx.navigateTo({
            url: "../warnRecord/index"
        });
    },
    handleBrowseRecord: function() {
        wx.navigateTo({
            url: "../browseRecord/index"
        });
    },
    handleTopicRecord: function() {
        wx.navigateTo({
            url: "../topicRecord/index"
        });
    },
    handleWarrant: function() {
        wx.navigateTo({
            url: "../warrant/index"
        });
    },
    fetchProjectNum: function() {
        var e = this;
        t().then(function(t) {
            2e4 === t.data.code ? e.setData({
                projectNum: t.data.data
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    handleHiveNum: function() {
        var e = this;
        a().then(function(t) {
            2e4 === t.data.code ? e.setData({
                hiveNum: t.data.data,
                deviceNum: 4 * (t.data.data || 0)
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    handlePostNum: function() {
        var e = this;
        n().then(function(t) {
            2e4 === t.data.code ? e.setData({
                postNum: t.data.data
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    }
});