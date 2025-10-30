const api = require('../../../utils/api.js');
const authUtil = require('../../../utils/auth.js');
const { resolveAsset } = require('../../../utils/assets.js');

const TABS = [
  { label: '可使用', value: 'assigned', statuses: ['assigned', 'available'], count: 0 },
  { label: '已使用', value: 'used', statuses: ['used', 'completed'], count: 0 },
  { label: '已过期', value: 'expired', statuses: ['expired'], count: 0 }
];

const STATUS_ALIAS = {
  assigned: 'assigned',
  available: 'assigned',
  usable: 'assigned',
  used: 'used',
  completed: 'used',
  expired: 'expired'
};

const STATUS_TEXT = {
  assigned: '可使用',
  used: '已完成',
  expired: '已过期'
};

const SOURCE_TEXT = {
  self_paid: '自费检测',
  gift: '赠送检测',
  government: '政府检测',
  enterprise: '企业检测'
};

// 数据来源于后端接口 /api/detection-codes

Page({
  data: {
    summary: {
      total: 0,
      assigned: 0,
      used: 0,
      expired: 0
    },
    tabs: TABS,
    activeTab: 'assigned',
    list: [],
    rawNumbers: [],
    loading: true,
    error: false,
    isEmpty: false,
    lastSyncText: '',
    emptyIcon: resolveAsset('/weapp/profile-icon-detection.png')
  },
  hasLoaded: false,

  onLoad() {
    this.ensureLogged()
      .then(() => this.loadDetectionNumbers())
      .catch(() => {
        this.setData({ loading: false });
      });
  },
  onShow() {
    if (this.hasLoaded) {
      this.ensureLogged()
        .then(() => this.loadDetectionNumbers({ silent: true }))
        .catch(() => {});
    }
  },
  onPullDownRefresh() {
    this.ensureLogged()
      .then(() => this.loadDetectionNumbers({ silent: true }))
      .catch(() => {})
      .finally(() => {
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

  async loadDetectionNumbers({ silent = false } = {}) {
    if (!silent) {
      this.setData({ loading: true, error: false });
    }
    try {
      const response = await api.get('/api/detection-codes');
      const records = this.extractRecords(response);
      this.applyNumbers(records);
      this.hasLoaded = true;
      this.setData({ loading: false, error: false });
    } catch (err) {
      console.warn('检测号接口异常', err);
      this.setData({ loading: false, error: true, isEmpty: true });
      if (!silent) {
        wx.showToast({ title: '加载失败，请稍后重试', icon: 'none' });
      }
    }
  },

  extractRecords(response) {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (response.list && Array.isArray(response.list)) return response.list;
    return [];
  },

  applyNumbers(numbers) {
    const normalized = this.normalizeNumbers(numbers);
    this.applyNormalized(normalized);
  },

  normalizeNumbers(numbers) {
    const items = (numbers || []).map(raw => this.decorateNumber(raw));
    const counts = { assigned: 0, used: 0, expired: 0 };
    items.forEach(item => {
      const key = item.normalizedStatus;
      if (counts[key] !== undefined) counts[key] += 1;
    });
    return {
      items,
      counts,
      summary: {
        total: items.length,
        assigned: counts.assigned,
        used: counts.used,
        expired: counts.expired
      }
    };
  },

  applyNormalized(payload, options = {}) {
    const { items, counts, summary } = payload;
    const nextTabs = (this.data.tabs || TABS).map(tab => Object.assign({}, tab, {
      count: counts[tab.value] || 0
    }));
    let active = this.data.activeTab || 'assigned';
    if (summary.total > 0 && !counts[active]) {
      const fallbackTab = nextTabs.find(t => t.count > 0);
      if (fallbackTab) active = fallbackTab.value;
    }
    const list = this.filterByStatus(items, active);
    const lastSyncText = this.buildSyncText(items);
    this.setData({
      summary,
      tabs: nextTabs,
      activeTab: active,
      list,
      rawNumbers: items,
      isEmpty: summary.total === 0,
      lastSyncText,
      error: false
    });
    // 无模拟标记
  },

  buildSyncText(items) {
    if (!items || !items.length) return '';
    const latest = items
      .map(item => item.assignedAt)
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a))[0];
    if (!latest) return '';
    const display = this.formatDate(latest, { withTime: true });
    return display ? `最近更新：${display}` : '';
  },

  filterByStatus(list, status) {
    return (list || []).filter(item => item.normalizedStatus === status);
  },

  decorateNumber(raw) {
    const normalizedStatus = STATUS_ALIAS[raw.status] || 'assigned';
    const sourceText = SOURCE_TEXT[raw.source_type] || raw.source_type || '—';
    return {
      id: raw.id || raw.full_code,
      full_code: raw.full_code || raw.code || '--',
      normalizedStatus,
      statusText: STATUS_TEXT[normalizedStatus] || '可使用',
      sourceText,
      assignedAt: raw.assigned_at || '',
      assignedAtText: this.formatDate(raw.assigned_at),
      usedAt: raw.used_at || '',
      usedAtText: this.formatDate(raw.used_at),
      remark: raw.remark || '',
      channel: raw.channel || '',
      detectionPlan: raw.detection_plan || '',
      extra: raw.extra || {},
      raw
    };
  },

  formatDate(value, { withTime = false } = {}) {
    if (!value) return '--';
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) throw new Error('Invalid date');
      if (withTime) {
        return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())} ${this.pad(date.getHours())}:${this.pad(date.getMinutes())}`;
      }
      return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
    } catch (e) {
      return (value || '').slice(0, withTime ? 16 : 10) || '--';
    }
  },

  pad(num) {
    return num < 10 ? `0${num}` : `${num}`;
  },

  handleTabChange(event) {
    const { status } = event.currentTarget.dataset;
    if (!status || status === this.data.activeTab) return;
    const list = this.filterByStatus(this.data.rawNumbers, status);
    this.setData({ activeTab: status, list });
  },

  handleRetry() {
    this.ensureLogged()
      .then(() => this.loadDetectionNumbers())
      .catch(() => {});
  },

  copyNumber(event) {
    const number = event.currentTarget.dataset.number;
    const status = event.currentTarget.dataset.status;
    if (!number) return;
    wx.setClipboardData({
      data: number,
      success: () => {
        if (status === 'assigned') {
          wx.showModal({
            title: '复制成功',
            content: '检测号已复制，可直接粘贴到检测流程中使用。',
            showCancel: true,
            confirmText: '前往检测',
            cancelText: '稍后',
            success: (res) => {
              if (res.confirm) {
                this.goToDetection(number);
              }
            }
          });
        } else {
          wx.showToast({ title: '检测号已复制', icon: 'none' });
        }
      }
    });
  },

  startDetection(event) {
    const number = event.currentTarget.dataset.number;
    if (!number) return;
    this.goToDetection(number);
  },

  goToDetection(number) {
    const url = `/pages/detection/index?detectionNumber=${encodeURIComponent(number || '')}`;
    wx.switchTab({ url });
  },

  viewReport(event) {
    const number = event.currentTarget.dataset.number;
    if (!number) return;
    wx.navigateTo({ url: `/pages/results/detail/index?detectionNumber=${encodeURIComponent(number)}` });
  },

  goAcquireNumber() {
    wx.switchTab({ url: '/pages/detection/index' });
  }
});
