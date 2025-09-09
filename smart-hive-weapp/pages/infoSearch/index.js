var a = require("../../config/api").req_findAppConsultInfo, t = getApp();

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
            IP: t.globalData.url,
            searchData: wx.getStorageSync("infoSearch") ? wx.getStorageSync("infoSearch") : []
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
        var a = this.data.searchName, t = wx.getStorageSync("infoSearch") ? wx.getStorageSync("infoSearch") : [], e = [];
        a ? (e = t.find(function(t) {
            return t === a;
        }) ? t : t.concat([ a ]), wx.setStorageSync("infoSearch", e), this.handleInfo(a), 
        this.setData({
            visible: !1,
            searchData: wx.getStorageSync("infoSearch") ? wx.getStorageSync("infoSearch") : []
        })) : this.setData({
            visible: !0
        });
    },
    handleSearchHistory: function(a) {
        this.handleInfo(a.currentTarget.dataset.name), this.setData({
            visible: !1
        });
    },
    handleInfo: function(t) {
        var e = this;
        a({
            consultTitle: t || ""
        }).then(function(a) {
            2e4 === a.data.code ? e.setData({
                data: a.data.data
            }) : wx.showToast({
                title: a.data.message,
                icon: "error"
            });
        });
    },
    handleDetails: function(a) {
        wx.navigateTo({
            url: "../infoDetails/index?id=" + a.currentTarget.dataset.id
        });
    }
});