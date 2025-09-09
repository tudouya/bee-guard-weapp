var e = require("../../@babel/runtime/helpers/objectSpread2"), t = require("../../config/myApi"), i = t.req_findProjectDetails, a = t.req_findRemoveHive, n = t.req_bindHiveInfo;

Page({
    data: {
        project_id: "",
        hiveInfos: [],
        hiveQuery: [],
        hiveData: [],
        hiveSelecteds: [],
        huiveAddIds: [],
        tipShow: !1
    },
    onLoad: function(e) {
        this.fetch(), this.findProjectDetails(e.id);
    },
    findProjectDetails: function(e) {
        var t = this;
        i({
            projectId: e
        }).then(function(e) {
            if (2e4 === e.data.code) {
                var i = e.data.data;
                t.setData({
                    project_id: i.project_id,
                    hiveSelecteds: i.projectHiveInfoEntities.map(function(e) {
                        return e.hive_id;
                    })
                });
            } else wx.showToast({
                title: e.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    fetch: function() {
        var t = this;
        a().then(function(i) {
            2e4 === i.data.code ? t.setData({
                hiveInfos: i.data.data.map(function(t) {
                    var i = e({}, t);
                    return i.selected = !0, i;
                })
            }) : wx.showToast({
                title: i.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    handleImeiChange: function(e) {
        var t = this.data.hiveInfos, i = e.detail.value, a = [];
        "" != i && (t.forEach(function(e) {
            -1 == e.hive_imei.indexOf(i) && -1 == e.hive_name.indexOf(i) || a.push(e);
        }), this.setData({
            tipShow: !0
        }), 0 != a.length ? this.setData({
            hiveQuery: a
        }) : this.setData({
            hiveQuery: []
        }));
    },
    pickerChangeName: function(e) {
        var t = this.data, i = t.hiveData, a = t.huiveAddIds, n = e.currentTarget.dataset.item;
        this.setData({
            hiveData: i.find(function(e) {
                return e.hive_imei === n.hive_imei;
            }) ? i : i.concat([ n ]),
            tipShow: !1,
            huiveAddIds: i.find(function(e) {
                return e.hive_imei === n.hive_imei;
            }) ? a : a.concat([ String(n.hive_id) ])
        });
    },
    handleImeiFocus: function() {
        var e = this.data.hiveInfos;
        this.setData({
            hiveQuery: e
        });
    },
    onHiveChange: function(e) {
        var t = this.data, i = t.huiveAddIds, a = t.hiveData, n = e.currentTarget.id;
        i.find(function(e) {
            return e == n;
        }) ? (i = i.filter(function(e) {
            return e != n;
        }), a = a.map(function(e) {
            return e.hive_id == n && (e.selected = !1), e;
        })) : (i.push(n), a = a.map(function(e) {
            return e.hive_id == n && (e.selected = !0), e;
        })), this.setData({
            hiveData: a,
            huiveAddIds: i
        });
    },
    onSubmit: function() {
        var e = this.data, t = e.project_id, i = e.huiveAddIds, a = e.hiveSelecteds, o = {
            flag: 1,
            projectId: t,
            hiveIds: i.concat(a).join(",")
        };
        n(o).then(function(e) {
            2e4 === e.data.code ? (wx.showToast({
                title: e.data.message,
                icon: "success",
                duration: 2e3
            }), setTimeout(function() {
                wx.redirectTo({
                    url: "../project/index"
                });
            }, 2e3)) : wx.showToast({
                title: e.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    bindMoreClone: function() {
        this.setData({
            tipShow: !1
        });
    }
});