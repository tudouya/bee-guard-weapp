var a = require("../../config/api").req_findAppKnowledgeInfo, e = getApp();

Page({
    data: {
        IP: "",
        searchName: "",
        visible: !0,
        searchData: [],
        data: []
    },
    onLoad: function(a) {
        this.setData({
            IP: e.globalData.url,
            searchData: wx.getStorageSync("knowSearch") ? wx.getStorageSync("knowSearch") : []
        });
    },
    onShow: function() {},
    handleChange: function(a) {
        this.setData({
            searchName: a.detail.value
        }), a.detail.value || this.setData({
            visible: !0
        });
    },
    handleSearch: function() {
        var a = this.data.searchName, e = wx.getStorageSync("knowSearch") ? wx.getStorageSync("knowSearch") : [], t = [];
        a ? (t = e.find(function(e) {
            return e === a;
        }) ? e : e.concat([ a ]), wx.setStorageSync("knowSearch", t), this.handleKnow(a), 
        this.setData({
            visible: !1,
            searchData: wx.getStorageSync("knowSearch") ? wx.getStorageSync("knowSearch") : []
        })) : this.setData({
            visible: !0
        });
    },
    handleSearchHistory: function(a) {
        this.handleKnow(a.currentTarget.dataset.name), this.setData({
            visible: !1
        });
    },
    handleKnow: function(e) {
        var t = this;
        a({
            knowledgeTitle: e || ""
        }).then(function(a) {
            2e4 === a.data.code ? t.setData({
                data: a.data.data
            }) : wx.showToast({
                title: a.data.message,
                icon: "error"
            });
        });
    },
    handleDetails: function(a) {
        wx.navigateTo({
            url: "../knowDetails/index?id=" + a.currentTarget.dataset.id
        });
    }
});