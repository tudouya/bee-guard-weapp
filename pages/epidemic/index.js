const epidemicSvc = require('../../services/epidemic.js');

Page({
  data: {
    loading: false,
    loadingMore: false,
    bulletins: [],
    error: '',
    page: 1,
    hasMore: true
  },

  onLoad() {
    this.loadBulletins({ refresh: true });
  },

  onPullDownRefresh() {
    this.loadBulletins({ refresh: true, stopRefresh: true });
  },

  onReachBottom() {
    if (this.data.loadingMore || !this.data.hasMore) {
      return;
    }
    this.loadBulletins({ loadMore: true });
  },

  loadBulletins({ refresh = false, loadMore = false, stopRefresh = false } = {}) {
    const stateUpdates = {};

    if (refresh) {
      stateUpdates.loading = true;
      stateUpdates.loadingMore = false;
      stateUpdates.error = '';
      stateUpdates.page = 1;
      stateUpdates.hasMore = true;
    } else if (loadMore) {
      stateUpdates.loadingMore = true;
      stateUpdates.error = '';
    } else {
      stateUpdates.loading = true;
      stateUpdates.error = '';
    }

    this.setData(stateUpdates);

    const nextPage = loadMore ? this.data.page + 1 : refresh ? 1 : this.data.page || 1;

    epidemicSvc.fetchBulletins({ page: nextPage })
      .then(({ list, meta }) => {
        const currentList = loadMore ? (this.data.bulletins || []) : [];
        const merged = loadMore ? currentList.concat(list || []) : (list || []);

        const hasMore = meta ? Boolean(meta.has_more) : (list && list.length > 0);

        this.setData({
          bulletins: merged,
          loading: false,
          loadingMore: false,
          page: nextPage,
          hasMore
        });
      })
      .catch((err) => {
        const message = (err && err.message) ? err.message : '加载通报失败';
        this.setData({
          error: message,
          loading: false,
          loadingMore: false
        });
        wx.showToast({ title: message, icon: 'none' });
      })
      .finally(() => {
        if (stopRefresh) {
          wx.stopPullDownRefresh();
        }
      });
  },

  viewMap() {
    wx.navigateTo({ url: '/packageCharts/pages/epidemic-map/index' });
  },

  viewNewsDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/pages/epidemic/detail/index?id=${id}` });
  }
});
