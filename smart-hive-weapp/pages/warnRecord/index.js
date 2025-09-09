var e = require("../../config/api"), a = e.req_findMyWarningRecord, t = e.req_updateWarningRecord, n = require("../../utils/util");

Page({
    data: {
        record: [],
        typeData: [ {
            id: 1,
            name: "蜂王离巢"
        }, {
            id: 2,
            name: "蜂箱温度异常"
        }, {
            id: 3,
            name: "蜂箱湿度异常"
        }, {
            id: 4,
            name: "蒸发皿温度异常"
        }, {
            id: 5,
            name: "设备掉线"
        } ]
    },
    onLoad: function(e) {
        this.handleWarnRecord();
    },
    onShow: function() {
        this.handleWarnRecord();
    },
    handleWarnRecord: function() {
        var e = this, t = this.data.typeData;
        a().then(function(a) {
            2e4 === a.data.code ? e.setData({
                record: a.data.data.map(function(e) {
                    return e.type_name = t.find(function(a) {
                        return a.id === e.abnormal_type;
                    }) ? t.find(function(a) {
                        return a.id === e.abnormal_type;
                    }).name : "", e.time = e.create_time ? n.formatDateLine(new Date(e.create_time)) : "", 
                    e;
                })
            }) : wx.showToast({
                title: a.data.message,
                icon: "error"
            });
        });
    },
    handleDetails: function(e) {
        t({
            recordId: e.currentTarget.dataset.id
        }).then(function(a) {
            2e4 === a.data.code ? wx.navigateTo({
                url: "../warnRecordInfo/index?id=" + e.currentTarget.dataset.id
            }) : wx.showToast({
                title: a.data.message,
                icon: "error"
            });
        });
    }
});