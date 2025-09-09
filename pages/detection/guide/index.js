Page({
  data: {
    detectionId: ''
  },
  onLoad(options) {
    if (options && options.detectId) {
      this.setData({ detectionId: options.detectId });
    }
  },
  copyAddress() {
    const text = '蜜蜂疫病检测中心, 北京市朝阳区xxx路xxx号, 检测部 收, 400-xxx-xxxx';
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '地址已复制', icon: 'success' });
      }
    });
  },
  confirmMailed() {
    wx.showToast({ title: '已确认邮寄', icon: 'success' });
    // TODO: 可回写状态至后端，或返回上一页
  }
});

