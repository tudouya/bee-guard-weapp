const MAP = {
  sbv: {
    title: '囊状幼虫病 SBV',
    intro: '病毒性疾病，主要感染幼虫。',
    symptom: '幼虫呈囊状、透明胶样。',
    transmit: '密接、蜂具、盗蜂等途径。',
    prevention: '保持干燥卫生，隔离病群，按指导用药。'
  },
  afb: {
    title: '美洲幼虫腐臭病 AFB',
    intro: '细菌性疾病，传染性强。',
    symptom: '幼虫腐烂，有臭味，拉丝试验阳性。',
    transmit: '蜜蜂接触、蜂具、盗蜂传播。',
    prevention: '隔离病群，消毒蜂具，遵医嘱用药。'
  },
  nosema: {
    title: '微孢子虫',
    intro: '寄生虫危害，影响成蜂。',
    symptom: '腹部肿胀，群势下降。',
    transmit: '寄生、盗蜂、调群传播。',
    prevention: '生物与化学综合防治，定期监测。'
  }
};

const ARTICLE = {
  sbv: [
    { id: 'a1', title: 'SBV 概述与识别要点', brief: '囊状幼虫病的基本特征与早期识别方法……', date: '2025-01-10', views: 126 },
    { id: 'a2', title: 'SBV 传播路径与防控建议', brief: '密接传播与蜂具消毒的关键步骤……', date: '2025-01-08', views: 88 },
    { id: 'a3', title: 'SBV 常见误判与排查', brief: '与 EFB/AFB 的差异点和排查流程……', date: '2025-01-05', views: 61 },
    { id: 'a4', title: '样品采集寄送注意事项', brief: '如何规范采集与寄送，提升检测准确率……', date: '2025-01-02', views: 43 }
  ],
  afb: [
    { id: 'a5', title: 'AFB 快速排查指引', brief: '拉丝试验与气味识别的操作要点……', date: '2025-01-11', views: 210 },
    { id: 'a6', title: 'AFB 防控与隔离', brief: '确诊后蜂群隔离与蜂具消毒流程……', date: '2025-01-06', views: 132 }
  ],
  nosema: [
    { id: 'a7', title: '微孢子虫流行特点', brief: '寄生虫危害对成蜂的影响与监测……', date: '2025-01-07', views: 77 }
  ]
};

Page({
  data: { active: 'disease', detail: { title: '', intro: '', symptom: '', transmit: '', prevention: '' }, articles: [], preview: [] },
  onLoad(options){
    const id = options && options.id || 'sbv';
    const d = MAP[id] || MAP.sbv;
    const list = ARTICLE[id] || [];
    this.setData({ detail: d, articles: list, preview: list.slice(0,3), diseaseId: id });
  },
  switchTab(e){
    const key = e.currentTarget.dataset.key;
    if (key === 'qa') { wx.redirectTo({ url: '/packageCommunity/pages/qa-list/index' }); return; }
    if (key === 'share') { wx.redirectTo({ url: '/packageCommunity/pages/share-list/index' }); return; }
  },
  goAsk(){ wx.navigateTo({ url: '/packageCommunity/pages/qa-post/index' }); },
  goShare(){ wx.navigateTo({ url: '/packageCommunity/pages/share-post/index' }); },
  openArticle(e){ const aid = e.currentTarget.dataset.id; wx.navigateTo({ url: `/packageCommunity/pages/article-detail/index?id=${aid}&d=${this.data.diseaseId}` }); }
});
