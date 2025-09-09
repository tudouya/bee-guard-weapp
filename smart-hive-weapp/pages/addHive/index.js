var t = require("../../config/myApi"), e = t.req_findMyProject, i = t.req_bindingHive, a = t.req_findRemoveHive;

Page({
    data: {
        hiveImei: "",
        hiveName: "",
        projectData: [],
        rangeData: [],
        projectId: "",
        projectName: "",
        tipShow: !1,
        unBoundHive: [],
        hiveData: []
    },
    onLoad: function() {
        this.findMyProject(), this.fetchUnbound();
    },
    handleImeiChange: function(t) {
        var e = this.data.unBoundHive, i = t.detail.value, a = [];
        "" != i && (e.forEach(function(t) {
            -1 != t.hive_imei.indexOf(i) && a.push(t);
        }), this.setData({
            tipShow: !0
        }), 0 != a.length ? this.setData({
            hiveData: a
        }) : this.setData({
            hiveData: []
        }));
    },
    pickerChangeName: function(t) {
        this.setData({
            hiveImei: t.currentTarget.dataset.item.hive_imei,
            hiveName: t.currentTarget.dataset.item.hive_name,
            tipShow: !1
        });
    },
    handleImeiFocus: function() {
        var t = this.data.unBoundHive;
        this.setData({
            hiveData: t
        });
    },
    findMyProject: function() {
        var t = this;
        e().then(function(e) {
            2e4 === e.data.code && t.setData({
                projectData: e.data.data,
                rangeData: e.data.data.map(function(t) {
                    return t.project_name;
                })
            });
        });
    },
    findPickerChange: function(t) {
        var e = this.data.projectData;
        this.setData({
            projectId: e.find(function(e, i) {
                return i == t.detail.value;
            }).project_id,
            projectName: e.find(function(e, i) {
                return i == t.detail.value;
            }).project_name
        });
    },
    onSubmit: function() {
        var t = this, e = this.data, a = e.hiveImei, n = e.projectId, o = e.unBoundHive;
        if ("" === a) return wx.showToast({
            title: "请输入蜂箱标识",
            icon: "none",
            duration: 2e3
        }), !1;
        var r = {
            hive_id: o.find(function(t) {
                return t.hive_imei == a;
            }).hive_id,
            project_id: n
        };
        i(r).then(function(e) {
            2e4 === e.data.code ? (t.setData({
                hiveImei: "",
                hiveName: "",
                projectId: "",
                projectName: ""
            }), wx.showToast({
                title: e.data.message,
                icon: "success",
                duration: 2e3
            }), setTimeout(function() {
                wx.redirectTo({
                    url: "../smartHive/index"
                });
            }, 2e3)) : 20004 === e.data.code && wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        });
    },
    scan: function() {
        var t = this, e = this.data.unBoundHive;
        wx.scanCode({
            success: function(i) {
                t.setData({
                    hiveImei: i.result,
                    hiveName: e.find(function(t) {
                        return t.hive_imei == i.result;
                    }) ? e.find(function(t) {
                        return t.hive_imei == i.result;
                    }).hive_name : ""
                }), wx.showToast({
                    title: "扫码成功",
                    icon: "success",
                    duration: 1e3
                });
            },
            fail: function(t) {
                wx.showToast({
                    title: "扫码失败",
                    icon: "none",
                    duration: 1e3
                });
            }
        });
    },
    onShow: function() {},
    fetchUnbound: function(t) {
        var e = this;
        a({
            imei: t || ""
        }).then(function(t) {
            2e4 === t.data.code ? e.setData({
                unBoundHive: t.data.data,
                hiveData: t.data.data
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    bindMoreClone: function() {
        this.setData({
            tipShow: !1
        });
    }
});