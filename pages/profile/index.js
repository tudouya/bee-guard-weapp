const authUtil = require('../../utils/auth.js');
const userSvc = require('../../services/user.js');
const { resolveAsset } = require('../../utils/assets.js');

const DEFAULT_AVATAR = resolveAsset('/weapp/profile-avatar-default.png');
const ASSETS = {
  arrow: resolveAsset('/weapp/profile-icon-arrow.png'),
  settings: resolveAsset('/weapp/profile-icon-settings.png'),
  detection: resolveAsset('/weapp/profile-icon-detection.png'),
  detectionRecord: resolveAsset('/weapp/profile-icon-detection-record.png'),
  reward: resolveAsset('/weapp/profile-icon-reward.png'),
  topic: resolveAsset('/weapp/profile-icon-topic.png'),
  mailing: resolveAsset('/weapp/profile-icon-mailing.png'),
  knowledge: resolveAsset('/weapp/profile-icon-knowledge.png'),
  chevron: resolveAsset('/weapp/profile-icon-chevron.png')
};

Page({
  data: {
    userInfo: {},
    projectNum: 0,
    hiveNum: 0,
    deviceNum: 0,
    postNum: 0,
    bannerHeight: 300,
    userRoleLabel: '',
    defaultAvatar: DEFAULT_AVATAR,
    assets: ASSETS
  },
  onLoad() {
    this.initUserInfo();
  },
  onShow() {
    this.initUserInfo();
    this.updateBannerHeight();
  },
  onReady(){ this.updateBannerHeight(); },
  initUserInfo(){
    const auth = (authUtil && authUtil.getAuth) ? authUtil.getAuth() : { token: '', phone: '' };
    const loggedIn = !!(auth && auth.token);
    // 先尝试缓存，避免闪烁
    let cached = null;
    try { cached = wx.getStorageSync('user_profile') || null; } catch (e) {}
    const phoneRaw = (cached && cached.phone) || (auth && auth.phone) || '';
    const phoneMasked = this.maskPhone(phoneRaw);
    const roleRaw = loggedIn ? ((cached && cached.role) || (auth && auth.role) || '') : '';
    const roleLabel = this.mapRole(roleRaw);
    const nickDefault = loggedIn ? (phoneMasked || '已登录用户') : '游客';
    const initial = {
      user_nick: (cached && cached.nickname) || nickDefault,
      user_avatar: this.validHttp((cached && cached.avatar)) ? cached.avatar : DEFAULT_AVATAR,
      user_phone: loggedIn ? phoneRaw : '',
      user_role: roleRaw
    };
    this.setData({
      userInfo: initial,
      projectNum: 3,
      hiveNum: 12,
      deviceNum: 48,
      postNum: 5,
      userRoleLabel: roleLabel
    });
    if (!loggedIn) return;
    // 后台刷新
    userSvc.getProfile().then(p => {
      const nn = (p && typeof p.nickname === 'string') ? p.nickname.trim() : '';
      const av = (p && typeof p.avatar === 'string') ? p.avatar : '';
      const ph = (p && p.phone) || phoneRaw;
      const masked = this.maskPhone(ph);
      const nick = nn.length ? nn : (masked || '已登录用户');
      const avatar = this.validHttp(av) ? av : DEFAULT_AVATAR;
      const role = (p && typeof p.role === 'string') ? p.role : roleRaw;
      const roleLabelNext = this.mapRole(role);
      const next = { user_nick: nick, user_avatar: avatar, user_phone: ph, user_role: role };
      this.setData({ userInfo: next, userRoleLabel: roleLabelNext });
      try {
        wx.setStorageSync('user_profile', { avatar, nickname: nn, phone: ph, role });
      } catch (e) {}
      try {
        authUtil.setAuth({ phone: ph, role });
      } catch (e) {}
    }).catch(()=>{
      // 忽略错误，维持当前展示
    });
  },
  maskPhone(p){
    const s = String(p || '');
    if (/^1\d{10}$/.test(s)) return s.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    return s || '';
  },
  validHttp(u){
    return typeof u === 'string' && /^(https?:)\/\//i.test(u);
  },
  mapRole(role){
    const mapping = {
      farmer: '蜂农',
      enterprise_admin: '企业管理员',
      super_admin: '平台管理员'
    };
    const key = typeof role === 'string' ? role.trim().toLowerCase() : '';
    if (!key) return '';
    if (mapping[key]) return mapping[key];
    return role;
  },
  handleInfo(){
    if (authUtil && authUtil.ensureLogin) {
      Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return; // 未登录时已跳登录页
        wx.navigateTo({ url: '/pages/profile/edit/index' });
      });
    } else {
      wx.navigateTo({ url: '/pages/profile/edit/index' });
    }
  },
  // 我的检测号
  handleMyDetectionNumbers(){ wx.navigateTo({ url: '/pages/profile/detectionNumbers/index' }); },
  // 我的检测记录
  handleMyResults(){ wx.navigateTo({ url: '/pages/results/list/index' }); },
  handleRewards(){ wx.navigateTo({ url: '/pages/profile/rewards/index' }); },
  handleTopicRecord(){ wx.navigateTo({ url: '/pages/profile/topicRecord/index' }); },
  // 邮寄指南
  handleGuide(){ wx.navigateTo({ url: '/pages/detection/guide/index' }); },
  // 知识库与社区（统一入口）
  handleKnowledge(){ wx.navigateTo({ url: '/packageCommunity/pages/disease-list/index' }); },
  handleWarrant(){ wx.showToast({ title: '消息授权（占位）', icon: 'none' }); },

  updateBannerHeight(){
    try {
      const q = wx.createSelectorQuery().in(this);
      q.select('#data-board').boundingClientRect(rect => {
        if (!rect) return;
        const bottom = Math.max(0, Number(rect.bottom || 0));
        // 额外加 4px 余量，避免设备差异露出边缘
        const h = Math.ceil(bottom + 4);
        // 调试日志已移除
        if (h > 0 && h !== this.data.bannerHeight) {
          this.setData({ bannerHeight: h });
        }
      }).exec();
    } catch (e) {}
  }
});
