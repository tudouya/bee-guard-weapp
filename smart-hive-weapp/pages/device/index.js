var e = require("../../config/myApi"), a = e.req_findMyProject, t = e.req_findHiveInfoById, i = require("../../config/api"), n = i.req_findHiveDevice, d = i.req_issueDeviceCmd, o = i.req_setRunModel;

Page({
    data: {
        visible: !1,
        projectData: [],
        rangeData: [],
        projectId: "",
        projectName: "",
        hiveData: [],
        hiveId: "",
        hiveInfo: {},
        deviceData: [],
        hiveName: ""
    },
    onLoad: function(e) {
        this.handleProject();
    },
    onShow: function() {
        this.handleProject();
    },
    handleOpenMore: function() {
        this.setData({
            visible: !0
        });
    },
    handleCloseMore: function() {
        this.setData({
            visible: !1
        });
    },
    handleProject: function() {
        var e = this;
        a().then(function(a) {
            2e4 === a.data.code ? (e.setData({
                projectData: a.data.data,
                rangeData: a.data.data.map(function(e) {
                    return e.project_name;
                }),
                projectId: a.data.data.length ? a.data.data[0].project_id : "",
                projectName: a.data.data.length ? a.data.data[0].project_name : ""
            }), a.data.data.length && e.handleHive(a.data.data[0].project_id)) : wx.showToast({
                title: a.data.message,
                icon: "none"
            });
        });
    },
    findPickerChange: function(e) {
        var a = this.data.projectData, t = a.find(function(a, t) {
            return t == e.detail.value;
        }).project_id, i = a.find(function(a, t) {
            return t == e.detail.value;
        }).project_name;
        this.setData({
            projectId: t,
            projectName: i
        }), this.handleHive(t);
    },
    handleHive: function(e) {
        var a = this, i = this.data.hiveName;
        t({
            hiveName: i,
            projectId: e,
            flag: 1
        }).then(function(e) {
            2e4 === e.data.code ? e.data.data.length ? (a.setData({
                hiveData: e.data.data.map(function(e, a) {
                    return e.checked = !a, e;
                }),
                hiveId: e.data.data[0].hive_id
            }), a.handleHiveDevice(e.data.data[0].hive_id)) : a.setData({
                hiveData: []
            }) : wx.showToast({
                title: e.data.message,
                icon: "none"
            });
        });
    },
    handleSearchChange: function(e) {
        var a = this, t = this.data.projectId;
        this.setData({
            hiveName: e.detail.value
        }, function() {
            a.handleHive(t);
        });
    },
    handleChangeHive: function(e) {
        var a = this.data.hiveData, t = e.currentTarget.dataset.id;
        this.setData({
            hiveData: a.map(function(e) {
                return e.checked = e.hive_id === t, e;
            }),
            hiveId: t
        }), this.handleHiveDevice(t);
    },
    handleHiveDevice: function(e) {
        var a = this;
        n({
            hiveId: e
        }).then(function(e) {
            2e4 === e.data.code ? a.setData({
                hiveInfo: e.data.data,
                deviceData: e.data.data.projectHiveDeviceEntities
            }) : wx.showToast({
                title: e.data.message,
                icon: "none"
            });
        });
    },
    handleIssueDeviceCmd: function(e) {
        var a = this, t = this.data.hiveId, i = e.currentTarget.dataset.item;
        d({
            deviceType: i.device_type_id,
            flag: i.deviece_run_state ? 0 : 1,
            hiveId: t
        }).then(function(e) {
            2e4 === e.data.code ? (wx.showToast({
                title: "操作成功！",
                icon: "success"
            }), a.handleHiveDevice(t)) : wx.showToast({
                title: e.data.message,
                icon: "none"
            });
        });
    },
    handleIssueDeviceSwitch: function() {
        wx.showToast({
            title: "请先把控制状态切换为手动！",
            icon: "none"
        });
    },
    handleSwitch: function(e) {
        var a = this, t = this.data.hiveInfo, i = e.currentTarget.dataset.state;
        o({
            hiveId: t.hive_id,
            state: i ? "00" : "01"
        }).then(function(e) {
            2e4 === e.data.code ? (wx.showToast({
                title: "操作成功！",
                icon: "success"
            }), a.handleHiveDevice(t.hive_id)) : wx.showToast({
                title: e.data.message,
                icon: "none"
            });
        });
    }
});