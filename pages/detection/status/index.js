Page({
  data: {
    appId: '',
    price: '',
    submitTime: '',
    steps: [
      { key: 'proof', status: 'done' },
      { key: 'review', status: 'doing' },
      { key: 'generate', status: 'todo' },
      { key: 'notify', status: 'todo' }
    ]
  },
  onLoad(options) {
    const appId = options.appId || '';
    const price = options.price || '';
    const now = new Date();
    const submitTime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    this.setData({ appId, price, submitTime });
  },
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },
  contact() {
    wx.showActionSheet({
      itemList: ['拨打客服 400-xxx-xxxx', '复制客服微信 ID'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({ phoneNumber: '4000000000' });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({ data: 'bee-guard-kefu' });
        }
      }
    });
  }
});

