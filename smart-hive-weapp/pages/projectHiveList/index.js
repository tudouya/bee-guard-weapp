var t = require("../../config/myApi").req_findHiveInfoById, e = null;

Page({
    data: {
        projectId: "",
        hiveName: "",
        data: []
    },
    onLoad: function(t) {
        var i = this;
        this.fetch(t.id), this.setData({
            projectId: t.id
        }), e = setInterval(function() {
            i.fetch(t.id);
        }, 3e4);
    },
    fetch: function(e) {
        var i = this, a = this.data.hiveName;
        t({
            projectId: e,
            hiveName: a,
            flag: 1
        }).then(function(t) {
            2e4 === t.data.code ? i.setData({
                data: t.data.data.map(function(t) {
                    return t.hive_temp = t.hive_temp ? t.hive_temp.toFixed(1) : 0, t.hive_humidity = t.hive_humidity ? t.hive_humidity.toFixed(1) : 0, 
                    t.hive_weight = t.hive_weight ? t.hive_weight.toFixed(1) : 0, t.thermostat = t.thermostat ? t.thermostat.toFixed(1) : 0, 
                    t;
                })
            }) : wx.showToast({
                title: t.data.message,
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
            var t = e.data.projectId;
            e.fetch(t);
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
        clearInterval(e);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});