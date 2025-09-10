Page({
  data: {
    list: [
      { id: 'sbv', name: '囊状幼虫病 (SBV)', brief: '病毒性疾病，幼虫呈囊状' },
      { id: 'afb', name: '美洲幼虫腐臭病 (AFB)', brief: '细菌性疾病，具有传染性' },
      { id: 'efb', name: '欧洲幼虫腐臭病 (EFB)', brief: '细菌性疾病，多发于春季' },
      { id: 'varroa', name: '蜂螨病', brief: '寄生虫病，需综合防控' }
    ]
  },
  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/packageKnowledge/pages/disease-detail/index?id=${id}` });
  },
  openPrevention() {
    wx.navigateTo({ url: '/packageKnowledge/pages/prevention/index' });
  }
});

