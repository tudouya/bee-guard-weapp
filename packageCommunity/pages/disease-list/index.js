// 社区入口已统一至本页（disease/qa/share 三标签页）
// 说明：
// - 原 qa-list 与 share-list 页面在 onLoad 即重定向到本页，并携带 ?tab=qa|share 参数
// - 本页根据 active 渲染三块内容，保持页内切换以提升流畅度
// - 数据为 mock，占位结构，后续对接后端时按各 Tab 懒加载并缓存
Page({
  data: {
    active: 'disease',
    // 疾病百科列表
    diseaseList: [
      { id: 'sbv', name: '囊状幼虫病 SBV', brief: '病毒性疾病，主要感染幼虫', symptom: '幼虫死亡呈囊状', count: 5 },
      { id: 'afb', name: '美洲幼虫腐臭病 AFB', brief: '细菌性疾病，传染性强', symptom: '幼虫腐烂有臭味', count: 8 },
      { id: 'nosema', name: '微孢子虫', brief: '寄生虫病，影响成蜂', symptom: '蜜蜂腹部肿胀', count: 3 }
    ],
    // 问答列表（示例）
    qaList: [
      { id: 1, title: '春季群势下降如何处理？', author: '蜂友A', date: '2025-01-06' },
      { id: 2, title: '疑似AFB，如何快速排查？', author: '蜂友B', date: '2025-01-05' }
    ],
    // 分享列表（示例）
    shareList: [
      { id: 1, title: '越冬期蜂群管理经验', author: '蜂友C', date: '2025-01-03', likes: 126 },
      { id: 2, title: '蜂具日常消毒流程', author: '蜂友D', date: '2025-01-02', likes: 312 }
    ],
    // 每个 Tab 的滚动位置
    scrollPositions: { disease: 0, qa: 0, share: 0 }
  },
  onLoad(options){
    const tab = options && options.tab;
    if (tab && ['disease','qa','share'].includes(tab)) {
      this.setData({ active: tab });
    }
    // 读取持久化的滚动位置
    try {
      const saved = wx.getStorageSync('communityScroll') || {};
      if (saved && typeof saved === 'object') {
        this.setData({ scrollPositions: Object.assign({ disease: 0, qa: 0, share: 0 }, saved) });
      }
    } catch (e) {}
    // 初始恢复当前标签滚动
    const sp = this.data.scrollPositions || {}; const key = this.data.active || 'disease';
    const y = Number(sp[key] || 0);
    if (y > 0) { setTimeout(()=> wx.pageScrollTo({ scrollTop: y, duration: 0 }), 0); }
  },
  switchTab(e){
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.active) return;
    this.setData({ active: key }, () => {
      const sp = this.data.scrollPositions || {}; const y = Number(sp[key] || 0);
      if (y >= 0) { wx.pageScrollTo({ scrollTop: y, duration: 0 }); }
    });
  },
  // 疾病百科详情
  openDiseaseDetail(e){
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/packageCommunity/pages/disease-detail/index?id=${id}` });
  },
  // 问答详情
  openQaDetail(e){
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/packageCommunity/pages/qa-detail/index?id=${id}` });
  },
  // 分享详情
  openShareDetail(e){
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/packageCommunity/pages/share-detail/index?id=${id}` });
  },
  // 发帖/分享
  goQaPost(){ wx.navigateTo({ url: '/packageCommunity/pages/qa-post/index' }); },
  goSharePost(){ wx.navigateTo({ url: '/packageCommunity/pages/share-post/index' }); }
  ,
  onPageScroll(e){
    const y = e && typeof e.scrollTop === 'number' ? e.scrollTop : 0;
    const key = this.data.active || 'disease';
    const sp = Object.assign({}, this.data.scrollPositions, { [key]: y });
    this.setData({ scrollPositions: sp });
  },
  onHide(){
    try { wx.setStorageSync('communityScroll', this.data.scrollPositions || {}); } catch (e) {}
  },
  onUnload(){
    try { wx.setStorageSync('communityScroll', this.data.scrollPositions || {}); } catch (e) {}
  }
});
