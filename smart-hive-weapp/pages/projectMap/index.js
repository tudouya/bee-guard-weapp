var t = require("../../config/myApi"), a = t.req_findHiveStateCount, e = t.req_findProjectDetails;

Page({
    data: {
        id: "",
        data: {},
        stateData: {},
        markers: []
    },
    fetch: function(t) {
        var a = this;
        e({
            projectId: t
        }).then(function(t) {
            2e4 === t.data.code ? (t.data.data.lon_lat = t.data.data.lon_lat.split(","), a.setData({
                data: t.data.data,
                markers: [ {
                    id: 0,
                    latitude: t.data.data.lon_lat[1],
                    longitude: t.data.data.lon_lat[0],
                    title: t.data.data.project_address
                } ]
            })) : wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    findHiveStateCount: function(t) {
        var e = this;
        a({
            projectId: t
        }).then(function(t) {
            2e4 === t.data.code ? e.setData({
                stateData: t.data.data
            }) : wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    handleHive: function() {
        var t = this.data.id;
        wx.navigateTo({
            url: "../projectHiveList/index?id=" + t
        });
    },
    onLoad: function(t) {
        this.setData({
            id: t.id
        }), this.fetch(t.id), this.findHiveStateCount(t.id);
    },
    onShow: function() {},
    onUnload: function() {}
});