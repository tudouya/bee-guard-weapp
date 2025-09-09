Page({
    data: {},
    onLoad: function(n) {
        // 直接跳转到发布页面，移除所有授权验证
        wx.navigateTo({
            url: "/pages/publish/index"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});