const productService = require('../../../services/product.js');

Page({
  data: {
    detail: null,
    loading: true,
    errorMessage: '',
    productId: ''
  },

  onLoad(options = {}) {
    const { id } = options;
    if (!id) {
      this.setData({ loading: false, errorMessage: '缺少产品 ID' });
      wx.showToast({ title: '缺少产品 ID', icon: 'none' });
      return;
    }
    this.setData({ productId: id });
    this.fetchDetail(id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true, errorMessage: '' });
    try {
      const detail = await productService.getProductDetail(id);
      this.setData({ detail, loading: false });
      if (detail && detail.name) {
        wx.setNavigationBarTitle({ title: detail.name });
      }
    } catch (error) {
      const message = (error && error.message) || '产品详情加载失败';
      wx.showToast({ title: message, icon: 'none' });
      this.setData({ errorMessage: message, loading: false });
    }
  },

  handleRetry() {
    if (!this.data.productId) return;
    this.fetchDetail(this.data.productId);
  },

  handleCallEnterprise() {
    const phone = this.data.detail && this.data.detail.enterprise && this.data.detail.enterprise.phone;
    if (!phone) return;
    wx.makePhoneCall({ phoneNumber: phone });
  },

  handleCopyWechat() {
    const wechat = this.data.detail && this.data.detail.enterprise && this.data.detail.enterprise.wechat;
    if (!wechat) return;
    wx.setClipboardData({
      data: wechat,
      success() {
        wx.showToast({ title: '已复制企业微信', icon: 'success' });
      }
    });
  },

  handleCopyLink() {
    const link = this.data.detail && this.data.detail.enterprise && this.data.detail.enterprise.link;
    if (!link) return;
    wx.setClipboardData({
      data: link,
      success() {
        wx.showToast({ title: '官网链接已复制', icon: 'success' });
      }
    });
  },

  handleCopyPrice() {
    const price = this.data.detail && this.data.detail.priceRange;
    if (!price) return;
    wx.setClipboardData({
      data: price,
      success() {
        wx.showToast({ title: '价格信息已复制', icon: 'success' });
      }
    });
  }
});

