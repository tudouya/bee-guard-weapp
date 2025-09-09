Page({
    data: {
        data: [ {
            id: "1LoTyMnkwNb_gy--j5C2EtCSx3HJ9BG7qN_mt5vHcoY",
            name: "设备预警"
        } ]
    },
    onLoad: function(t) {},
    onShow: function() {},
    handleWarrant: function(t) {
        var n = this.data.data.find(function(n, a) {
            return a === t.currentTarget.dataset.index;
        }).id;
        wx.requestSubscribeMessage({
            tmplIds: [ n ],
            success: function(t) {
                "accept" === t[n] && wx.showToast({
                    title: "授权成功！",
                    icon: "success"
                }), "reject" === t[n] && wx.showToast({
                    title: "取消授权！",
                    icon: "error"
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    }
});