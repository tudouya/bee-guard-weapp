const knowledge = require('../../../services/knowledge');

Page({
  data: { active: 'disease', detail: { title: '', intro: '', symptom: '', transmit: '', prevention: '' }, preview: [], articleCount: 0 },
  async onLoad(options){
    const code = (options && options.id) || '';
    if (!code) {
      wx.showToast({ title: '参数缺失', icon: 'none' });
      setTimeout(()=> wx.redirectTo({ url: '/packageCommunity/pages/disease-list/index?tab=disease' }), 600);
      return;
    }
    this.setData({ diseaseId: code });
    try {
      const d = await knowledge.getDisease(code);
      this.setData({
        detail: {
          title: d.name || '未命名病种',
          intro: d.description || '暂无介绍',
          symptom: d.symptom || '暂无典型症状',
          transmit: d.transmit || '暂无描述',
          prevention: d.prevention || '暂无防控要点'
        },
        articleCount: Number(d.articleCount || 0)
      });
    } catch (e) {
      wx.showToast({ title: e && e.message ? e.message : '加载失败', icon: 'none' });
    }
    try {
      const { list } = await knowledge.listArticlesByDisease(code, { page: 1, per_page: 3 });
      const preview = (Array.isArray(list) ? list : []).map(a => ({
        id: a.id,
        title: a.title || '未命名文章',
        brief: a.brief || '',
        date: a.date || '',
        views: Number(a.views || 0)
      }));
      this.setData({ preview });
    } catch (e) {
      // 预览失败不阻断
    }
  },
  switchTab(e){
    const key = e.currentTarget.dataset.key;
    if (key === 'qa') { wx.redirectTo({ url: '/packageCommunity/pages/disease-list/index?tab=qa' }); return; }
    if (key === 'share') { wx.redirectTo({ url: '/packageCommunity/pages/disease-list/index?tab=share' }); return; }
  },
  goAsk(){ wx.navigateTo({ url: '/packageCommunity/pages/qa-post/index' }); },
  goShare(){ wx.navigateTo({ url: '/packageCommunity/pages/share-post/index' }); },
  openArticle(e){ const aid = e.currentTarget.dataset.id; if (!aid) return; wx.navigateTo({ url: `/packageCommunity/pages/article-detail/index?id=${aid}&d=${this.data.diseaseId}` }); },
  // 返回社区统一页（蜂病百科 Tab）
  goBackToCommunity(){
    wx.redirectTo({ url: '/packageCommunity/pages/disease-list/index?tab=disease' });
  }
});
