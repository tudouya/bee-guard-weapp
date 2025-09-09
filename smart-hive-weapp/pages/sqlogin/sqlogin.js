Page({
    data: {},
    onLoad: function(e) {
        // 直接跳转到首页，不进行任何授权验证
        this.goToHome();
    },
    onShow: function() {
        // 每次显示页面时也直接跳转
        this.goToHome();
    },
    goToHome: function() {
        wx.switchTab({
            url: "/pages/index/index"
        });
    }
});