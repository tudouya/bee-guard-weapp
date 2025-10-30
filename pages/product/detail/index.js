const productService = require('../../../services/product.js');
const { resolveAsset } = require('../../../utils/assets.js');

const PLACEHOLDER_IMAGE = resolveAsset('/weapp/placeholder-card.png');

Page({
  data: {
    detail: null,
    loading: true,
    errorMessage: '',
    productId: '',
    displayImages: [],
    activeImageIndex: 0
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
      const homepageImages = Array.isArray(detail && detail.homepage && detail.homepage.images)
        ? detail.homepage.images.filter(item => !!item)
        : [];
      const images = Array.isArray(detail && detail.images) ? detail.images.filter(item => !!item) : [];
      const displayImages = images.length
        ? images
        : homepageImages.length
          ? homepageImages
          : detail && detail.banner
            ? [detail.banner]
            : [PLACEHOLDER_IMAGE];
      this.setData({
        detail,
        loading: false,
        displayImages,
        activeImageIndex: 0
      });
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

  handleImageChange(event) {
    const detail = event && event.detail;
    const current = detail && typeof detail.current === 'number' ? detail.current : 0;
    if (current === this.data.activeImageIndex) return;
    this.setData({ activeImageIndex: current });
  },

  getPrimaryContact() {
    const detail = this.data.detail;
    if (!detail) return {};
    if (detail.contact && typeof detail.contact === 'object') {
      const { phone, wechat, website } = detail.contact;
      if (phone || wechat || website) return detail.contact;
    }
    if (detail.enterprise && detail.enterprise.contact) {
      return detail.enterprise.contact;
    }
    return {};
  },

  handleCallEnterprise() {
    const contact = this.getPrimaryContact();
    const phone = contact && contact.phone;
    if (!phone) return;
    wx.makePhoneCall({ phoneNumber: phone });
  },

  handleCopyWechat() {
    const contact = this.getPrimaryContact();
    const wechat = contact && contact.wechat;
    if (!wechat) return;
    wx.setClipboardData({
      data: wechat,
      success() {
        wx.showToast({ title: '已复制企业微信', icon: 'success' });
      }
    });
  },

  handleCopyLink() {
    const contact = this.getPrimaryContact();
    const website = contact && (contact.website || contact.link);
    if (!website) return;
    wx.setClipboardData({
      data: website,
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
