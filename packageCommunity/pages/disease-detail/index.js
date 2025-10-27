const knowledge = require('../../../services/knowledge');

Page({
  data: { active: 'disease', preview: [], articleCount: 0, loadingArticles: true, articleError: '' },
  async onLoad(options){
    const code = (options && options.id) || '';
    if (!code) {
      this.setData({ loadingArticles: false });
      wx.showToast({ title: '参数缺失', icon: 'none' });
      setTimeout(()=> wx.redirectTo({ url: '/packageCommunity/pages/disease-list/index?tab=disease' }), 600);
      return;
    }
    this.setData({ diseaseId: code, loadingArticles: true, articleError: '', preview: [] });
    try {
      const d = await knowledge.getDisease(code);
      this.setData({
        articleCount: Number(d.articleCount || 0)
      });
    } catch (e) {
      wx.showToast({ title: e && e.message ? e.message : '加载失败', icon: 'none' });
    }
    try {
      const { list } = await knowledge.listArticlesByDisease(code, { page: 1, per_page: 25 });
      const preview = (Array.isArray(list) ? list : []).map(a => ({
        id: a.id,
        title: a.title || '未命名文章',
        brief: a.brief || '',
        date: a.date || ''
      }));
      this.setData({ preview, loadingArticles: false, articleError: '' });
    } catch (e) {
      const message = (e && e.message) ? e.message : '加载文章失败';
      this.setData({ loadingArticles: false, articleError: message });
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
  // 顶部返回按钮已移除；保留系统返回导航
});
