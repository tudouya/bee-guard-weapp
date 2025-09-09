var e = require("../../config/api").req_uthenticationaUser;

Page({
    data: {
        userInfo: {},
        userName: "",
        userPhone: ""
    },
    onLoad: function(e) {
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            userName: wx.getStorageSync("userInfo").user_name,
            userPhone: wx.getStorageSync("userInfo").user_phone
        });
    },
    onShow: function() {
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            userName: wx.getStorageSync("userInfo").user_name,
            userPhone: wx.getStorageSync("userInfo").user_phone
        });
    },
    handleChangeName: function(e) {
        this.setData({
            userName: e.detail.value
        });
    },
    handleChangePhone: function(e) {
        this.setData({
            userPhone: e.detail.value
        });
    },
    handleSubmit: function() {
        var n = this.data, t = n.userInfo, a = n.userName, s = n.userPhone;
        e({
            user_id: t.user_id,
            user_name: a,
            user_phone: s
        }).then(function(e) {
            2e4 === e.data.code ? (wx.showToast({
                title: "修改成功！",
                icon: "success"
            }), wx.setStorageSync("userInfo", e.data.data), setTimeout(function() {
                wx.switchTab({
                    url: "/pages/my/index"
                });
            }, 1500)) : wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        });
    }
});