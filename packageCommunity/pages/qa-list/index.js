Page({
  data: {
    list: [
      { id: 1, title: '春季群势下降如何处理？', author: '蜂友A', date: '2025-01-06' },
      { id: 2, title: '疑似AFB，如何快速排查？', author: '蜂友B', date: '2025-01-05' }
    ]
  },
  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/packageCommunity/pages/qa-detail/index?id=${id}` });
  },
  goPost() {
    wx.navigateTo({ url: '/packageCommunity/pages/qa-post/index' });
  }
});

