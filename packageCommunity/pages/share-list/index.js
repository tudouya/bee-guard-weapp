Page({
  data: {
    active: 'share',
    list: [
      { id: 1, title: '越冬期蜂群管理经验', author: '蜂友C', date: '2025-01-03', likes: 126 },
      { id: 2, title: '蜂具日常消毒流程', author: '蜂友D', date: '2025-01-02', likes: 312 }
    ]
  },
  switchTab(e){
    const key = e.currentTarget.dataset.key;
    if (key === 'disease') { wx.redirectTo({ url: '/packageCommunity/pages/disease-list/index' }); return; }
    if (key === 'qa') { wx.redirectTo({ url: '/packageCommunity/pages/qa-list/index' }); return; }
  },
  openDetail(e) { const id = e.currentTarget.dataset.id; wx.navigateTo({ url: `/packageCommunity/pages/share-detail/index?id=${id}` }); },
  goPost() { wx.navigateTo({ url: '/packageCommunity/pages/share-post/index' }); }
});
