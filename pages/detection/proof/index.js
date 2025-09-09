Page({
  data: {
    pkg: { id: '', name: '', price: 0 },
    methodOptions: ['微信支付', '支付宝', '其他'],
    form: {
      method: '微信支付',
      orderNo: '',
      amount: ''
    },
    images: [],
    maxImages: 3,
    canSubmit: false
  },
  onLoad(options) {
    const pkg = {
      id: options.id ? decodeURIComponent(options.id) : '',
      name: options.name ? decodeURIComponent(options.name) : '基础检测套餐',
      price: Number(options.price || 199)
    };
    const orderNo = options.orderId ? decodeURIComponent(options.orderId) : '';
    this.setData({ pkg, 'form.amount': String(pkg.price || ''), 'form.orderNo': orderNo }, () => this.updateSubmitState());
  },
  selectMethod(e) {
    const val = e.currentTarget.dataset.value;
    this.setData({ 'form.method': val }, () => this.updateSubmitState());
  },
  onOrderNoInput(e) {
    this.setData({ 'form.orderNo': e.detail.value.trim() }, () => this.updateSubmitState());
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
  addImages() {
    const remain = this.data.maxImages - this.data.images.length;
    if (remain <= 0) return;
    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const list = (this.data.images || []).concat(res.tempFilePaths || []);
        this.setData({ images: list.slice(0, this.data.maxImages) }, () => this.updateSubmitState());
      }
    });
  },
  removeImage(e) {
    const idx = e.currentTarget.dataset.index;
    const list = (this.data.images || []).slice();
    list.splice(idx, 1);
    this.setData({ images: list }, () => this.updateSubmitState());
  },
  previewImage(e) {
    const idx = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.images[idx],
      urls: this.data.images
    });
  },
  updateSubmitState() {
    const { method, orderNo, amount } = this.data.form;
    const ok = !!method && orderNo && orderNo.length >= 6 && Number(amount) > 0 && (this.data.images || []).length > 0;
    this.setData({ canSubmit: ok });
  },
  saveDraft() {
    const key = `proofDraft_${this.data.pkg.id}`;
    const draft = { form: this.data.form, images: this.data.images };
    try {
      wx.setStorageSync(key, draft);
      wx.showToast({ title: '草稿已保存', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },
  submitProof() {
    const { method, orderNo, amount } = this.data.form;
    if (!method) {
      wx.showToast({ title: '请选择支付方式', icon: 'none' });
      return;
    }
    if (!orderNo || orderNo.length < 6) {
      wx.showToast({ title: '请输入正确的订单号', icon: 'none' });
      return;
    }
    if (!amount || Number(amount) <= 0) {
      wx.showToast({ title: '请输入正确的金额', icon: 'none' });
      return;
    }
    if (!this.data.images || this.data.images.length === 0) {
      wx.showToast({ title: '请上传支付截图', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '提交中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '已提交审核', icon: 'success', duration: 700 });
      const appId = `ZF${Date.now()}`;
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/detection/status/index?appId=${appId}&price=${this.data.form.amount}`
        });
      }, 700);
    }, 800);
  }
});
