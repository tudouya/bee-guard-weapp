// 壳页：仅用于兼容旧路由，进入后重定向到统一页（disease-list?tab=share）
Page({
  onLoad(){
    // 统一入口到单页内切换，直达“经验分享”标签
    wx.redirectTo({ url: '/packageCommunity/pages/disease-list/index?tab=share' });
  }
});
