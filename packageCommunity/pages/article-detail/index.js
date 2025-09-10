const ARTICLE = {
  sbv: [
    { id: 'a1', title: 'SBV 概述与识别要点', brief: '', date: '2025-01-10', views: 126, body: '本文介绍囊状幼虫病（SBV）的基本特征、常见症状与早期识别方法。通过图示与对比，帮助快速判别，与 AFB/EFB 等病害区分。' },
    { id: 'a2', title: 'SBV 传播路径与防控建议', brief: '', date: '2025-01-08', views: 88, body: 'SBV 主要经密接与蜂具传播。建议保持蜂箱干燥卫生，定期消毒与检疫，必要时在专业指导下用药。' },
    { id: 'a3', title: 'SBV 常见误判与排查', brief: '', date: '2025-01-05', views: 61, body: '汇总生产中常见的误判情形与排查流程，包含样品采集与化验注意事项。' },
    { id: 'a4', title: '样品采集寄送注意事项', brief: '', date: '2025-01-02', views: 43, body: '规范采集与寄送可显著提升检测准确性。本文总结了容器、温度、时限等关键要点。' }
  ],
  afb: [
    { id: 'a5', title: 'AFB 快速排查指引', brief: '', date: '2025-01-11', views: 210, body: '拉丝试验与气味识别的操作要点，结合案例讲解，便于快速判定可疑样本。' },
    { id: 'a6', title: 'AFB 防控与隔离', brief: '', date: '2025-01-06', views: 132, body: '确诊后蜂群隔离、蜂具高温消毒，避免交叉感染与蜂场扩散。' }
  ],
  nosema: [
    { id: 'a7', title: '微孢子虫流行特点', brief: '', date: '2025-01-07', views: 77, body: '寄生虫危害对成蜂的影响、流行季节与监测策略。' }
  ]
};

Page({
  data: { article: {}, related: [], diseaseId: '' },
  onLoad(options){
    const d = options && options.d || 'sbv';
    const id = options && options.id || 'a1';
    const list = ARTICLE[d] || [];
    const art = list.find(x => x.id === id) || list[0] || {};
    const related = list.filter(x => x.id !== art.id).slice(0,2);
    this.setData({ article: art, related, diseaseId: d });
  },
  openArticle(e){ const id = e.currentTarget.dataset.id; wx.navigateTo({ url: `/packageCommunity/pages/article-detail/index?id=${id}&d=${this.data.diseaseId}` }); }
});

