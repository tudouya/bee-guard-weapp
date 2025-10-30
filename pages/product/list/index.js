const productService = require('../../../services/product.js');
const { resolveAsset } = require('../../../utils/assets.js');

Page({
  data: {
    products: [],
    page: 1,
    perPage: 10,
    hasMore: true,
    loading: false,
    errorMessage: '',
    scene: '',
    emptyPlaceholder: resolveAsset('/weapp/placeholder-card.png')
  },

  onLoad(options) {
    const scene = options && options.scene ? decodeURIComponent(options.scene) : '';
    if (scene) {
      this.setData({ scene });
    }
    this.loadProducts({ reset: true });
  },

  onPullDownRefresh() {
    this.loadProducts({ reset: true });
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return;
    this.loadProducts({ reset: false });
  },

  async loadProducts({ reset = false } = {}) {
    const nextPage = reset ? 1 : this.data.page + 1;
    this.setData({ loading: true, errorMessage: '' });
    try {
      const { list, meta } = await productService.listRecommendedProducts({
        page: nextPage,
        per_page: this.data.perPage,
        scene: this.data.scene
      });
      const products = reset ? list : this.data.products.concat(list);
      this.setData({
        products,
        page: nextPage,
        hasMore: !!(meta && meta.has_more),
        loading: false
      });
    } catch (error) {
      const message = (error && error.message) || '产品信息加载失败';
      wx.showToast({ title: message, icon: 'none' });
      this.setData({ errorMessage: message, loading: false });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  handleRetry() {
    this.loadProducts({ reset: true });
  },

  handleViewDetail(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) return;
    wx.navigateTo({ url: `/pages/product/detail/index?id=${id}` });
  }
});
