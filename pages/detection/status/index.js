const api = require('../../../utils/api.js');

Page({
  data: {
    // 兼容旧参数
    appId: '',
    // 新对接字段
    orderId: '',
    price: '',
    submitTime: '',
    statusText: '',
    detectionPrefix: '',
    detectionCode: '',
    steps: [
      { key: 'proof', status: 'done' },
      { key: 'review', status: 'doing' },
      { key: 'generate', status: 'todo' },
      { key: 'notify', status: 'todo' }
    ],
    _pollTimer: null,
    _pollCount: 0
  },
  onLoad(options) {
    const orderId = options.orderId || '';
    const appId = options.appId || '';
    const now = new Date();
    const submitTime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    this.setData({ orderId, appId, submitTime });
    if (orderId) {
      this.fetchOrder();
      this.startPolling();
    } else {
      // 旧兼容：price 由来源页传入
      const price = options.price || '';
      this.setData({ price });
    }
  },
  onUnload() { this.clearPolling(); },
  onHide() { this.clearPolling(); },
  async fetchOrder() {
    try {
      const oid = this.data.orderId;
      if (!oid) return;
      const data = await api.get(`/api/orders/${encodeURIComponent(oid)}`);
      const { amount, status, detection_prefix, detection_code } = data || {};
      const price = amount || this.data.price || '';
      const steps = this.computeSteps(status);
      const statusText = this.mapStatusText(status);
      this.setData({ price, steps, statusText, detectionPrefix: detection_prefix || '', detectionCode: detection_code || '' });
      // 若已通过，停止轮询
      if (status === 'paid' || status === 'failed' || status === 'refunded') {
        this.clearPolling();
      }
    } catch (e) {
      // 非致命，保留轮询机会
    }
  },
  computeSteps(status) {
    // default: 待审核
    const steps = [
      { key: 'proof', status: 'done' },
      { key: 'review', status: 'doing' },
      { key: 'generate', status: 'todo' },
      { key: 'notify', status: 'todo' }
    ];
    if (status === 'paid') {
      steps[1].status = 'done';
      steps[2].status = 'done';
      steps[3].status = 'done';
    } else if (status === 'failed' || status === 'refunded') {
      steps[1].status = 'done';
      steps[2].status = 'todo';
      steps[3].status = 'todo';
    }
    return steps;
  },
  mapStatusText(status) {
    if (status === 'paid') return '审核通过';
    if (status === 'failed') return '审核未通过';
    if (status === 'refunded') return '已退款';
    return '待审核';
  },
  startPolling() {
    this.clearPolling();
    const timer = setInterval(() => {
      const cnt = this.data._pollCount + 1;
      this.setData({ _pollCount: cnt });
      this.fetchOrder();
      if (cnt >= 12) { // ~12 次，约1-2分钟（视工具前台时间片）
        this.clearPolling();
      }
    }, 8000);
    this.setData({ _pollTimer: timer });
  },
  clearPolling() {
    const t = this.data._pollTimer;
    if (t) {
      clearInterval(t);
      this.setData({ _pollTimer: null });
    }
  },
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },
  contact() {
    wx.showActionSheet({
      itemList: ['拨打客服 400-xxx-xxxx', '复制客服微信 ID'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({ phoneNumber: '4000000000' });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({ data: 'bee-guard-kefu' });
        }
      }
    });
  }
});
