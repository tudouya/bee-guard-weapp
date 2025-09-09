var t = getApp();

module.exports = {
    get: function(e) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise(function(o, a) {
            wx.request({
                url: t.globalData.url + e,
                data: n,
                method: "GET",
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    "x-auth-token": wx.getStorageSync("token")
                },
                success: function(t) {
                    o(t);
                },
                fail: function(t) {
                    console.error("GET请求失败:", e, t);
                    wx.showToast({
                        title: "网络请求失败",
                        icon: "error"
                    });
                    a(t);
                }
            });
        });
    },
    post: function(e) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise(function(o, a) {
            wx.request({
                url: t.globalData.url + e,
                data: n,
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    "x-auth-token": wx.getStorageSync("token")
                },
                success: function(t) {
                    o(t);
                },
                fail: function(t) {
                    console.error("POST请求失败:", e, t);
                    wx.showToast({
                        title: "网络请求失败",
                        icon: "error"
                    });
                    a(t);
                }
            });
        });
    },
    jsonPost: function(e) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise(function(o, a) {
            wx.request({
                url: t.globalData.url + e,
                data: n,
                method: "POST",
                header: {
                    "content-type": "application/json",
                    "x-auth-token": wx.getStorageSync("token")
                },
                success: function(t) {
                    o(t);
                },
                fail: function(t) {
                    console.error("JSON POST请求失败:", e, t);
                    wx.showToast({
                        title: "网络请求失败",
                        icon: "error"
                    });
                    a(t);
                }
            });
        });
    }
};