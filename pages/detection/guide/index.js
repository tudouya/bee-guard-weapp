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
    const text = '北京市海淀区圆明园西路二号中国农业科学院蜜蜂研究所\n王强（收）\n电话：13021226630';
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
