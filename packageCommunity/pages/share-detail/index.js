Page({
  data: {
    item: { title: '分享详情', author: '蜂友', date: '—', content: '—', status: 'pending' }
  },
  onLoad(options) {
    const id = options && options.id || '1';
    const item = {
      title: id === '2' ? '蜂具日常消毒流程' : '越冬期蜂群管理经验',
      author: id === '2' ? '蜂友D' : '蜂友C',
      date: '2025-01-03',
      content: '正文占位：图文/视频内容，审核通过后展示。',
      status: id === '2' ? 'approved' : 'pending'
    };
    this.setData({ item });
  },
  // 返回社区统一页（经验分享 Tab）
  goBackToCommunity(){
    wx.redirectTo({ url: '/packageCommunity/pages/disease-list/index?tab=share' });
  }
});
