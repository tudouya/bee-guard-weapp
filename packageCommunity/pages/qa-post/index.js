const authUtil = require('../../../utils/auth.js');

Page({
  data: {
    form: { title: '', desc: '' },
    images: []
  },
  onTitle(e) { this.setData({ 'form.title': e.detail.value }); },
  onDesc(e) { this.setData({ 'form.desc': e.detail.value }); },
  choose() {
    wx.chooseImage({ count: 3, sizeType: ['compressed'], success: (res) => {
      const list = (this.data.images || []).concat(res.tempFilePaths || []);
      this.setData({ images: list.slice(0, 3) });
    }});
  },
  remove(e) { const i = e.currentTarget.dataset.index; const list = this.data.images.slice(); list.splice(i,1); this.setData({ images: list }); },
  preview(e) { const i = e.currentTarget.dataset.index; wx.previewImage({ current: this.data.images[i], urls: this.data.images }); },
  onShow(){ if (authUtil && authUtil.ensureLogin) { authUtil.ensureLogin(); } },
  submit() {
    if (authUtil && authUtil.ensureLogin) {
      const res = authUtil.ensureLogin();
      if (res && typeof res.then === 'function') {
        return res.then(r => { if (!r || !r.ok) return; this._doSubmit(); });
      }
      if (!res || !res.ok) return;
    }
    this._doSubmit();
  },
  _doSubmit() {
    if (!this.data.form.title) { wx.showToast({ title: '请输入标题', icon: 'none' }); return; }
    wx.showToast({ title: '已提交，等待审核', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 600);
  }
});
