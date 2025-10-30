const authUtil = require('../../../utils/auth.js');
const api = require('../../../utils/api.js');
const userSvc = require('../../../services/user.js');
const { resolveAsset } = require('../../../utils/assets.js');

const DEFAULT_AVATAR = resolveAsset('/weapp/profile-avatar-default.png');

Page({
  data: {
    loading: true,
    saving: false,
    defaultAvatar: DEFAULT_AVATAR,
    avatarUrl: '', // 当前展示用（可能为本地临时图或线上地址）
    avatarLocal: '', // 选择的本地临时图
    nickname: '',
    phoneMasked: ''
  },
  onLoad() {
    // 需登录
    if (authUtil && authUtil.ensureLogin) {
      Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return; // 去登录页
        this.init();
      });
      return;
    }
    this.init();
  },
  async init(){
    try {
      this.setData({ loading: true });
      // 读取后端资料
      const prof = await userSvc.getProfile().catch(()=>null) || {};
      const avatar = prof.avatar || '';
      const nickname = prof.nickname || '';
      // 兜底手机号
      let phone = prof.phone || '';
      try { const a = authUtil.getAuth && authUtil.getAuth(); if (!phone && a && a.phone) phone = a.phone; } catch (e) {}
      this.setData({
        avatarUrl: avatar || this.data.defaultAvatar,
        nickname: nickname || '',
        phoneMasked: this.maskPhone(phone),
        loading: false
      });
    } catch (e) {
      this.setData({ loading: false });
    }
  },
  maskPhone(p){
    const s = String(p || '');
    if (/^1\d{10}$/.test(s)) return s.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    return s || '';
  },
  onChooseAvatar(e){
    const url = e && e.detail && e.detail.avatarUrl;
    if (!url) return;
    this.setData({ avatarUrl: url, avatarLocal: url });
  },
  onNicknameInput(e){
    this.setData({ nickname: e.detail.value });
  },
  async onSave(){
    if (this.data.saving) return;
    const nickname = (this.data.nickname || '').trim();
    if (nickname.length > 20) { wx.showToast({ title: '昵称最多20个字符', icon: 'none' }); return; }
    this.setData({ saving: true });
    try {
      let payload = { nickname };
      // 如使用了本地临时图，先上传换成稳定 URL，并回传相对路径 avatar
      if (this.data.avatarLocal) {
        const up = await api.upload(this.data.avatarLocal, '/api/uploads', { scene: 'avatar' });
          const previewUrl = (up && (up.url || up.preview || '')) || this.data.avatarUrl;
          const path = (up && (up.path || up.relative || '')) || '';
          if (previewUrl) this.setData({ avatarUrl: previewUrl });
        if (path) payload.avatar = path; // 后端建议传相对路径
      }
      const saved = await userSvc.updateProfile(payload);
      // 写入缓存，便于“我的”页立即显示
      try {
        let current = {};
        try { current = wx.getStorageSync('user_profile') || {}; } catch (err) {}
        const role = (saved && saved.role) || (current && current.role) || '';
        const stored = (saved && typeof saved === 'object') ? Object.assign({}, saved) : {
          avatar: this.data.avatarUrl,
          nickname,
          phone: this.data.phoneMasked
        };
        if (role) stored.role = role;
        wx.setStorageSync('user_profile', stored);
        if (role) {
          authUtil.setAuth({ role });
        }
      } catch (e) {}
      wx.showToast({ title: '已保存', icon: 'success' });
      setTimeout(()=> wx.navigateBack({ fail: ()=> wx.switchTab({ url: '/pages/profile/index' }) }), 350);
    } catch (e) {
      const msg = (e && e.message) ? e.message : '保存失败，请重试';
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  },
  onLogout(){
    try { authUtil && authUtil.clearAuth && authUtil.clearAuth(); } catch (e) {}
    wx.showToast({ title: '已退出', icon: 'none' });
    setTimeout(()=> wx.switchTab({ url: '/pages/profile/index' }), 300);
  }
});
