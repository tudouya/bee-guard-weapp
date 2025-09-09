var e = require("../../config/api"), a = e.req_findWarning, t = e.req_saveWarning;

Page({
    data: {
        minTemp: (0).toFixed(1),
        maxTemp: 40..toFixed(1),
        minHum: (0).toFixed(1),
        maxHum: 90..toFixed(1),
        minTempDish: (0).toFixed(1),
        maxTempDish: 500..toFixed(1),
        config_id: "",
        warnSet: {},
        project_id: ""
    },
    onLoad: function(e) {
        this.setData({
            project_id: e.id
        }), this.handleWarn(e.id);
    },
    onShow: function() {},
    handleWarn: function(e) {
        var t = this;
        a({
            projectId: e
        }).then(function(e) {
            2e4 === e.data.code ? e.data.data && t.setData({
                minTemp: e.data.data.temp_lower,
                maxTemp: e.data.data.temp_upper,
                minHum: e.data.data.humi_lower,
                maxHum: e.data.data.humi_upper,
                minTempDish: e.data.data.dish_temp_lower,
                maxTempDish: e.data.data.dish_temp_upper,
                config_id: e.data.data.config_id,
                warnSet: e.data.data
            }) : wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        });
    },
    handleChangeMinTemp: function(e) {
        this.setData({
            minTemp: this.handleInput(e.detail.value, 1)
        });
    },
    handleReduceMinTemp: function() {
        var e = this.data.minTemp;
        this.setData({
            minTemp: Number(e) < 1 ? (0).toFixed(1) : (e - 1).toFixed(1)
        });
    },
    handlePlusMinTemp: function() {
        var e = this.data.minTemp;
        this.setData({
            minTemp: (Number(e) + 1).toFixed(1)
        });
    },
    handleChangeMaxTemp: function(e) {
        this.setData({
            maxTemp: this.handleInput(e.detail.value, 1)
        });
    },
    handleReduceMaxTemp: function() {
        var e = this.data.maxTemp;
        this.setData({
            maxTemp: Number(e) < 1 ? (0).toFixed(1) : (e - 1).toFixed(1)
        });
    },
    handlePlusMaxTemp: function() {
        var e = this.data.maxTemp;
        this.setData({
            maxTemp: (Number(e) + 1).toFixed(1)
        });
    },
    handleChangeMinHum: function(e) {
        this.setData({
            minHum: this.handleInput(e.detail.value, 1)
        });
    },
    handleReduceMinHum: function() {
        var e = this.data.minHum;
        this.setData({
            minHum: Number(e) < 1 ? (0).toFixed(1) : (e - 1).toFixed(1)
        });
    },
    handlePlusMinHum: function() {
        var e = this.data.minHum;
        this.setData({
            minHum: (Number(e) + 1).toFixed(1)
        });
    },
    handleChangeMaxHum: function(e) {
        this.setData({
            maxHum: this.handleInput(e.detail.value, 1)
        });
    },
    handleReduceMaxHum: function() {
        var e = this.data.maxHum;
        this.setData({
            maxHum: Number(e) < 1 ? (0).toFixed(1) : (e - 1).toFixed(1)
        });
    },
    handlePlusMaxHum: function() {
        var e = this.data.maxHum;
        this.setData({
            maxHum: (Number(e) + 1).toFixed(1)
        });
    },
    handleChangeMinTempDish: function(e) {
        this.setData({
            minTempDish: this.handleInput(e.detail.value, 1)
        });
    },
    handleReduceMinTempDish: function() {
        var e = this.data.minTempDish;
        this.setData({
            minTempDish: Number(e) < 1 ? (0).toFixed(1) : (e - 1).toFixed(1)
        });
    },
    handlePlusMinTempDish: function() {
        var e = this.data.minTempDish;
        this.setData({
            minTempDish: (Number(e) + 1).toFixed(1)
        });
    },
    handleChangeMaxTempDish: function(e) {
        this.setData({
            maxTempDish: this.handleInput(e.detail.value, 1)
        });
    },
    handleReduceMaxTempDish: function() {
        var e = this.data.maxTempDish;
        this.setData({
            maxTempDish: Number(e) < 1 ? (0).toFixed(1) : (e - 1).toFixed(1)
        });
    },
    handlePlusMaxTempDish: function() {
        var e = this.data.maxTempDish;
        this.setData({
            maxTempDish: (Number(e) + 1).toFixed(1)
        });
    },
    handleReset: function() {
        this.setData({
            minTemp: (0).toFixed(1),
            maxTemp: 40..toFixed(1),
            minHum: (0).toFixed(1),
            maxHum: 90..toFixed(1),
            minTempDish: (0).toFixed(1),
            maxTempDish: 500..toFixed(1)
        });
    },
    handleSubmit: function() {
        var e = this.data, a = e.project_id, i = e.minTemp, m = e.maxTemp, n = e.minHum, d = e.maxHum, s = e.minTempDish, u = e.maxTempDish, h = e.config_id, o = e.warnSet, p = {
            project_id: a,
            temp_lower: Number(i),
            temp_upper: Number(m),
            humi_lower: Number(n),
            humi_upper: Number(d),
            dish_temp_lower: Number(s),
            dish_temp_upper: Number(u),
            config_id: h || null
        };
        if (h) {
            if (o.temp_lower === Number(i) && o.temp_upper === Number(m) && o.humi_lower === Number(n) && o.humi_upper === Number(d) && o.dish_temp_lower === Number(s) && o.dish_temp_upper === Number(u)) return wx.showToast({
                title: "设置成功！",
                icon: "success"
            });
            t(p).then(function(e) {
                2e4 === e.data.code ? (wx.showToast({
                    title: "设置成功！",
                    icon: "success"
                }), setTimeout(function() {
                    wx.switchTab({
                        url: "../my/index"
                    });
                }, 1500)) : wx.showToast({
                    title: e.data.message,
                    icon: "error"
                });
            });
        } else t(p).then(function(e) {
            2e4 === e.data.code ? (wx.showToast({
                title: "设置成功！",
                icon: "success"
            }), setTimeout(function() {
                wx.switchTab({
                    url: "../my/index"
                });
            }, 1500)) : wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        });
    },
    handleInput: function(e, a) {
        var t = e;
        return (t = 1 === a ? (t = (t = (t = t.replace(/[^\d.]/g, "")).replace(/\.{2,}/g, ".")).replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")).replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3") : (t = t.replace(/[^\d]/g, "")).replace(/^(\-)*(\d+)*$/, "$1$2")).indexOf(".") < 0 && "" != t && (t = parseFloat(t)), 
        t;
    }
});