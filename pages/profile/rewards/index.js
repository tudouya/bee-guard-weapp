const authUtil = require('../../../utils/auth.js');
const rewardsService = require('../../../services/rewards.js');

const defaultSummary = { pending: 0, usable: 0, used: 0, expired: 0 };
const rewardTypeMap = {
  coupon: '购物券',
  badge: '勋章',
  qualification: '讲师资格',
  gift: '礼品券'
};

const tabs = [
  { label: '待审核', value: 'pending', count: 0 },
  { label: '可使用', value: 'usable', count: 0 },
  { label: '已使用', value: 'used', count: 0 },
  { label: '已过期', value: 'expired', count: 0 }
];

Page({
  data: {
    tabs,
    activeTab: 'usable',
    rewards: [],
    loading: false,
    actionLoading: '',
    error: false,
    summary: Object.assign({}, defaultSummary),
    summaryLoading: false,
    summaryError: false,
    expandedMap: {},
    rewardTypeMap
  },
  onLoad() {
    this.ensureLogged().then(() => {
      this.initData();
    }).catch(() => {});
  },
  onShow() {
    // 返回页面时刷新摘要与当前列表
    this.ensureLogged().then(() => {
      this.loadSummary();
      this.loadRewards(this.data.activeTab, { silent: true });
    }).catch(() => {});
  },
  onPullDownRefresh() {
    this.ensureLogged().then(() => {
      return Promise.all([
        this.loadSummary(),
        this.loadRewards(this.data.activeTab, { silent: true })
      ]);
    }).finally(() => {
      wx.stopPullDownRefresh();
    });
  },
  ensureLogged() {
    if (!authUtil || typeof authUtil.ensureLogin !== 'function') {
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve(authUtil.ensureLogin()).then(res => {
      if (!res || !res.ok) {
        const err = new Error('LOGIN_REQUIRED');
        err.code = 'LOGIN_REQUIRED';
        return Promise.reject(err);
      }
      return res;
    });
  },
  initData() {
    this.loadSummary();
    this.loadRewards(this.data.activeTab);
  },
  loadSummary() {
    if (!rewardsService || typeof rewardsService.getRewardSummary !== 'function') {
      return Promise.resolve();
    }
    this.setData({ summaryLoading: true, summaryError: false });
    return Promise.resolve(rewardsService.getRewardSummary())
      .then(summary => {
        const data = summary || {};
        const nextTabs = (this.data.tabs || tabs).map(item => Object.assign({}, item, {
          count: Number(data[item.value] || 0)
        }));
        this.setData({
          summary: {
            pending: Number(data.pending || 0),
            usable: Number(data.usable || 0),
            used: Number(data.used || 0),
            expired: Number(data.expired || 0)
          },
          summaryLoading: false,
          summaryError: false,
          tabs: nextTabs
        });
      })
      .catch(err => {
        if (err && err.code === 'LOGIN_REQUIRED') {
          this.setData({ summaryLoading: false });
          return;
        }
        const resetTabs = (this.data.tabs || tabs).map(item => Object.assign({}, item, { count: 0 }));
        this.setData({
          summaryLoading: false,
          summaryError: true,
          summary: Object.assign({}, defaultSummary),
          tabs: resetTabs
        });
      });
  },
  loadRewards(status, { silent = false } = {}) {
    if (!rewardsService || typeof rewardsService.getRewardsByStatus !== 'function') {
      return Promise.resolve();
    }
    const nextStatus = status || this.data.activeTab;
    if (!silent) {
      this.setData({ loading: true, error: false });
    }
    return Promise.resolve(rewardsService.getRewardsByStatus(nextStatus))
      .then(list => {
        const rewards = Array.isArray(list) ? list : [];
        this.setData({
          rewards,
          loading: false,
          error: false
        });
      })
      .catch(err => {
        if (err && err.code === 'LOGIN_REQUIRED') {
          this.setData({ loading: false });
          return;
        }
        this.setData({ loading: false, error: true, rewards: [] });
      });
  },
  handleTabChange(event) {
    const { status } = event.currentTarget.dataset;
    if (!status || status === this.data.activeTab) {
      return;
    }
    this.setData({ activeTab: status });
    this.loadRewards(status);
  },
  handleRetry() {
    this.ensureLogged().then(() => {
      this.loadRewards(this.data.activeTab);
    }).catch(() => {});
  },
  handlePrimaryAction(event) {
    const id = event.currentTarget.dataset.id;
    if (!id) return;
    const { rewards } = this.data;
    const item = (rewards || []).find(r => r.rewardId === id);
    if (!item) return;
    const status = item.status;
    if (status === 'usable') {
      // 标记为已使用，完成闭环
      this.setData({ actionLoading: id });
      Promise.resolve(rewardsService.markRewardUsed(id))
        .then(updated => {
          // 刷新列表与摘要，保持与后端一致
          return Promise.all([
            this.loadRewards(this.data.activeTab, { silent: true }),
            this.loadSummary()
          ]).then(() => {
            wx.showToast({ title: '已标记使用', icon: 'none' });
          });
        })
        .catch(err => {
          const msg = (err && err.message) ? err.message : '操作失败';
          wx.showToast({ title: msg, icon: 'none' });
        })
        .finally(() => {
          this.setData({ actionLoading: '' });
        });
      return;
    }
    if (status === 'pending') {
      wx.showToast({ title: '奖励审核中，请耐心等待', icon: 'none' });
      return;
    }
    wx.showToast({ title: '奖励已归档', icon: 'none' });
  },
  toggleExpand(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) return;
    const map = Object.assign({}, this.data.expandedMap);
    map[id] = !map[id];
    this.setData({ expandedMap: map });
  },
  handleCopyCode(event) {
    const { code } = event.currentTarget.dataset;
    if (!code) return;
    wx.setClipboardData({
      data: code,
      success() {
        wx.showToast({ title: '券码已复制', icon: 'none' });
      }
    });
  },
  goCommunity() {
    wx.navigateTo({ url: '/packageCommunity/pages/disease-list/index' });
  }
});
