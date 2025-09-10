Page({
  data: {
    userInfo: {},
    projectNum: 0,
    hiveNum: 0,
    deviceNum: 0,
    postNum: 0
  },
  onLoad() {
    this.mockInit();
  },
  onShow() {
    this.mockInit();
  },
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
  handleWarnRecord(){ wx.showToast({ title: '预警记录（占位）', icon: 'none' }); },
  handleBrowseRecord(){ wx.showToast({ title: '浏览记录（占位）', icon: 'none' }); },
  handleTopicRecord(){ wx.navigateTo({ url: '/pages/profile/topicRecord/index' }); },
  handleWarrant(){ wx.showToast({ title: '消息授权（占位）', icon: 'none' }); }
});
