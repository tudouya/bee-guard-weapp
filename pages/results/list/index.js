const authUtil = require('../../../utils/auth.js');
const resultsSvc = require('../../../services/results.js');

Page({
  data: {
    all: [],
    list: [],
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    hasMore: true,
    query: { keyword: '' }
  },
  
  onShow() {
    const auth = authUtil.getAuth();
    if (!authUtil.isLoggedIn()) {
      wx.redirectTo({ url: '/pages/auth/login/index' });
      return;
    }
    if (this.data.list.length === 0) {
      this.loadFirstPage();
    }
  },
  async loadFirstPage() {
    this.setData({ page: 1, list: [], hasMore: true });
    await this.fetchList();
  },
  async loadMore() {
    if (!this.data.hasMore || this.data.loading) return;
    this.setData({ page: this.data.page + 1 });
    await this.fetchList(true);
  },
  async fetchList(append = false) {
    try {
      this.setData({ loading: true });
      const { page, pageSize } = this.data;
      const res = await resultsSvc.getResults({ page, pageSize });
      const newAll = append ? this.data.all.concat(res.list) : res.list;
      const hasMore = res.hasMore === true ? true : (newAll.length < res.total);
      this.setData({ all: newAll, total: res.total, hasMore }, () => {
        this.applyFilters();
      });
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
  // 过滤与搜索
  applyFilters() {
    const { all, query } = this.data;
    let arr = all.slice();
    // keyword
    if (query.keyword && query.keyword.trim()) {
      const kw = query.keyword.trim().toLowerCase();
      arr = arr.filter(x => (x.detectionId||'').toLowerCase().includes(kw) || (x.sampleNo||'').toLowerCase().includes(kw));
    }
    this.setData({ list: arr });
  },
  onKeywordInput(e) {
    this.setData({ 'query.keyword': e.detail.value });
  },
  // 移除状态与日期筛选，保留查询按钮调用 applyFilters
  goDetection() {
    wx.switchTab({ url: '/pages/detection/index' });
  },
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(x => String(x.id) === String(id));
    if (!item) return;
    wx.navigateTo({ url: `/pages/results/detail/index?id=${encodeURIComponent(item.id)}` });
  },
  viewProgress(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(x => String(x.id) === String(id));
    if (!item) return;
    if (item.status === 'pending') {
      wx.navigateTo({ url: `/pages/detection/guide/index?detectId=${encodeURIComponent(item.detectionId)}` });
    } else {
      wx.navigateTo({ url: `/pages/detection/status/index?appId=${encodeURIComponent(item.detectionId)}&price=0` });
    }
  }
});
