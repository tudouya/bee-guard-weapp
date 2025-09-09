var t = require("../../config/myApi"), e = t.req_findUserAllHive, a = t.req_findMyProject, i = t.req_deleteHiveInfo, n = t.req_updateHiveBindProject, o = null;

Page({
    data: {
        hiveName: "",
        data: [],
        id: "",
        projectData: [],
        rangeData: []
    },
    onLoad: function(t) {
        var e = this;
        this.fetch(), o = setInterval(function() {
            e.fetch();
        }, 3e5);
    },
    fetch: function() {
        var t = this, a = this.data.hiveName;
        e({
            hiveName: a
        }).then(function(e) {
            if (2e4 === e.data.code) {
                var a = e.data.data.map(function(t) {
                    return t.hive_temp = t.hive_temp ? t.hive_temp.toFixed(1) : 0, t.hive_humidity = t.hive_humidity ? t.hive_humidity.toFixed(1) : 0, 
                    t.hive_weight = t.hive_weight ? t.hive_weight.toFixed(1) : 0, t.thermostat = t.thermostat ? t.thermostat.toFixed(1) : 0, 
                    t;
                });
                t.setData({
                    data: a
                });
            } else wx.showToast({
                title: e.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    onNameChange: function(t) {
        var e = this;
        this.setData({
            hiveName: t.detail
        }, function() {
            e.fetch();
        });
    },
    addHive: function() {
        wx.redirectTo({
            url: "../addHive/index"
        });
    },
    onMore: function(t) {
        this.findMyProject(), this.setData({
            id: t.target.id
        });
    },
    onMoreClone: function() {
        this.data.id && this.setData({
            id: ""
        });
    },
    findMyProject: function() {
        var t = this;
        a().then(function(e) {
            2e4 === e.data.code && t.setData({
                projectData: e.data.data,
                rangeData: e.data.data.map(function(t) {
                    return t.project_name;
                })
            });
        });
    },
    hive_edit: function() {},
    hive_details: function() {
        clearInterval(o);
        var t = this.data.id;
        wx.navigateTo({
            url: "../hiveMap/index?id=" + t
        });
    },
    findPickerChange: function(t) {
        var e = this, a = this.data, i = a.id, o = a.projectData.find(function(e, a) {
            return a == t.detail.value;
        }).project_id;
        n({
            hiveIds: i,
            projectId: o
        }).then(function(t) {
            2e4 === t.data.code ? (wx.showToast({
                title: t.data.message,
                icon: "success",
                duration: 2e3
            }), e.setData({
                id: ""
            }), e.fetch()) : wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    hive_del: function() {
        var t = this.data.id, e = this;
        wx.showModal({
            title: "提示",
            content: "确定删除此蜂箱吗？",
            success: function(a) {
                a.confirm ? i({
                    hiveInfoId: t,
                    flag: 2
                }).then(function(t) {
                    2e4 === t.data.code ? (wx.showToast({
                        title: t.data.message,
                        icon: "success",
                        duration: 2e3
                    }), e.fetch()) : wx.showToast({
                        title: t.data.message,
                        icon: "none",
                        duration: 2e3
                    });
                }) : a.cancel;
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
        clearInterval(o);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});