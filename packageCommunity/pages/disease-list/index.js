// 社区入口已统一至本页（disease/qa/share 三标签页）
// 说明：
// - 原 qa-list 与 share-list 页面在 onLoad 即重定向到本页，并携带 ?tab=qa|share 参数
// - 本页根据 active 渲染三块内容，保持页内切换以提升流畅度
// - 数据为 mock，占位结构，后续对接后端时按各 Tab 懒加载并缓存
const knowledge = require('../../../services/knowledge');

Page({
  data: {
    active: 'disease',
    // 疾病百科列表（对接接口）
    diseaseList: [],
    dPage: 1,
    dPerPage: 10,
    dTotalPages: 1,
    dLoading: false,
    dNoMore: false,
    dLoaded: false,
    // 问答列表（示例，保留本地占位）
    qaList: [
      { id: 1, title: '春季群势下降如何处理？', author: '蜂友A', date: '2025-01-06' },
      { id: 2, title: '疑似AFB，如何快速排查？', author: '蜂友B', date: '2025-01-05' }
    ],
    // 分享列表（示例，保留本地占位）
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
    // 首次拉取疾病列表
    if (this.data.active === 'disease') {
      this.fetchDiseases();
    }
  },
  switchTab(e){
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.active) return;
    this.setData({ active: key }, () => {
      const sp = this.data.scrollPositions || {}; const y = Number(sp[key] || 0);
      if (y >= 0) { wx.pageScrollTo({ scrollTop: y, duration: 0 }); }
      if (key === 'disease' && !this.data.dLoaded) {
        this.fetchDiseases();
      }
    });
  },
  async fetchDiseases(){
    if (this.data.dLoading || this.data.dNoMore) return;
    this.setData({ dLoading: true });
    try {
      const { list, meta } = await knowledge.listDiseases({ page: this.data.dPage, per_page: this.data.dPerPage });
      const cleaned = (list || [])
        .filter(it => it && it.code)
        .map(it => ({
          code: it.code,
          name: it.name || '未命名',
          brief: it.brief || '暂无简介',
          symptom: it.symptom || '—',
          articleCount: Number(it.articleCount || 0)
        }));
      const nextList = (this.data.diseaseList || []).concat(cleaned);
      const totalPages = meta && meta.total_pages ? Number(meta.total_pages) : this.data.dTotalPages;
      const curPage = meta && meta.page ? Number(meta.page) : this.data.dPage;
      const noMore = curPage >= totalPages;
      this.setData({
        diseaseList: nextList,
        dTotalPages: totalPages,
        dPage: curPage + 1,
        dNoMore: noMore,
        dLoaded: true
      });
    } catch (e) {
      wx.showToast({ title: e && e.message ? e.message : '加载失败', icon: 'none' });
    } finally {
      this.setData({ dLoading: false });
    }
  },
  // 疾病百科详情
  openDiseaseDetail(e){
    const code = e.currentTarget.dataset.id;
    if (!code) return;
    wx.navigateTo({ url: `/packageCommunity/pages/disease-detail/index?id=${code}` });
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
  },
  onReachBottom(){
    if (this.data.active === 'disease') {
      this.fetchDiseases();
    }
  }
});
