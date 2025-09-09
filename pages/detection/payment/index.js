Page({
  data: {
    pkg: { id: '', name: '', price: 0 },
    codeText: '',
    orderId: '',
    // 使用本地图片路径显示二维码（从小程序根目录开始）
    qrImageUrl: '/images/pay_qr.jpg'
  },
  onLoad(options) {
    const pkg = {
      id: options.id ? decodeURIComponent(options.id) : '',
      name: options.name ? decodeURIComponent(options.name) : '基础检测套餐',
      price: Number(options.price || 199)
    };
    const codeText = `${pkg.id || 'PKG'}-${Date.now()}`;
    const orderId = `ZF${Date.now()}`;
    // 保持本地默认二维码图片；若传入了 qrUrl 则优先使用
    const qrImageUrl = options.qrUrl ? decodeURIComponent(options.qrUrl) : '/images/pay_qr.jpg';
    this.setData({ pkg, codeText, orderId, qrImageUrl });
  },
  saveQrcode() {
    const url = this.data.qrImageUrl;
    if (!url) {
      wx.showToast({ title: '暂无二维码', icon: 'none' });
      return;
    }
    wx.getImageInfo({
      src: url,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
          fail: () => wx.showToast({ title: '保存失败，请长按图片保存', icon: 'none' })
        });
      },
      fail: () => wx.showToast({ title: '下载失败，请长按图片保存', icon: 'none' })
    });
  },
  paidDone() {
    const { id, name, price } = this.data.pkg;
    const { orderId } = this.data;
    wx.navigateTo({
      url: `/pages/detection/proof/index?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&price=${price}&orderId=${encodeURIComponent(orderId)}`
    });
  }
});
