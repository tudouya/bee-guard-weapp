const enterpriseService = require('../../../services/enterprise.js');

Page({
  data: {
    enterprises: [],
    page: 1,
    perPage: 10,
    hasMore: true,
    loading: false,
    errorMessage: ''
  },

  onLoad() {
    this.loadEnterprises({ reset: true });
  },

  onPullDownRefresh() {
    this.loadEnterprises({ reset: true });
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return;
    this.loadEnterprises({ reset: false });
  },

  async loadEnterprises({ reset = false } = {}) {
    const nextPage = reset ? 1 : this.data.page + 1;
    this.setData({ loading: true, errorMessage: '' });
    try {
      const { list, meta } = await enterpriseService.listFeaturedEnterprises({
        page: nextPage,
        per_page: this.data.perPage
      });
      const enterprises = reset ? list : this.data.enterprises.concat(list);
      this.setData({
        enterprises,
        page: nextPage,
        hasMore: !!(meta && meta.has_more),
        loading: false
      });
    } catch (error) {
      const message = (error && error.message) || '企业信息加载失败';
      wx.showToast({ title: message, icon: 'none' });
      this.setData({ errorMessage: message, loading: false });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  handleRetry() {
    this.loadEnterprises({ reset: true });
  },

  handleViewDetail(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) return;
    wx.navigateTo({ url: `/pages/enterprise/detail/index?id=${id}` });
  }
});

