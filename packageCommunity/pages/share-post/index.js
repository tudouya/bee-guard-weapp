const authUtil = require('../../../utils/auth.js');
const api = require('../../../utils/api.js');
const community = require('../../../services/community.js');

function mergeRefreshFlag(key){
  try {
    const current = wx.getStorageSync('communityNeedsRefresh') || {};
    current[key] = true;
    wx.setStorageSync('communityNeedsRefresh', current);
  } catch (e) {}
}

function createUid(){
  return 'img_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

Page({
  data: { form: { title: '', desc: '' }, images: [], uploadingCount: 0, submitting: false, maxImages: 3 },
  onShow(){ if (authUtil && authUtil.ensureLogin) { authUtil.ensureLogin(); } },
  onTitle(e) { this.setData({ 'form.title': e.detail.value }); },
  onDesc(e) { this.setData({ 'form.desc': e.detail.value }); },
  async choose() {
    const ensure = authUtil && authUtil.ensureLogin ? await authUtil.ensureLogin() : { ok: true };
    if (!ensure || !ensure.ok) return;
    const remain = this.data.maxImages - (this.data.images || []).length;
    if (remain <= 0) {
      wx.showToast({ title: '最多上传3张图片', icon: 'none' });
      return;
    }
    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      success: (res) => {
        const paths = (res.tempFilePaths || []).slice(0, remain);
        paths.forEach((p) => this.uploadImage(p));
      }
    });
  },
  uploadImage(tempPath){
    if (!tempPath) return;
    const uid = createUid();
    const item = { uid, url: tempPath, uploading: true };
    const list = (this.data.images || []).concat([item]);
    this.setData({ images: list, uploadingCount: this.data.uploadingCount + 1 });
    api.upload(tempPath)
      .then(res => {
        const id = res && res.id;
        const url = res && res.url ? res.url : tempPath;
        const idx = this.data.images.findIndex(img => img.uid === uid);
        if (idx === -1) return;
        this.setData({
          [`images[${idx}].id`]: id,
          [`images[${idx}].url`]: url,
          [`images[${idx}].uploading`]: false
        });
      })
      .catch(err => {
        const msg = err && err.message ? err.message : '上传失败';
        wx.showToast({ title: msg, icon: 'none' });
        const next = (this.data.images || []).filter(img => img.uid !== uid);
        this.setData({ images: next });
      })
      .finally(() => {
        this.setData({ uploadingCount: Math.max(0, this.data.uploadingCount - 1) });
      });
  },
  remove(e) {
    const uid = e.currentTarget.dataset.uid;
    const list = (this.data.images || []).filter(img => img.uid !== uid);
    this.setData({ images: list });
  },
  preview(e) {
    const uid = e.currentTarget.dataset.uid;
    const list = this.data.images || [];
    const urls = list.map(img => img.url);
    if (!urls.length) return;
    const current = list.find(img => img.uid === uid);
    wx.previewImage({ current: current ? current.url : urls[0], urls });
  },
  async submit() {
    if (this.data.submitting) return;
    const ensure = authUtil && authUtil.ensureLogin ? await authUtil.ensureLogin() : { ok: true };
    if (!ensure || !ensure.ok) return;
    if (this.data.uploadingCount > 0) {
      wx.showToast({ title: '图片上传中，请稍候', icon: 'none' });
      return;
    }
    const title = (this.data.form.title || '').trim();
    const content = (this.data.form.desc || '').trim();
    if (title.length < 4) {
      wx.showToast({ title: '标题至少4个字', icon: 'none' });
      return;
    }
    if (!content) {
      wx.showToast({ title: '请填写内容', icon: 'none' });
      return;
    }
    const imageIds = (this.data.images || [])
      .filter(img => img && img.id)
      .map(img => img.id);
    this.setData({ submitting: true });
    wx.showLoading({ title: '提交中', mask: true });
    try {
      await community.createPost({
        type: 'experience',
        title,
        content,
        images: imageIds
      });
      wx.showToast({ title: '已提交，待审核', icon: 'success' });
      mergeRefreshFlag('share');
      setTimeout(() => wx.navigateBack(), 600);
    } catch (err) {
      const msg = err && err.message ? err.message : '提交失败';
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ submitting: false });
      wx.hideLoading();
    }
  }
});
