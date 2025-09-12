const authUtil = require('../../../utils/auth.js');

Page({
  data: {
    companyOptions: ['顺丰速运', '京东物流', '中国邮政', '圆通速递', '中通快递', '申通快递', '其他'],
    companyIndex: -1,
    submitting: false,
    form: {
      detectionNumber: '',
      phone: '',
      trackingNo: '',
      date: '',
      images: []
    }
  },
  onLoad(options){
    // 预填：从上游流程传入的检测号
    if (options && options.detectId) {
      this.setData({ 'form.detectionNumber': options.detectId });
    }
    // 读取最近一次提交缓存
    try {
      const last = wx.getStorageSync('lastShippingInfo');
      if (last && typeof last === 'object') {
        this.setData({ form: Object.assign({}, this.data.form, last.form || {}), companyIndex: last.companyIndex ?? -1 });
      }
    } catch (e) {}
  },
  onInput(e){
    const key = e.currentTarget.dataset.key;
    const val = e.detail.value;
    if (!key) return;
    this.setData({ [`form.${key}`]: val });
  },
  onDateChange(e){
    this.setData({ 'form.date': e.detail.value });
  },
  openCompanyPicker(){
    const list = this.data.companyOptions;
    wx.showActionSheet({
      itemList: list,
      success: (res) => {
        if (typeof res.tapIndex === 'number') {
          this.setData({ companyIndex: res.tapIndex });
        }
      }
    });
  },
  chooseImage(){
    const that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album','camera'],
      success(res){
        const imgs = (that.data.form.images || []).concat(res.tempFilePaths || []);
        that.setData({ 'form.images': imgs.slice(0, 6) });
      }
    });
  },
  previewImage(e){
    const url = e.currentTarget.dataset.url;
    const urls = this.data.form.images || [];
    if (!url) return;
    wx.previewImage({ current: url, urls });
  },
  validate(){
    const { detectionNumber, phone, trackingNo } = this.data.form;
    const { companyIndex, companyOptions } = this.data;
    // 检测号：QY- / ZF- 前缀或纯数字 6-12 位
    const reDetect = /^(?:((QY|ZF)-)[A-Za-z0-9]{4,10}|\d{6,12})$/;
    const rePhone = /^1[3-9]\d{9}$/;
    const reTrack = /^[A-Za-z0-9-]{6,}$/;
    if (!reDetect.test((detectionNumber || '').trim())) return { ok: false, msg: '检测号格式不正确' };
    if (!rePhone.test((phone || '').trim())) return { ok: false, msg: '手机号格式不正确' };
    if (companyIndex < 0 || !companyOptions[companyIndex]) return { ok: false, msg: '请选择快递公司' };
    if (!reTrack.test((trackingNo || '').trim())) return { ok: false, msg: '快递单号格式不正确' };
    return { ok: true };
  },
  submit(){
    if (this.data.submitting) return;
    if (authUtil.ensureLogin) {
      const self = this;
      return Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return;
        self._doSubmit();
      });
    }
    this._doSubmit();
  },

  _doSubmit(){
    if (this.data.submitting) return;
    const v = this.validate();
    if (!v.ok) {
      wx.showToast({ title: v.msg, icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    // Mock 提交：1.2s 延时
    new Promise((resolve)=> setTimeout(resolve, 1200))
      .then(()=>{
        try { wx.setStorageSync('lastShippingInfo', { form: this.data.form, companyIndex: this.data.companyIndex, savedAt: Date.now() }); } catch (e) {}
        wx.showToast({ title: '提交成功', icon: 'success' });
        setTimeout(()=> { wx.navigateBack({ fail: ()=> wx.switchTab({ url: '/pages/detection/index' }) }); }, 800);
      })
      .finally(()=> this.setData({ submitting: false }));
  }
});
