const resultsSvc = require('../../../services/results.js');

Page({
  data: {
    detail: null,
    results: [],
    recs: [],
    tables: [],
    meta: {},
    positiveCount: 0,
    positivePathogenCount: 0,
    positivePestCount: 0,
    activeGroup: ''
  },
  onLoad(options = {}) {
    const rawDetectionNumber = options.detectionNumber ? String(options.detectionNumber) : '';
    const detectionNumber = rawDetectionNumber.trim();
    const parsedId = options.id !== undefined ? Number(options.id) : NaN;
    const hasValidId = Number.isInteger(parsedId) && parsedId > 0;

    if (detectionNumber) {
      this.loadDetail({ id: hasValidId ? parsedId : 0, detectionNumber });
      return;
    }

    if (!hasValidId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack({ delta: 1 }), 600);
      return;
    }

    this.loadDetail({ id: parsedId });
  },
  async loadDetail(params) {
    try {
      const detail = await resultsSvc.getDetail(params);
      const recs = Array.isArray(detail.recommendations) ? detail.recommendations : [];
      const { tables, meta, positiveCount, positivePathogenCount, positivePestCount } = this.buildTables(detail);
      const activeGroup = tables.length ? tables[0].key : '';
      this.setData({
        detail,
        results: detail.results || [],
        recs,
        tables,
        meta,
        positiveCount,
        positivePathogenCount,
        positivePestCount,
        activeGroup
      });
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
    const grouped = { rna: {}, dna_bacteria_fungi: {}, pest: {} };
    results.forEach(r => {
      if (!r || !r.code) return;
      const cat = r.category || '';
      if (cat === 'rna' || cat === 'dna_bacteria_fungi' || cat === 'pest') {
        grouped[cat][r.code] = r;
      }
    });
    const PATHOGEN_ORDER = {
      rna: ['IAPV','BQCV','SBV','ABPV','CBPV','DWV'],
      dna_bacteria_fungi: ['AFB','EFB','NCER','NAPI','CB']
    };
    const PEST_ORDER = [
      'pest_large_mite',
      'pest_small_mite',
      'pest_wax_moth',
      'pest_small_hive_beetle',
      'pest_shield_mite',
      'pest_scoliidae_wasp',
      'pest_parasitic_bee_fly'
    ];
    const GROUP_TITLE = {
      rna: '病毒',
      dna_bacteria_fungi: '细菌、真菌',
      pests: '虫害'
    };
    let positivePathogenCount = 0;
    let positivePestCount = 0;
    function pathogenCellFor(code) {
      const r = grouped.rna[code] || grouped.dna_bacteria_fungi[code] || { code, name: code, level: null, levelText: '', positive: false };
      let lt = r.levelText;
      if (!lt) {
        if (r.level === 'weak') lt = '弱';
        else if (r.level === 'medium') lt = '中';
        else if (r.level === 'strong') lt = '强';
        else lt = '';
      }
      const positive = r.positive === true || (r.level === 'weak' || r.level === 'medium' || r.level === 'strong');
      const badge = positive ? (r.level || 'weak') : 'null';
      const badgeText = positive ? (lt || '阳性') : '阴性';
      const codeVal = r.code || code;
      const nameVal = r.name || codeVal;
      const displayName = codeVal ? `${nameVal} (${codeVal})` : nameVal;
      if (positive) {
        positivePathogenCount += 1;
      }
      return {
        code: r.code || code,
        name: nameVal,
        displayName,
        badge,
        badgeText
      };
    }
    function pestCellFor(code, entry) {
      const present = (entry && entry.positive === true) || (entry && entry.level === 'present');
      const level = present ? 'present' : 'absent';
      const lt = present ? '有' : '无';
      const cname = (entry && entry.name) || code;
      const displayName = cname;
      if (present) {
        positivePestCount += 1;
      }
      return {
        code: (entry && entry.code) || code,
        name: cname,
        displayName,
        badge: level,
        badgeText: lt
      };
    }
    const appendExtraCodes = (order, map) => {
      const extras = Object.keys(map).filter(c => order.indexOf(c) === -1);
      return order.concat(extras);
    };
    const rnaCodes = appendExtraCodes(PATHOGEN_ORDER.rna, grouped.rna);
    const dnaCodes = appendExtraCodes(PATHOGEN_ORDER.dna_bacteria_fungi, grouped.dna_bacteria_fungi);
    const pestCodes = appendExtraCodes(PEST_ORDER, grouped.pest);
    const tables = [
      {
        key: 'rna',
        title: GROUP_TITLE.rna,
        items: rnaCodes.map(code => pathogenCellFor(code)).filter(Boolean)
      },
      {
        key: 'dna_bacteria_fungi',
        title: GROUP_TITLE.dna_bacteria_fungi,
        items: dnaCodes.map(code => pathogenCellFor(code)).filter(Boolean)
      },
      {
        key: 'pests',
        title: GROUP_TITLE.pests,
        items: pestCodes.map(code => pestCellFor(code, grouped.pest[code])).filter(Boolean)
      }
    ];
    const meta = {
      sampleNo: detail.sampleNo || '',
      contactName: detail.contactName || '',
      sampleTime: detail.sampleTime || '',
      address: detail.address || ''
    };
    const positiveCount = positivePathogenCount + positivePestCount;
    return {
      tables,
      meta,
      positiveCount,
      positivePathogenCount,
      positivePestCount
    };
  },
  switchGroup(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeGroup) return;
    this.setData({ activeGroup: key });
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
  }
});
