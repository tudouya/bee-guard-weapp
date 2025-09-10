Page({
  data: {
    active: 'disease',
    list: [
      { id: 'sbv', name: '囊状幼虫病 SBV', brief: '病毒性疾病，主要感染幼虫', symptom: '幼虫死亡呈囊状', count: 5 },
      { id: 'afb', name: '美洲幼虫腐臭病 AFB', brief: '细菌性疾病，传染性强', symptom: '幼虫腐烂有臭味', count: 8 },
      { id: 'nosema', name: '微孢子虫', brief: '寄生虫病，影响成蜂', symptom: '蜜蜂腹部肿胀', count: 3 }
    ]
  },
  switchTab(e){
    const key = e.currentTarget.dataset.key;
    if (key === 'qa') {
      wx.redirectTo({ url: '/packageCommunity/pages/qa-list/index' });
      return;
    }
    if (key === 'share') {
      wx.redirectTo({ url: '/packageCommunity/pages/share-list/index' });
      return;
    }
  },
  openDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/packageCommunity/pages/disease-detail/index?id=${id}` });
  }
});

