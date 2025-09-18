const authUtil = require('../../../utils/auth.js');
const shippingSvc = require('../../../services/shipping.js');

Page({
  data: {
    companyOptions: ['顺丰', '圆通', '京东快递', '中通', '申通', '中国邮政', '其他'],
    companyIndex: -1,
    submitting: false,
    form: {
      detectionNumber: '',
      phone: '',
      trackingNo: '',
      date: ''
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
  onCompanyChange(e){
    const idx = Number(e.detail.value);
    if (!Number.isNaN(idx)) {
      this.setData({ companyIndex: idx });
    }
  },
  validate(){
    const { detectionNumber, phone, trackingNo } = this.data.form;
    const { companyIndex, companyOptions } = this.data;
    const rePhone = /^1[3-9]\d{9}$/;
    const reTrack = /^[A-Za-z0-9-]{6,}$/;
    if (!((detectionNumber || '').trim())) return { ok: false, msg: '请填写检测号' };
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

  async _doSubmit(){
    if (this.data.submitting) return;
    const v = this.validate();
    if (!v.ok) {
      wx.showToast({ title: v.msg, icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    try {
      const { form, companyOptions, companyIndex } = this.data;
      const payload = {
        detection_number: (form.detectionNumber || '').trim(),
        courier_company: companyOptions[companyIndex],
        tracking_no: (form.trackingNo || '').trim(),
        phone: (form.phone || '').trim()
      };
      if (form.date) payload.shipped_at = form.date;
      await shippingSvc.createShippingNotification(payload);
      try { wx.setStorageSync('lastShippingInfo', { form: this.data.form, companyIndex: this.data.companyIndex, savedAt: Date.now() }); } catch (e) {}
      wx.showToast({ title: '提交成功', icon: 'success' });
      setTimeout(()=> { wx.navigateBack({ fail: ()=> wx.switchTab({ url: '/pages/detection/index' }) }); }, 600);
    } catch (err) {
      let msg = '提交失败，请稍后重试';
      const code = err && err.payload && err.payload.code;
      const status = err && err.status;
      if (code === 'detection_not_found' || status === 404) msg = '检测号不存在，请确认';
      else if (code === 'forbidden' || status === 403) msg = '该检测号不属于当前用户';
      else if (code === 'shipping_duplicate' || status === 409) msg = '该检测号与单号已提交，请勿重复';
      else if (status === 422 && err.errors) {
        const firstKey = Object.keys(err.errors)[0];
        const firstMsg = firstKey ? (err.errors[firstKey] && err.errors[firstKey][0]) : '';
        msg = firstMsg || '参数校验失败';
      } else if (err && err.message) {
        msg = err.message;
      }
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
});
