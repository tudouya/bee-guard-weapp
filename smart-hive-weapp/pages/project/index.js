var t = require("../../config/myApi"), e = t.req_findMyProject, n = t.req_deleteProject;

Page({
    data: {
        data: [],
        projectName: "",
        id: ""
    },
    onLoad: function() {
        this.fetch();
    },
    fetch: function() {
        var t = this;
        wx.showToast({
            title: "加载中",
            icon: "loading",
            mask: !0
        });
        var n = this.data.projectName;
        e({
            projectName: n
        }).then(function(e) {
            if (2e4 === e.data.code) {
                var n = e.data.data;
                t.setData({
                    data: n
                }), wx.hideToast();
            } else wx.showToast({
                title: e.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    addProject: function() {
        // 移除授权验证，直接跳转到添加项目页面
        wx.navigateTo({
            url: "../addProject/index"
        });
    },
    onNameChange: function(t) {
        var e = this;
        this.setData({
            projectName: t.detail
        }, function() {
            e.fetch();
        });
    },
    onHiveList: function(t) {
        wx.navigateTo({
            url: "../projectHiveList/index?id=" + t.target.id
        });
    },
    onHiveMap: function(t) {
        wx.navigateTo({
            url: "../projectMap/index?id=" + t.target.id
        });
    },
    onMore: function(t) {
        this.setData({
            id: t.target.id
        });
    },
    onMoreClone: function() {
        this.data.id && this.setData({
            id: ""
        });
    },
    project_edit: function() {
        var t = this.data.id;
        wx.navigateTo({
            url: "../editProject/index?id=" + t
        });
    },
    project_add: function() {
        var t = this.data.id;
        wx.navigateTo({
            url: "../addHiveProject/index?id=" + t
        });
    },
    project_remove: function() {
        var t = this.data.id;
        wx.navigateTo({
            url: "../removeHiveProject/index?id=" + t
        });
    },
    project_del: function() {
        var t = this.data.id, e = this;
        wx.showModal({
            title: "提示",
            content: "确定删除此项目吗？",
            success: function(a) {
                a.confirm ? n({
                    projectId: t
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
    project_warn: function() {
        var t = this.data.id;
        wx.navigateTo({
            url: "../warnSet/index?id=" + t
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
        wx.reLaunch({
            url: "../index/index"
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});