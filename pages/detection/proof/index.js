const authUtil = require('../../../utils/auth.js');
const api = require('../../../utils/api.js');

Page({
  data: {
    pkg: { id: '', name: '', price: 0 },
    methodOptions: ['微信支付', '支付宝', '其他'],
    form: {
      method: '微信支付',
      tradeNo: '',
      amount: ''
    },
    images: [],
    imageIds: [],
    maxImages: 3,
    canSubmit: false,
    orderId: '',
    submitting: false
  },
  onLoad(options) {
    const pkg = {
      id: options.id ? decodeURIComponent(options.id) : '',
      name: options.name ? decodeURIComponent(options.name) : '基础检测套餐',
      price: Number(options.price || 199)
    };
    const orderId = options.orderId ? decodeURIComponent(options.orderId) : '';
    // 交易流水号(tradeNo)由用户填写，不预填后端 orderId
    this.setData({ pkg, 'form.amount': String(pkg.price || ''), 'form.tradeNo': '', orderId }, () => this.updateSubmitState());
  },
  selectMethod(e) {
    const val = e.currentTarget.dataset.value;
    this.setData({ 'form.method': val }, () => this.updateSubmitState());
  },
  onTradeNoInput(e) {
    this.setData({ 'form.tradeNo': e.detail.value.trim() }, () => this.updateSubmitState());
  },
  onAmountInput(e) {
    // 允许两位小数
    let v = e.detail.value.replace(/[^\d.]/g, '');
    v = v.replace(/\.(\d\d).*$/, '.$1');
    this.setData({ 'form.amount': v }, () => this.updateSubmitState());
  },
  onRemarkInput(e) {
    this.setData({ 'form.remark': e.detail.value });
  },
  async addImages() {
    const remain = this.data.maxImages - this.data.images.length;
    if (remain <= 0) return;
    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const locals = res.tempFilePaths || [];
        // 先追加本地预览
        const list = (this.data.images || []).concat(locals);
        this.setData({ images: list.slice(0, this.data.maxImages) }, () => this.updateSubmitState());
        // 逐张上传到后端，收集返回的 id
        this._uploadSelected(locals);
      }
    });
  },
  async _uploadSelected(localPaths) {
    if (!localPaths || !localPaths.length) return;
    // 登录校验
    if (authUtil.ensureLogin) {
      const r = await Promise.resolve(authUtil.ensureLogin());
      if (!r || !r.ok) return;
    }
    for (let i = 0; i < localPaths.length; i++) {
      const filePath = localPaths[i];
      try {
        const data = await api.upload(filePath, '/api/uploads');
        const uploadId = data && (data.id || data.upload_id);
        if (uploadId !== undefined && uploadId !== null) {
          const ids = (this.data.imageIds || []).concat([uploadId]);
          this.setData({ imageIds: ids });
        }
      } catch (e) {
        const msg = (e && e.message) ? e.message : '上传失败，请重试';
        wx.showToast({ title: msg, icon: 'none' });
      }
    }
    this.updateSubmitState();
  },
  removeImage(e) {
    const idx = e.currentTarget.dataset.index;
    const list = (this.data.images || []).slice();
    list.splice(idx, 1);
    // 同步移除对应的 imageId（按顺序近似匹配）
    const ids = (this.data.imageIds || []).slice();
    if (ids.length > idx) ids.splice(idx, 1);
    this.setData({ images: list, imageIds: ids }, () => this.updateSubmitState());
  },
  previewImage(e) {
    const idx = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.images[idx],
      urls: this.data.images
    });
  },
  updateSubmitState() {
    const { method, tradeNo, amount } = this.data.form;
    const hasAnyImage = (this.data.imageIds && this.data.imageIds.length > 0) || (this.data.images && this.data.images.length > 0);
    const ok = !!method && tradeNo && tradeNo.length >= 6 && Number(amount) > 0 && hasAnyImage;
    this.setData({ canSubmit: ok });
  },
  submitProof() {
    if (authUtil.ensureLogin) {
      const self = this;
      return Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return;
        self._doSubmitProof();
      });
    }
    this._doSubmitProof();
  },

  async _doSubmitProof() {
    const { method, tradeNo, amount } = this.data.form;
    if (!method) {
      wx.showModal({ title: '提示', content: '请选择支付方式', showCancel: false });
      return;
    }
    if (!tradeNo || tradeNo.length < 6) {
      wx.showModal({ title: '提示', content: '请输入 ≥6 位交易流水号', showCancel: false });
      return;
    }
    if (!amount || Number(amount) <= 0) {
      wx.showModal({ title: '提示', content: '请输入正确的金额', showCancel: false });
      return;
    }
    // 若尚未完成上传，但已有本地图片，则先尝试上传再提交
    if (!this.data.imageIds || this.data.imageIds.length === 0) {
      if (this.data.images && this.data.images.length > 0) {
        wx.showLoading({ title: '上传图片中...' });
        await this._uploadSelected(this.data.images);
        wx.hideLoading();
      }
      if (!this.data.imageIds || this.data.imageIds.length === 0) {
        wx.showModal({ title: '提示', content: '请上传支付截图', showCancel: false });
        return;
      }
    }
    const orderId = this.data.orderId;
    if (!orderId) {
      wx.showModal({ title: '提示', content: '订单不存在，请返回重试', showCancel: false });
      return;
    }
    if (this.data.submitting) return;
    this.setData({ submitting: true });
    wx.showLoading({ title: '提交中...' });
    try {
      const payload = {
        method: method,
        trade_no: tradeNo,
        amount: Number(amount),
        images: this.data.imageIds,
        remark: this.data.form.remark || ''
      };
      await api.post(`/api/orders/${encodeURIComponent(orderId)}/payment-proof`, payload);
      wx.hideLoading();
      wx.showToast({ title: '已提交审核', icon: 'success', duration: 700 });
      setTimeout(() => {
        wx.navigateTo({ url: `/pages/detection/status/index?orderId=${encodeURIComponent(orderId)}` });
      }, 600);
    } catch (e) {
      wx.hideLoading();
      if (e && e.status === 409) {
        const msg = (e && e.message) ? e.message : '存在待审核凭证';
        const show = msg === 'exists_pending_proof' ? '已提交过待审核凭证' : (msg === 'order_not_pending' ? '订单状态异常' : msg);
        wx.showToast({ title: show, icon: 'none' });
        return;
      }
      if (e && e.status === 401) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        try { wx.navigateTo({ url: '/pages/auth/login/index' }); } catch (err) {}
        return;
      }
      // 422 或其他错误
      const errText = e && e.errors ? Object.values(e.errors).map(arr => arr && arr[0]).filter(Boolean).join('\n') : '';
      const msg = errText || (e && e.message) || '提交失败，请稍后重试';
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
});
