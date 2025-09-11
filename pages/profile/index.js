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
    this.mockInit();
  },
  onShow() {
    this.mockInit();
    this.updateBannerHeight();
  },
  onReady(){ this.updateBannerHeight(); },
  mockInit(){
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || { user_nick: '游客', user_avatar: 'https://dtm123.com:7803/targets/image/images/avatar.png', user_phone: '' },
      projectNum: 3,
      hiveNum: 12,
      deviceNum: 48,
      postNum: 5
    });
  },
  handleInfo(){ wx.showToast({ title: '个人信息（占位）', icon: 'none' }); },
  // 我的检测记录
  handleMyResults(){ wx.navigateTo({ url: '/pages/results/list/index' }); },
  // 自费检测与审核（跳转检测页，默认自费分段）
  handlePaidFlow(){ wx.switchTab({ url: '/pages/detection/index?mode=paid' }); },
  handleTopicRecord(){ wx.navigateTo({ url: '/pages/profile/topicRecord/index' }); },
  // 邮寄指南
  handleGuide(){ wx.navigateTo({ url: '/pages/detection/guide/index' }); },
  // 知识库与社区（统一入口）
  handleKnowledge(){ wx.navigateTo({ url: '/packageCommunity/pages/disease-list/index' }); },
  handleWarrant(){ wx.showToast({ title: '消息授权（占位）', icon: 'none' }); }
  ,
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
