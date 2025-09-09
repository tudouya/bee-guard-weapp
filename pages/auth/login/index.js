const authSvc = require('../../../services/auth.js');
const authUtil = require('../../../utils/auth.js');

Page({
  data: {
    loading: false
  },
  async onGetPhoneNumber(e) {
    if (!e || !e.detail) {
      wx.showToast({ title: '授权失败，请重试', icon: 'none' });
      return;
    }
    if (e.detail.errMsg && e.detail.errMsg.indexOf('fail') !== -1) {
      wx.showToast({ title: '已取消授权，可使用手机号登录', icon: 'none' });
      return;
    }
    try {
      this.setData({ loading: true });
      // 1. 获取微信登录 code
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({ success: resolve, fail: reject });
      });
      const loginCode = loginRes.code;
      // 2. 向后端换取 session/openid（mock）
      const { session } = await authSvc.loginByWeChatCode(loginCode);
      // 3. 获取手机号 code（新流程）
      const phoneCode = e.detail.code; // 新版返回 code
      // 4. 绑定手机号并签发 token（mock）
      const { token, phone, expiresAt } = await authSvc.bindPhoneByCode(phoneCode, session);
      authUtil.setAuth({ token, phone, expiresAt });
      wx.showToast({ title: '登录成功', icon: 'success', duration: 500 });
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/results/list/index' });
      }, 500);
    } catch (err) {
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
  useSmsLogin() {
    wx.showToast({ title: '暂未开通短信登录', icon: 'none' });
  },
  openUserAgreement() {
    wx.showToast({ title: '用户协议（占位）', icon: 'none' });
  },
  openPrivacy() {
    wx.showToast({ title: '隐私政策（占位）', icon: 'none' });
  }
});

