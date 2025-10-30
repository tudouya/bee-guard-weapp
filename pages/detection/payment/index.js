const authUtil = require('../../../utils/auth.js');
const api = require('../../../utils/api.js');
const { resolveAsset } = require('../../../utils/assets.js');

const DEFAULT_QR_IMAGE = resolveAsset('/weapp/pay_qr.jpg');

Page({
  data: {
    pkg: { id: '', name: '', price: 0 },
    codeText: '',
    orderId: '',
    // 默认二维码图片（托管于 S3，与本地路径保持一致）
    qrImageUrl: DEFAULT_QR_IMAGE
  },
  onLoad(options) {
    const pkg = {
      id: options.id ? decodeURIComponent(options.id) : '',
      name: options.name ? decodeURIComponent(options.name) : '基础检测套餐',
      price: Number(options.price || 199)
    };
    const codeText = `${pkg.id || 'PKG'}-${Date.now()}`;
    // 真实对接时，orderId 在创建订单后获得
    const orderId = '';
    // 默认使用远程托管的二维码；若传入了 qrUrl 则优先使用
    const qrImageUrl = options.qrUrl ? decodeURIComponent(options.qrUrl) : DEFAULT_QR_IMAGE;
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
  async paidDone() {
    // 确认后创建订单，再进入凭证提交
    if (authUtil.ensureLogin) {
      const res = await Promise.resolve(authUtil.ensureLogin());
      if (!res || !res.ok) return;
    }
    const { id, name, price } = this.data.pkg;
    if (!price || Number(price) <= 0) {
      wx.showToast({ title: '金额异常，请返回重新选择', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '创建订单中...' });
    try {
      const data = await api.post('/api/orders', {
        amount: Number(price),
        package_id: id || undefined,
        package_name: name || undefined
      });
      wx.hideLoading();
      const orderId = data && (data.order_id || data.id);
      if (!orderId) {
        wx.showToast({ title: '订单创建失败', icon: 'none' });
        return;
      }
      this.setData({ orderId: String(orderId) });
      wx.navigateTo({
        url: `/pages/detection/proof/index?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&price=${price}&orderId=${encodeURIComponent(orderId)}`
      });
    } catch (e) {
      wx.hideLoading();
      if (e && e.status === 401) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        try { wx.navigateTo({ url: '/pages/auth/login/index' }); } catch (err) {}
        return;
      }
      const msg = (e && e.message) ? e.message : '创建订单失败';
      wx.showToast({ title: msg, icon: 'none' });
    }
  }
});
