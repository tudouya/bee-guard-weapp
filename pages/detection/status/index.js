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
    ]
  },
  onLoad(options) {
    const orderId = options.orderId || '';
    const appId = options.appId || '';
    const now = new Date();
    const submitTime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    this.setData({ orderId, appId, submitTime });
    if (orderId) {
      this.fetchOrder();
    } else {
      // 旧兼容：price 由来源页传入
      const price = options.price || '';
      this.setData({ price });
    }
  },
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
    } catch (e) {
      // 非致命，可提醒用户稍后手动刷新
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
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },
  contact() {
    wx.showActionSheet({
      itemList: ['拨打客服（工作日上午9:00-下午5:00）：13021226630', '客服微信号：13021226630'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({ phoneNumber: '13021226630' });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({ data: '13021226630' });
        }
      }
    });
  }
});
