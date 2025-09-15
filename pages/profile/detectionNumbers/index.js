const api = require('../../../utils/api.js');
const authUtil = require('../../../utils/auth.js');

Page({
  data: {
    stats: {
      total: 0,
      assigned: 0,
      used: 0,
      expired: 0
    },
    assignedNumbers: [],
    usedNumbers: [],
    expiredNumbers: [],
    loading: true,
    isEmpty: false
  },

  hasLoaded: false,

  onLoad() {
    this.loadDetectionNumbers();
  },

  onShow() {
    // 首次加载时 onLoad 已经请求过了，不需要在 onShow 中重复请求
    // 只有当页面已经加载过且从其他页面返回时才刷新
    if (this.hasLoaded) {
      this.loadDetectionNumbers();
    }
  },

  onPullDownRefresh() {
    this.loadDetectionNumbers().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadDetectionNumbers() {
    if (authUtil.ensureLogin) {
      const res = await Promise.resolve(authUtil.ensureLogin());
      if (!res || !res.ok) {
        this.setData({ loading: false });
        return;
      }
    }

    this.setData({ loading: true });

    try {
      console.log('开始请求检测号数据...');
      const response = await api.get('/api/detection-codes');
      console.log('API响应:', response);

      const numbers = response.data || [];
      console.log('检测号数据:', numbers);

      // 计算统计数据
      const stats = this.calculateStats(numbers);
      const groupedNumbers = this.processNumbers(numbers);

      console.log('统计数据:', stats);
      console.log('分组数据:', groupedNumbers);

      this.setData({
        stats,
        ...groupedNumbers,
        isEmpty: numbers.length === 0,
        loading: false
      });

      // 标记已加载过数据
      this.hasLoaded = true;


    } catch (error) {
      console.error('加载检测号失败:', error);
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  // 计算统计数据
  calculateStats(numbers) {
    const total = numbers.length;
    // 后端返回的可用状态可能为 'available'，兼容处理
    const assigned = numbers.filter(n => n.status === 'assigned' || n.status === 'available').length;
    const used = numbers.filter(n => n.status === 'used').length;
    const expired = numbers.filter(n => n.status === 'expired').length;

    return { total, assigned, used, expired };
  },

  processNumbers(numbers) {
    const mapSource = {
      'self_paid': '自费检测',
      'gift': '赠送检测',
      'government': '政府检测',
      'enterprise': '企业检测'
    };
    const fmt = (timeStr) => {
      if (!timeStr) return '--';
      try {
        const date = new Date(timeStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return '今天';
        if (diffDays === 1) return '昨天';
        if (diffDays < 7) return `${diffDays}天前`;
        return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' });
      } catch (e) { return (timeStr || '').slice(0, 10); }
    };

    const enrich = (n) => ({
      ...n,
      displaySourceType: mapSource[n.source_type] || n.source_type,
      assignedAtText: fmt(n.assigned_at),
      usedAtText: fmt(n.used_at)
    });

    const assignedList = numbers
      .filter(n => n.status === 'assigned' || n.status === 'available')
      .map(enrich);
    const usedList = numbers
      .filter(n => n.status === 'used')
      .map(enrich);
    const expiredList = numbers
      .filter(n => n.status === 'expired')
      .map(enrich);

    return {
      assignedNumbers: assignedList,
      usedNumbers: usedList,
      expiredNumbers: expiredList
    };
  },

  // 复制检测号
  copyNumber(e) {
    const number = e.currentTarget.dataset.number;
    const status = e.currentTarget.dataset.status;

    wx.setClipboardData({
      data: number,
      success: () => {
        if (status === 'assigned') {
          // 已分配的检测号，询问是否立即检测
          wx.showModal({
            title: '复制成功',
            content: '检测号已复制，是否立即进行检测？',
            confirmText: '立即检测',
            cancelText: '暂不检测',
            success: (res) => {
              if (res.confirm) {
                this.goToDetection(number);
              }
            }
          });
        } else {
          wx.showToast({
            title: '检测号已复制',
            icon: 'success'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 立即检测
  startDetection(e) {
    const number = e.currentTarget.dataset.number;
    this.goToDetection(number);
  },

  goToDetection(number) {
    wx.switchTab({
      url: `/pages/detection/index?detectionNumber=${encodeURIComponent(number)}`
    });
  },

  // 查看报告
  viewReport(e) {
    const number = e.currentTarget.dataset.number;
    wx.navigateTo({
      url: `/pages/results/detail/index?detectionNumber=${encodeURIComponent(number)}`
    });
  },

  // 查看详情
  viewDetails(e) {
    const number = e.currentTarget.dataset.number;
    wx.showToast({
      title: `查看 ${number} 详情`,
      icon: 'none'
    });
  },

  // 格式化时间显示
  formatTime(timeStr) {
    if (!timeStr) return '--';

    try {
      const date = new Date(timeStr);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return '今天';
      } else if (diffDays === 1) {
        return '昨天';
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        });
      }
    } catch (e) {
      return timeStr.slice(0, 10);
    }
  },

  // 获取状态文本
  getStatusText(status) {
    const statusMap = {
      'assigned': '可使用',
      'used': '已完成',
      'expired': '已过期'
    };
    return statusMap[status] || status;
  },

  // 获取状态颜色
  getStatusColor(status) {
    const colorMap = {
      'assigned': '#07c160', // 主题绿色
      'used': '#6b7280',     // 灰色
      'expired': '#ff4d4f'   // 主题红色
    };
    return colorMap[status] || '#6b7280';
  },

  // 获取检测号来源类型名称
  getSourceTypeName(sourceType) {
    const typeMap = {
      'self_paid': '自费检测',
      'gift': '赠送检测',
      'government': '政府检测',
      'enterprise': '企业检测'
    };
    return typeMap[sourceType] || sourceType;
  }
});
