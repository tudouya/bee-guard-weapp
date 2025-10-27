const knowledge = require('../../../services/knowledge');

function ensureDeviceId(){
  try {
    const existed = wx.getStorageSync('deviceId');
    if (existed) return existed;
    const id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    wx.setStorageSync('deviceId', id);
    return id;
  } catch (e) { return ''; }
}

function injectImageStyle(html){
  if (!html || typeof html !== 'string') return html || '';
  // 为 img 标签追加行内样式，保证自适应
  return html.replace(/<img(\s+[^>]*?)?>/gi, (m) => {
    if (/style=/.test(m)) return m.replace(/style=(['"])\s*([^'"]*)\1/i, (s, q, v) => `style=${q}${v};max-width:100%;height:auto${q}`);
    return m.replace(/<img/i, '<img style="max-width:100%;height:auto"');
  });
}

Page({
  data: { article: {}, related: [], diseaseId: '', nodes: '' },
  async onLoad(options){
    const id = options && options.id;
    if (!id) {
      wx.showToast({ title: '参数缺失', icon: 'none' });
      setTimeout(()=> wx.navigateBack(), 600);
      return;
    }
    try {
      const data = await knowledge.getArticle(id);
      let html = data.bodyHtml || '';
      if (!html) html = '<p>本文暂无内容</p>';
      const nodes = injectImageStyle(html);
      this.setData({
        article: { id: data.id, title: data.title || '无标题', date: data.date || '' },
        related: (Array.isArray(data.related) ? data.related : []).map(r => ({ id: r.id, title: r.title || '无标题', date: r.date || '' })),
        diseaseId: data.diseaseCode || '',
        nodes
      });
    } catch (e) {
      wx.showToast({ title: e && e.message ? e.message : '加载失败', icon: 'none' });
    }
  },
  onShow(){
    // 曝光上报（去重计数，匿名允许）
    const id = this.data && this.data.article && this.data.article.id;
    if (!id) return;
    knowledge.reportArticleExposure(id, { deviceId: ensureDeviceId() }).catch(()=>{});
  },
  openArticle(e){ const id = e.currentTarget.dataset.id; if (!id) return; wx.navigateTo({ url: `/packageCommunity/pages/article-detail/index?id=${id}&d=${this.data.diseaseId}` }); }
});
