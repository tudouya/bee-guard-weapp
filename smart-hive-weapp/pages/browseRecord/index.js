var e = getApp();

Page({
    data: {
        typeData: [ {
            id: 1,
            name: "行业资讯",
            checked: !0
        }, {
            id: 2,
            name: "养蜂知识",
            checked: !1
        } ],
        infoRecord: [],
        knowRecord: [],
        id: 1
    },
    onLoad: function(t) {
        this.setData({
            IP: e.globalData.url,
            infoRecord: wx.getStorageSync("infoRecord") ? wx.getStorageSync("infoRecord") : [],
            knowRecord: wx.getStorageSync("knowRecord") ? wx.getStorageSync("knowRecord") : []
        });
    },
    onShow: function() {},
    handleChangeType: function(e) {
        var t = this.data.typeData, a = e.currentTarget.dataset.item;
        this.setData({
            typeData: t.map(function(e) {
                return e.checked = e.id === a.id, e;
            }),
            id: a.id
        });
    },
    handleInfo: function(e) {
        wx.navigateTo({
            url: "../infoDetails/index?id=" + e.currentTarget.dataset.id
        });
    },
    handleKnow: function(e) {
        wx.navigateTo({
            url: "../knowDetails/index?id=" + e.currentTarget.dataset.id
        });
    }
});