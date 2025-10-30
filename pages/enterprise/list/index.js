const enterpriseService = require('../../../services/enterprise.js');
const { resolveAsset } = require('../../../utils/assets.js');

const PLACEHOLDER_LOGO = resolveAsset('/weapp/placeholder-card.png');

Page({
  data: {
    enterprises: [],
    page: 1,
    perPage: 10,
    hasMore: true,
    loading: false,
    errorMessage: '',
    emptyPlaceholder: PLACEHOLDER_LOGO
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
      const { list, meta } = await enterpriseService.listEnterprises({
        page: nextPage,
        per_page: this.data.perPage
      });
      const normalized = Array.isArray(list)
        ? list.map((item) => {
            const certificationTags = Array.isArray(item && item.certifications)
              ? item.certifications
                  .map((tag) => {
                    if (typeof tag === 'string') return tag.trim();
                    if (tag === undefined || tag === null) return '';
                    return String(tag).trim();
                  })
                  .filter((tag) => !!tag)
                  .slice(0, 3)
              : [];
            return Object.assign({}, item, {
              logo: item && item.logo ? item.logo : PLACEHOLDER_LOGO,
              certificationTags
            });
          })
        : [];
      const enterprises = reset ? normalized : this.data.enterprises.concat(normalized);
      this.setData({
        enterprises,
        page: nextPage,
        hasMore: !!(meta && typeof meta.has_more !== 'undefined' ? meta.has_more : (meta.page || 1) < (meta.total_pages || 1)),
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
