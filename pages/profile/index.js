const authUtil = require('../../utils/auth.js');

Page({
  data: {
    userInfo: {},
    projectNum: 0,
    hiveNum: 0,
    deviceNum: 0,
    postNum: 0,
    bannerHeight: 300
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
    const phone = (auth && auth.phone) ? auth.phone : '';
    const display = loggedIn ? phone : '游客';
    const info = { user_nick: display, user_avatar: 'https://dtm123.com:7803/targets/image/images/avatar.png', user_phone: loggedIn ? phone : '' };
    this.setData({
      userInfo: info,
      projectNum: 3,
      hiveNum: 12,
      deviceNum: 48,
      postNum: 5
    });
  },
  handleInfo(){
    if (authUtil && authUtil.ensureLogin) {
      Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return; // 未登录时已跳登录页
        wx.showToast({ title: '个人信息（占位）', icon: 'none' });
      });
    } else {
      wx.showToast({ title: '个人信息（占位）', icon: 'none' });
    }
  },
  // 我的检测号
  handleMyDetectionNumbers(){ wx.navigateTo({ url: '/pages/profile/detectionNumbers/index' }); },
  // 我的检测记录
  handleMyResults(){ wx.navigateTo({ url: '/pages/results/list/index' }); },
  // 自费检测与审核（跳转检测页，默认自费分段）
  handlePaidFlow(){ wx.switchTab({ url: '/pages/detection/index?mode=paid' }); },
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
