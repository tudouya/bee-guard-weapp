Page({
  data: {
    appName: '蜜蜂疫病监控平台',
    version: '1.0.0'
  },

  onLoad: function (options) {
    console.log('首页加载完成')
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.appName
    })
  },

  onShow: function () {
    // 页面显示时的逻辑
  },

  goToDetection: function () {
    wx.showToast({
      title: '检测功能开发中',
      icon: 'none'
    })
  }
})