Page({
  data: {
    list: [
      { id: 1, title: '越冬期蜂群管理经验', author: '蜂友C', date: '2025-01-03', likes: 126 },
      { id: 2, title: '蜂具日常消毒流程', author: '蜂友D', date: '2025-01-02', likes: 312 }
    ]
  },
  openDetail(e) { const id = e.currentTarget.dataset.id; wx.navigateTo({ url: `/packageCommunity/pages/share-detail/index?id=${id}` }); },
  goPost() { wx.navigateTo({ url: '/packageCommunity/pages/share-post/index' }); }
});

