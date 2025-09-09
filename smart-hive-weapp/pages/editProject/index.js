var e = require("../../@babel/runtime/helpers/objectSpread2"), t = require("../../config/myApi"), i = t.req_findProjectDetails, a = t.req_findHiveByProject, n = t.req_updateProjectInfo, o = getApp();

Page({
    data: {
        project_id: "",
        project_name: "",
        project_province: "",
        project_city: "",
        project_area: "",
        project_address: "",
        lon_lat: "",
        hiveInfos: [],
        hiveQuery: [],
        hiveData: [],
        hiveTempData: [],
        huiveAddIds: [],
        visible: !1,
        title: "确认添加蜂箱",
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
                    project_name: i.project_name,
                    project_province: i.project_province,
                    project_city: i.project_city,
                    project_area: i.project_area,
                    project_address: i.project_address,
                    lon_lat: i.lon_lat,
                    hiveTempData: i.projectHiveInfoEntities,
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
    handleInputChange: function(e) {
        this.setData({
            project_name: e.detail.value
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
    addHive: function() {
        this.setData({
            visible: !0,
            title: "确认添加蜂箱"
        }), wx.setNavigationBarTitle({
            title: "添加蜂箱"
        });
    },
    subHive: function() {
        this.setData({
            visible: !1
        }), wx.setNavigationBarTitle({
            title: "编辑项目"
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
        void 0 !== i.find(function(e) {
            return e == n;
        }) ? (i = i.filter(function(e) {
            return e != n;
        }), a = a.map(function(e) {
            return e.hive_id == n && (e.selected = !1), e;
        })) : (i.push(n), a = a.map(function(e) {
            return e.hive_id == n && (e.selected = !0), e;
        })), this.setData({
            hiveTempData: a.filter(function(e) {
                return !0 === e.selected;
            }),
            hiveData: a,
            huiveAddIds: i
        });
    },
    handleMapChange: function() {
        var e = o.globalData.tencentKey, t = o.globalData.tencentName;
        wx.getSetting({
            success: function(i) {
                i.authSetting["scope.userLocation"] ? wx.navigateTo({
                    url: "plugin://chooseLocation/index?key=".concat(e, "&referer=").concat(t, "&scale=").concat(7)
                }) : wx.authorize({
                    scope: "scope.userLocation",
                    success: function() {
                        wx.navigateTo({
                            url: "plugin://chooseLocation/index?key=".concat(e, "&referer=").concat(t, "&scale=").concat(7)
                        });
                    },
                    fail: function(e) {
                        e.errMsg.indexOf("auth deny") && wx.showToast({
                            title: "您已拒绝地理位置授权,\n请在右上角设置打开",
                            icon: "none",
                            duration: 1500
                        });
                    }
                });
            }
        });
    },
    onShow: function() {
        var e = requirePlugin("chooseLocation").getLocation();
        e && this.setData({
            project_province: e.province,
            project_city: e.city,
            project_area: e.district,
            project_address: e.name,
            lon_lat: e.longitude + "," + e.latitude
        });
    },
    onUnload: function() {
        requirePlugin("chooseLocation").setLocation(null);
    },
    onSubmit: function() {
        var e = this, t = this.data, i = t.project_id, a = t.project_name, o = t.project_province, c = t.project_city, r = t.project_area, s = t.project_address, d = t.lon_lat, u = t.huiveAddIds;
        if ("" === a) return wx.showToast({
            title: "请输入项目名称",
            icon: "none",
            duration: 2e3
        }), !1;
        if ("" === d) return wx.showToast({
            title: "请选择项目地址",
            icon: "",
            duration: 2e3
        }), !1;
        var h = {
            project_id: i,
            project_name: a,
            project_province: o,
            project_city: c,
            project_area: r,
            project_address: s,
            lon_lat: d,
            huiveAddIds: u.join(",")
        };
        n(h).then(function(t) {
            2e4 === t.data.code ? (e.setData({
                project_name: "",
                project_province: "",
                project_city: "",
                project_area: "",
                project_address: "",
                hiveTempData: "",
                lon_lat: "",
                huiveAddIds: []
            }), e.fetch(i), wx.showToast({
                title: t.data.message,
                icon: "success",
                duration: 2e3
            }), setTimeout(function() {
                wx.redirectTo({
                    url: "../project/index"
                });
            }, 2e3)) : 20004 === t.data.code ? wx.showToast({
                title: t.data.message,
                icon: "error"
            }) : wx.showToast({
                title: t.data.message,
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