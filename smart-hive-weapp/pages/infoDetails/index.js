var e = require("../../@babel/runtime/helpers/toConsumableArray"), t = require("../../config/api").req_findConsultById, a = require("../../wxParse/wxParse.js"), r = require("../../utils/util"), n = getApp();

Page({
    data: {
        data: {},
        IP: ""
    },
    onLoad: function(e) {
        this.handleInfo(e.id), this.setData({
            IP: n.globalData.url
        });
    },
    onShow: function() {},
    handleInfo: function(e) {
        var n = this, i = this, o = wx.getStorageSync("infoRecord") ? wx.getStorageSync("infoRecord") : [], s = [];
        t({
            id: e
        }).then(function(e) {
            if (2e4 === e.data.code) {
                var t = e.data.data;
                t.time = t.publish_time ? r.formatTimeHM(new Date(t.publish_time)) : "", i.setData({
                    data: e.data.data
                }), a.wxParse("infoContent", "html", e.data.data.consult_content, i, 5), s = o.find(function(t) {
                    return t.consult_id === e.data.data.consult_id;
                }) ? n.myReverse(o).slice(0, 10) : n.myReverse(o.concat([ e.data.data ])).slice(0, 10), 
                wx.setStorageSync("infoRecord", s);
            } else wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        });
    },
    myReverse: function(t) {
        return e(t).reverse();
    },
    preview: function(e) {
        wx.previewImage({
            current: e.currentTarget.dataset.url,
            urls: [ e.currentTarget.dataset.url ]
        });
    }
});