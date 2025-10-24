const epidemicSvc = require('../../../services/epidemic.js');

Page({
  data: {
    loading: true,
    detail: {
      id: null,
      title: '',
      riskLevel: 'low',
      riskLevelText: '',
      regionText: '',
      publishedAt: '',
      publishedAtText: '',
      source: '',
      sourceText: '',
      summary: '',
      contentNodes: ''
    }
  },

  onLoad(options) {
    const id = Number((options && options.id) || 0);
    if (!id) {
      wx.showToast({ title: '通报不存在', icon: 'none' });
      this.setData({ loading: false });
      return;
    }
    this.loadDetail(id);
  },

  loadDetail(id) {
    this.setData({ loading: true });
    epidemicSvc.fetchBulletinDetail(id)
      .then((detail) => {
        const regionText = detail.regionText || '';
        const contentNodes = detail.content || '';
        const publishedAtText = this.formatDate(detail.publishedAt);
        const sourceText = detail.source || '官方发布';
        this.setData({
          detail: Object.assign({}, detail, {
            regionText,
            contentNodes,
            publishedAtText,
            sourceText
          }),
          loading: false
        });
        if (detail.title) {
          wx.setNavigationBarTitle({ title: detail.title });
        }
      })
      .catch((err) => {
        const message = (err && err.message) ? err.message : '加载失败';
        wx.showToast({ title: message, icon: 'none' });
        this.setData({ loading: false });
      });
  },

  formatDate(value) {
    if (!value) return '';
    const str = String(value);
    const normalized = str.replace(/T/g, ' ').replace(/-/g, '/');
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) {
      return str.length >= 10 ? str.slice(0, 10) : str;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  },

  onShareAppMessage() {
    const d = this.data.detail || {};
    const id = d.id || '';
    return {
      title: d.title || '疫情通报',
      path: `/pages/epidemic/detail/index?id=${id}`
    };
  }
});
