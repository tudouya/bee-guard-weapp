var e = require("../../config/myApi"), t = e.req_findHiveDevice, a = e.req_findMyProject, i = e.req_updateHiveBindProject, n = e.req_deleteHiveInfo, s = require("../../config/api"), o = s.req_setEnterOut, d = s.req_setZaiChao;

Page({
    data: {
        data: {},
        id: "",
        markers: [],
        projectData: [],
        rangeData: [],
        typeObj: {},
        enterNum: 0,
        whetherNest: 0,
        EnterOut: {
            enterNum: 0,
            whetherNest: 0
        },
        hiveImei: "",
        visible: !1,
        nestVisible: !1,
        items: [ {
            value: 1,
            name: "在巢",
            checked: !1
        }, {
            value: 0,
            name: "不在巢",
            checked: !1
        } ]
    },
    onLoad: function(e) {
        var t = this;
        wx.connectSocket({
            url: "wss://dtm123.com:7803/ws/".concat(wx.getStorageSync("userInfo").user_id, "/").concat(e.id),
            header: {
                "content-type": "application/json"
            },
            success: function(e) {
                console.log(e, "success");
            },
            fail: function(e) {
                console.log(e, "fail");
            }
        }), wx.onSocketMessage(function(e) {
            var a = JSON.parse(e.data);
            a.hive_temp = a.hive_temp ? a.hive_temp.toFixed(1) : 0, a.hive_humidity = a.hive_humidity ? a.hive_humidity.toFixed(1) : 0, 
            a.hive_weight = a.hive_weight ? a.hive_weight.toFixed(1) : 0, a.thermostat = a.thermostat ? a.thermostat.toFixed(1) : 0, 
            t.setData({
                typeObj: a,
                enterNum: a.enter_num ? a.enter_num : 0,
                whetherNest: a.net_state,
                EnterOut: {
                    enterNum: a.enter_num ? a.enter_num : 0,
                    whetherNest: a.net_state
                }
            });
        }), this.fetch(e.id);
    },
    fetch: function(e) {
        var a = this;
        t({
            hiveId: e
        }).then(function(e) {
            if (2e4 === e.data.code) {
                var t = e.data.data;
                t.hive_temp = t.hive_temp ? t.hive_temp.toFixed(1) : 0, t.hive_humidity = t.hive_humidity ? t.hive_humidity.toFixed(1) : 0, 
                t.hive_weight = t.hive_weight ? t.hive_weight.toFixed(1) : 0, t.thermostat = t.thermostat ? t.thermostat.toFixed(1) : 0;
                var i = [];
                t.lon_lat ? (e.data.data.lon_lat = t.lon_lat.split(","), i = [ {
                    id: 0,
                    latitude: e.data.data.lon_lat.length ? e.data.data.lon_lat[1] : "",
                    longitude: e.data.data.lon_lat.length ? e.data.data.lon_lat[0] : "",
                    title: e.data.data.project_address
                } ]) : (e.data.data.lon_lat = [], i = []), a.setData({
                    data: t,
                    markers: i,
                    typeObj: t,
                    enterNum: t.enter_num ? t.enter_num : 0,
                    whetherNest: t.net_state,
                    EnterOut: {
                        enterNum: t.enter_num ? t.enter_num : 0,
                        whetherNest: t.net_state
                    },
                    hiveImei: t.hive_imei
                });
            } else wx.showToast({
                title: e.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    onMore: function(e) {
        this.findMyProject(), this.setData({
            id: e.target.id
        });
    },
    onMoreClone: function() {
        this.data.id && this.setData({
            id: ""
        });
    },
    findMyProject: function() {
        var e = this;
        a().then(function(t) {
            2e4 === t.data.code && e.setData({
                projectData: t.data.data,
                rangeData: t.data.data.map(function(e) {
                    return e.project_name;
                })
            });
        });
    },
    hive_edit: function() {},
    findPickerChange: function(e) {
        var t = this, a = this.data, n = a.id, s = a.projectData.find(function(t, a) {
            return a == e.detail.value;
        }).project_id;
        i({
            hiveIds: n,
            projectId: s
        }).then(function(e) {
            2e4 === e.data.code ? (wx.showToast({
                title: e.data.message,
                icon: "success",
                duration: 2e3
            }), t.setData({
                id: ""
            }), t.fetch(n)) : wx.showToast({
                title: e.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    hive_del: function() {
        var e = this.data.id;
        wx.showModal({
            title: "提示",
            content: "确定删除此蜂箱吗？",
            success: function(t) {
                t.confirm ? n({
                    hiveInfoId: e,
                    flag: 2
                }).then(function(e) {
                    2e4 === e.data.code ? (wx.showToast({
                        title: e.data.message,
                        icon: "success",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.redirectTo({
                            url: "../smartHive/index"
                        });
                    }, 2e3)) : wx.showToast({
                        title: e.data.message,
                        icon: "none",
                        duration: 2e3
                    });
                }) : t.cancel;
            }
        });
    },
    onShow: function() {},
    onUnload: function() {
        wx.closeSocket(), wx.navigateTo({
            url: "../smartHive/index"
        });
    },
    subHive: function() {
        wx.navigateTo({
            url: "../warnRecord/index"
        });
    },
    handleModal: function() {
        this.setData({
            visible: !0
        });
    },
    handleChangeEnterNum: function(e) {
        this.setData({
            enterNum: this.handleInput(e.detail.value)
        });
    },
    handleCloseModal: function() {
        this.setData({
            visible: !1
        });
    },
    handleOkModal: function() {
        var e = this, t = this.data, a = t.hiveImei, i = t.enterNum, n = t.whetherNest;
        o({
            hiveImei: a,
            enterNum: i || 0
        }).then(function(t) {
            2e4 === t.data.code ? (e.setData({
                visible: !1,
                EnterOut: {
                    enterNum: i || 0,
                    whetherNest: n || 0
                }
            }), wx.showToast({
                title: t.data.message,
                icon: "success",
                duration: 2e3
            })) : wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    handleNestModal: function() {
        var e = this.data, t = e.items, a = e.whetherNest;
        this.setData({
            items: t.map(function(e) {
                return e.checked = e.value == a, e;
            }),
            nestVisible: !0
        });
    },
    radioChange: function(e) {
        var t = this.data.items;
        this.setData({
            items: t.map(function(t) {
                return t.checked = t.value == e.detail.value, t;
            }),
            whetherNest: Number(e.detail.value)
        });
    },
    handleCloseNestModal: function() {
        var e = this.data, t = e.EnterOut, a = e.items;
        this.setData({
            nestVisible: !1,
            whetherNest: t.whetherNest,
            items: a.map(function(e) {
                return e.checked = e.value == t.whetherNest, e;
            })
        });
    },
    handleOkNestModal: function() {
        var e = this, t = this.data, a = t.hiveImei, i = t.enterNum, n = t.whetherNest;
        d({
            hiveImei: a,
            state: n ? "01" : "00"
        }).then(function(t) {
            2e4 === t.data.code ? (e.setData({
                nestVisible: !1,
                EnterOut: {
                    enterNum: i || 0,
                    whetherNest: n || 0
                }
            }), wx.showToast({
                title: t.data.message,
                icon: "success",
                duration: 2e3
            })) : wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    handleInput: function(e) {
        var t = e;
        return (t = (t = t.replace(/[^\d]/g, "")).replace(/^(\-)*(\d+)*$/, "$1$2")).indexOf(".") < 0 && "" != t && (t = parseFloat(t)), 
        t;
    }
});