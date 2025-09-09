var n = require("../../config/api"), t = n.req_findHotProblem, a = n.req_findAppConsultInfo, e = (n.req_findMyWarningRecord, 
getApp());

Page({
    data: {
        IP: "",
        topicHost: [],
        infoData: [],
        num: 0,
        recordNum: 0
    },
    onLoad: function(n) {
        this.handleTopicHost(), this.handleIndustry(), this.handleWarnNum(), this.setData({
            IP: e.globalData.url
        });
    },
    onShow: function() {
        this.handleTopicHost(), this.handleIndustry(), this.handleWarnNum(), this.setData({
            IP: e.globalData.url
        });
    },
    handleChange: function() {
        wx.navigateTo({
            url: "../topicSearch/index"
        });
    },
    handleSmartHive: function() {
        wx.navigateTo({
            url: "../smartHive/index"
        });
    },
    handleKnow: function() {
        wx.navigateTo({
            url: "../know/index"
        });
    },
    handleInfo: function() {
        wx.navigateTo({
            url: "../info/index"
        });
    },
    handleProject: function() {
        wx.navigateTo({
            url: "../project/index"
        });
    },
    handleDataStat: function() {
        wx.navigateTo({
            url: "../dataStat/index"
        });
    },
    handleTopicHost: function() {
        var n = this;
        t().then(function(t) {
            if (2e4 === t.data.code) {
                var a = (t.data.data || []).slice(0, 4), e = a.map(function(n) {
                    return n.num;
                }).reduce(function(n, t) {
                    return n + t;
                }, 0);
                n.setData({
                    topicHost: a,
                    num: e
                });
            } else wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    handleTopicFireInfo: function(n) {
        wx.navigateTo({
            url: "../topicDetails/index?id=" + n.currentTarget.dataset.id
        });
    },
    handleIndustry: function() {
        var n = this;
        a().then(function(t) {
            2e4 === t.data.code ? n.setData({
                infoData: (t.data.data || []).slice(0, 4)
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    handleIndustryInfo: function(n) {
        wx.navigateTo({
            url: "../infoDetails/index?id=" + n.currentTarget.dataset.id
        });
    },
    handleWarn: function() {
        wx.navigateTo({
            url: "../warnRecord/index"
        });
    },
    handleWarnNum: function() {},
    preview: function(n) {
        wx.previewImage({
            current: n.currentTarget.dataset.url,
            urls: [ n.currentTarget.dataset.url ]
        });
    }
});