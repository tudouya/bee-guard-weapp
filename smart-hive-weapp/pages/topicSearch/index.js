var e = require("../../config/api").req_findHotProblem, t = getApp(), a = require("../../utils/util");

Page({
    data: {
        searchName: "",
        visible: !0,
        searchData: [],
        data: []
    },
    onLoad: function(e) {
        this.setData({
            searchData: wx.getStorageSync("topicSearch") ? wx.getStorageSync("topicSearch") : []
        });
    },
    onShow: function() {},
    handleChange: function(e) {
        this.setData({
            searchName: e.detail.value
        }), e.detail.value || this.setData({
            visible: !0
        });
    },
    handleSearch: function() {
        var e = this.data.searchName, t = wx.getStorageSync("topicSearch") ? wx.getStorageSync("topicSearch") : [], a = [];
        e ? (a = t.find(function(t) {
            return t === e;
        }) ? t : t.concat([ e ]), wx.setStorageSync("topicSearch", a), this.handleTopic(e), 
        this.setData({
            visible: !1,
            searchData: wx.getStorageSync("topicSearch") ? wx.getStorageSync("topicSearch") : []
        })) : this.setData({
            visible: !0
        });
    },
    handleSearchHistory: function(e) {
        this.handleTopic(e.currentTarget.dataset.name), this.setData({
            searchName: e.currentTarget.dataset.name,
            visible: !1
        });
    },
    handleTopic: function(i) {
        var r = this;
        e({
            problemTitle: i || ""
        }).then(function(e) {
            2e4 === e.data.code ? r.setData({
                data: e.data.data.map(function(e) {
                    return e.time = e.problem_create_time ? a.formatDateLine(new Date(e.problem_create_time)) : "", 
                    e.images = e.problem_images ? e.problem_images.split(",").slice(0, 3).map(function(e) {
                        return e = -1 !== e.indexOf("http") ? e : t.globalData.url + e;
                    }) : [], e;
                })
            }) : wx.showToast({
                title: e.data.message,
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