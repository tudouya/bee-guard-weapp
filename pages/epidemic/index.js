Page({
  data: {
    newsList: [
      {
        id: 1,
        title: '北京市发现蜂螨病疫情，加强监控',
        date: '2024-09-08',
        level: 'high',
        levelText: '高风险'
      },
      {
        id: 2,
        title: '山东省蜂群疫情防控工作取得阶段性成果',
        date: '2024-09-07',
        level: 'medium',
        levelText: '中风险'
      },
      {
        id: 3,
        title: '全国蜂群健康检测网络建设稳步推进',
        date: '2024-09-06',
        level: 'low',
        levelText: '低风险'
      }
    ]
  },

  onLoad: function (options) {
    
  },

  viewMap: function() {
    wx.showToast({
      title: '疫情地图功能开发中',
      icon: 'none'
    });
  },

  viewMoreNews: function() {
    wx.showToast({
      title: '更多新闻功能开发中',
      icon: 'none'
    });
  },

  viewNewsDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '新闻详情功能开发中',
      icon: 'none'
    });
  }
});