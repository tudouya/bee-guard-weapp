var a = require("../../config/api"), t = a.req_findKnowledgeType, e = a.req_findAppKnowledgeInfo, n = getApp();

Page({
    data: {
        data: [],
        IP: "",
        typeData: [],
        typeId: ""
    },
    onLoad: function(a) {
        this.handleKnowType(), this.handleKnow(), this.setData({
            IP: n.globalData.url
        });
    },
    handleChange: function() {
        wx.navigateTo({
            url: "../knowSearch/index"
        });
    },
    handleDetails: function(a) {
        wx.navigateTo({
            url: "../knowDetails/index?id=" + a.currentTarget.dataset.id
        });
    },
    handleKnowType: function() {
        var a = this;
        t().then(function(t) {
            if (2e4 === t.data.code) {
                a.setData({
                    typeData: [ {
                        id: "",
                        type_name: "全部",
                        checked: !0
                    } ].concat((t.data.data || []).map(function(a) {
                        return a.checked = !1, a;
                    }))
                });
            } else wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    handleChangeType: function(a) {
        var t = this.data.typeData;
        this.setData({
            typeData: t.map(function(t) {
                return t.checked = t.id === a.currentTarget.dataset.id, t;
            })
        }), this.handleKnow(a.currentTarget.dataset.id);
    },
    handleKnow: function(a) {
        var t = this;
        e({
            typeId: a || ""
        }).then(function(a) {
            2e4 === a.data.code ? t.setData({
                data: a.data.data
            }) : wx.showToast({
                title: a.data.message,
                icon: "error"
            });
        });
    },
    onShow: function() {}
});