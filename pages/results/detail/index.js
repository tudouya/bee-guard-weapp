const resultsSvc = require('../../../services/results.js');

Page({
  data: {
    detail: null,
    results: [],
    recs: [],
    tables: [],
    meta: {},
    positiveCount: 0,
    positives: []
  },
  onLoad(options) {
    const id = Number(options.id || 0);
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack({ delta: 1 }), 600);
      return;
    }
    this.loadDetail(id);
  },
  async loadDetail(id) {
    try {
      const detail = await resultsSvc.getDetail(id);
      const recs = Array.isArray(detail.recommendations) ? detail.recommendations.slice(0, 2) : [];
      const { tables, meta, positiveCount, positives } = this.buildTables(detail);
      this.setData({ detail, results: detail.results || [], recs, tables, meta, positiveCount, positives });
    } catch (e) {
      const code = e && e.statusCode;
      if (code === 404) {
        wx.showToast({ title: '记录不存在', icon: 'none' });
      } else if (code === 401) {
        wx.showToast({ title: '请先登录', icon: 'none' });
      } else {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
      setTimeout(() => wx.navigateBack({ delta: 1 }), 800);
    }
  },
  buildTables(detail) {
    const results = Array.isArray(detail.results) ? detail.results : [];
    const byCode = {};
    results.forEach(r => { if (r && r.code) byCode[r.code] = r; });
    const ORDER = {
      rna: ['IAPV','BQCV','SBV','ABPV','CBPV','DWV'],
      dna_bacteria_fungi: ['AFB','EFB','NCER','NAPI','CB']
    };
    const GROUP_TITLE = {
      rna: 'RNA病毒',
      dna_bacteria_fungi: 'DNA病毒、细菌、真菌'
    };
    function cellFor(code) {
      const r = byCode[code] || { code, name: code, level: null, levelText: '空', positive: false };
      // normalize levelText
      let lt = r.levelText;
      if (!lt) {
        if (r.level === 'weak') lt = '弱';
        else if (r.level === 'medium') lt = '中';
        else if (r.level === 'strong') lt = '强';
        else lt = '空';
      }
      const positive = r.positive === true || (r.level === 'weak' || r.level === 'medium' || r.level === 'strong');
      return { code: r.code || code, name: r.name || code, level: r.level || null, levelText: lt, positive };
    }
    const groups = [
      { key: 'rna', title: GROUP_TITLE.rna, codes: ORDER.rna },
      { key: 'dna_bacteria_fungi', title: GROUP_TITLE.dna_bacteria_fungi, codes: ORDER.dna_bacteria_fungi }
    ];
    const tables = groups.map(g => ({
      key: g.key,
      title: g.title,
      headers: g.codes.slice(),
      cells: g.codes.map(code => cellFor(code))
    }));
    const meta = {
      sampleNo: detail.sampleNo || '',
      contactName: detail.contactName || '',
      sampleTime: detail.sampleTime || '',
      address: detail.address || ''
    };
    return {
      tables,
      meta,
      positiveCount: detail.positiveCount || 0,
      positives: Array.isArray(detail.positives) ? detail.positives : []
    };
  },
  onTapRec(e) {
    const idx = e.currentTarget.dataset.index;
    const r = this.data.recs && this.data.recs[idx];
    if (!r) return;
    if (r.targetType === 'external' && r.url) {
      wx.setClipboardData({ data: r.url, success: () => wx.showToast({ title: '链接已复制', icon: 'success' }) });
      return;
    }
    if ((r.targetType === 'internal' && r.productId) || r.productId) {
      wx.navigateTo({ url: `/pages/product/detail/index?id=${encodeURIComponent(r.productId)}` });
      return;
    }
    wx.showToast({ title: r.productName ? '暂无更多信息' : '暂无推荐', icon: 'none' });
  },
  goGuide() {
    const detectId = (this.data.detail && this.data.detail.detectionId) || '';
    wx.navigateTo({ url: `/pages/detection/guide/index?detectId=${encodeURIComponent(detectId)}` });
  },
  goProgress() {
    const appId = (this.data.detail && this.data.detail.detectionId) || '';
    wx.navigateTo({ url: `/pages/detection/status/index?appId=${encodeURIComponent(appId)}&price=0` });
  }
});
