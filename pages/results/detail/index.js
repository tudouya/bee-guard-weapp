const resultsSvc = require('../../../services/results.js');

Page({
  data: {
    item: {},
    recName: '',
    recBrief: '',
    recSource: '',
    recTargetType: '',
    recUrl: '',
    recPid: '',
    prevent: '',
    diseases: [],
    recs: []
  },
  onLoad(options) {
    // 从参数构建 item，真实项目可通过 id 请求详情
    const item = {
      id: Number(options.id || 0),
      detectionId: options.detectionId ? decodeURIComponent(options.detectionId) : '',
      status: options.status || 'processing',
      statusText: options.statusText ? decodeURIComponent(options.statusText) : '检测中',
      date: options.date ? decodeURIComponent(options.date) : '',
      type: options.type ? decodeURIComponent(options.type) : '',
      abnormalCount: Number(options.abnormalCount || 0)
    };
    this.setData({ 
      item,
      recName: options.recName ? decodeURIComponent(options.recName) : '',
      recBrief: options.recBrief ? decodeURIComponent(options.recBrief) : '',
      recSource: options.recSource ? decodeURIComponent(options.recSource) : '',
      recTargetType: options.recTargetType ? decodeURIComponent(options.recTargetType) : '',
      recUrl: options.recUrl ? decodeURIComponent(options.recUrl) : '',
      recPid: options.recPid ? decodeURIComponent(options.recPid) : '',
      prevent: options.prevent ? decodeURIComponent(options.prevent) : ''
    });
    // 拉取完整检测结果（病种列表等）
    resultsSvc.getDetail(item.id).then(detail => {
      if (!detail) return;
      const updates = {};
      if (detail.diseases) updates.diseases = detail.diseases;
      if (detail.recommendations) updates.recs = detail.recommendations.slice(0, 2);
      this.setData(updates);
    });
  },
  onTapRec(e) {
    const idx = e.currentTarget.dataset.index;
    const r = this.data.recs && this.data.recs[idx];
    if (!r) return;
    if (r.targetType === 'external' && r.url) {
      wx.setClipboardData({ data: r.url, success: () => wx.showToast({ title: '链接已复制', icon: 'success' }) });
      return;
    }
    if (r.targetType === 'internal' && r.productId) {
      wx.showToast({ title: '产品详情即将上线', icon: 'none' });
      return;
    }
    wx.showToast({ title: r.productName ? '暂无更多信息' : '暂无推荐', icon: 'none' });
  },
  goGuide() {
    const detectId = this.data.item.detectionId || '';
    wx.navigateTo({ url: `/pages/detection/guide/index?detectId=${encodeURIComponent(detectId)}` });
  },
  goProgress() {
    const appId = this.data.item.detectionId || '';
    wx.navigateTo({ url: `/pages/detection/status/index?appId=${encodeURIComponent(appId)}&price=0` });
  }
});
