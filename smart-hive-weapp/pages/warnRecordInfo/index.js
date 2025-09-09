var a = require("../../config/api").req_findWarningRecordById, e = require("../../utils/util");

Page({
    data: {
        data: {},
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
    onLoad: function(a) {
        this.handleWarnInfo(a.id);
    },
    onShow: function() {},
    handleWarnInfo: function(t) {
        var n = this, i = this.data.typeData;
        a({
            recordId: t
        }).then(function(a) {
            if (2e4 === a.data.code) {
                var t = a.data.data;
                t.type_name = i.find(function(a) {
                    return a.id === t.abnormal_type;
                }) ? i.find(function(a) {
                    return a.id === t.abnormal_type;
                }).name : "", t.time = t.create_time ? e.formatDateLine(new Date(t.create_time)) : "", 
                n.setData({
                    data: t
                });
            } else wx.showToast({
                title: a.data.message,
                icon: "error"
            });
        });
    }
});