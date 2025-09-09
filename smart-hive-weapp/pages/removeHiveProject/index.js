var e = require("../../@babel/runtime/helpers/objectSpread2"), t = require("../../config/myApi"), i = t.req_findProjectDetails, a = t.req_findHiveByProject, n = t.req_bindHiveInfo;

Page({
    data: {
        project_id: "",
        hiveInfos: [],
        hiveQuery: [],
        hiveData: [],
        huiveAddIds: [],
        tipShow: !1
    },
    onLoad: function(e) {
        this.fetch(e.id), this.findProjectDetails(e.id);
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
                    huiveAddIds: i.projectHiveInfoEntities.map(function(e) {
                        return e.hive_id;
                    }),
                    hiveData: i.projectHiveInfoEntities.map(function(e) {
                        return e.selected = !0, e;
                    })
                });
            } else wx.showToast({
                title: e.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    fetch: function(t) {
        var i = this;
        a({
            projectId: t
        }).then(function(t) {
            2e4 === t.data.code ? i.setData({
                hiveInfos: t.data.data.map(function(t) {
                    var i = e({}, t);
                    return i.selected = !0, i;
                })
            }) : wx.showToast({
                title: t.data.message,
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
        var e = this.data, t = {
            flag: 2,
            projectId: e.project_id,
            hiveIds: e.huiveAddIds.join(",")
        };
        n(t).then(function(e) {
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