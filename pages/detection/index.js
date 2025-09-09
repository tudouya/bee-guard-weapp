Page({
  data: {
    activeTab: 'detection',
    searchValue: '',
    results: [
      {
        id: 1,
        detectionId: 'BG202409001',
        status: 'completed',
        statusText: '检测完成',
        date: '2024-09-08',
        type: '免费检测'
      },
      {
        id: 2,
        detectionId: 'BG202409002',
        status: 'processing',
        statusText: '检测中',
        date: '2024-09-09',
        type: '自费检测'
      }
    ]
  },

  onLoad: function (options) {
    // 检查是否需要直接跳转到结果查询
    if (options.tab === 'results') {
      this.setData({
        activeTab: 'results'
      });
    }
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  startFreeDetection: function() {
    wx.showToast({
      title: '免费检测功能开发中',
      icon: 'none'
    });
  },

  startPaidDetection: function() {
    wx.showToast({
      title: '自费检测功能开发中',
      icon: 'none'
    });
  },

  onSearchInput: function(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  searchResults: function() {
    wx.showToast({
      title: '查询功能开发中',
      icon: 'none'
    });
  },

  viewDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '结果详情功能开发中',
      icon: 'none'
    });
  }
});