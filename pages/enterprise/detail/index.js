const enterpriseService = require('../../../services/enterprise.js');

Page({
  data: {
    detail: null,
    loading: true,
    errorMessage: '',
    enterpriseId: ''
  },

  onLoad(options) {
    const { id } = options || {};
    if (!id) {
      this.setData({ loading: false, errorMessage: '缺少企业 ID' });
      wx.showToast({ title: '缺少企业 ID', icon: 'none' });
      return;
    }
    this.setData({ enterpriseId: id });
    this.fetchDetail(id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true, errorMessage: '' });
    try {
      const detail = await enterpriseService.getEnterpriseDetail(id);
      const normalized = Object.assign({}, detail, {
        logo: detail && detail.logo ? detail.logo : '/images/common/placeholder-card.png'
      });
      this.setData({ detail: normalized, loading: false });
      if (normalized && normalized.name) {
        wx.setNavigationBarTitle({ title: normalized.name });
      }
    } catch (error) {
      const message = (error && error.message) || '企业详情加载失败';
      wx.showToast({ title: message, icon: 'none' });
      this.setData({ errorMessage: message, loading: false });
    }
  },

  handleRetry() {
    if (!this.data.enterpriseId) return;
    this.fetchDetail(this.data.enterpriseId);
  },

  handleCallPhone() {
    const phone = this.data.detail && this.data.detail.contact && this.data.detail.contact.phone;
    if (!phone) return;
    wx.makePhoneCall({ phoneNumber: phone });
  },

  handleCopyWechat() {
    const wechat = this.data.detail && this.data.detail.contact && this.data.detail.contact.wechat;
    if (!wechat) return;
    wx.setClipboardData({
      data: wechat,
      success() {
        wx.showToast({ title: '已复制企业微信', icon: 'success' });
      }
    });
  },

  handleCopyLink() {
    const link = this.data.detail && this.data.detail.contact && this.data.detail.contact.link;
    if (!link) return;
    wx.setClipboardData({
      data: link,
      success() {
        wx.showToast({ title: '已复制官网链接', icon: 'success' });
      }
    });
  }
});
