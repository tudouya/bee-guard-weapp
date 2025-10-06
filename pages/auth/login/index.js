const authSvc = require('../../../services/auth.js');
const authUtil = require('../../../utils/auth.js');

function extractRole(payload) {
  if (!payload || typeof payload !== 'object') return '';
  const candidates = [
    payload.role,
    payload.user && payload.user.role,
    payload.data && payload.data.role,
    payload.data && payload.data.user && payload.data.user.role
  ];
  for (let i = 0; i < candidates.length; i += 1) {
    const val = candidates[i];
    if (typeof val === 'string' && val) {
      return val;
    }
  }
  return '';
}

Page({
  data: {
    loading: false,
    agree: false
  },
  onLoginTap() {
    if (this.data.loading) return;
    if (!this.data.agree) {
      wx.showModal({
        title: '请先阅读并同意',
        content: '请阅读并勾选《用户协议》和《隐私政策》后再登录',
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },
  onAgreeChange(e) {
    const checked = (e && e.detail && e.detail.value && e.detail.value.length > 0) || false;
    this.setData({ agree: checked });
  },
  async onGetPhoneNumber(e) {
    if (!this.data.agree) {
      wx.showModal({
        title: '请先阅读并同意',
        content: '请阅读并勾选《用户协议》和《隐私政策》后再登录',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }
    if (!e || !e.detail) {
      wx.showToast({ title: '授权失败，请重试', icon: 'none' });
      return;
    }
    if (e.detail.errMsg && e.detail.errMsg.indexOf('fail') !== -1) {
      wx.showToast({ title: '已取消授权，您可稍后重试', icon: 'none' });
      return;
    }
    try {
      this.setData({ loading: true });
      // 1. 获取微信登录 code
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({ success: resolve, fail: reject });
      });
      const loginCode = loginRes.code;
      // 2. 向后端换取 session/openid
      const loginResp = await authSvc.loginByWeChatCode(loginCode);
      // 兼容不同字段命名，优先提取 token 并暂存（供后续 bind-phone 授权用）
      const loginToken = (loginResp && (loginResp.token || loginResp.access_token || (loginResp.data && (loginResp.data.token || loginResp.data.access_token)))) || '';
      const loginPhone = (loginResp && (loginResp.phone || (loginResp.data && loginResp.data.phone))) || '';
      const session = loginResp && (loginResp.session || loginResp.sessionKey || loginResp.session_key || (loginResp.data && (loginResp.data.session || loginResp.data.session_key))) || '';
      const loginExpiresAt = (loginResp && (loginResp.expiresAt || loginResp.expired_at || (loginResp.data && (loginResp.data.expiresAt || loginResp.data.expired_at)))) || '';
      const loginRole = extractRole(loginResp);
      const initialAuth = {};
      if (loginToken) initialAuth.token = loginToken;
      if (loginPhone) initialAuth.phone = loginPhone;
      if (loginExpiresAt) initialAuth.expiresAt = loginExpiresAt;
      if (loginRole) initialAuth.role = loginRole;
      if (Object.keys(initialAuth).length > 0) {
        authUtil.setAuth(initialAuth);
      }
      // 3. 获取手机号 code（新版 API 返回 code）
      const phoneCode = e.detail.code;
      // 4. 绑定手机号并签发 token（真实接口）
      const bindResp = await authSvc.bindPhoneByCode(phoneCode, session);
      const token = (bindResp && (bindResp.token || (bindResp.data && bindResp.data.token))) || '';
      const phone = (bindResp && (bindResp.phone || (bindResp.data && bindResp.data.phone))) || '';
      const expiresAt = (bindResp && (bindResp.expiresAt || (bindResp.data && bindResp.data.expiresAt))) || '';
      const role = extractRole(bindResp) || loginRole;
      const finalAuth = {};
      if (token) finalAuth.token = token;
      if (phone) finalAuth.phone = phone;
      if (expiresAt) finalAuth.expiresAt = expiresAt;
      if (role) finalAuth.role = role;
      if (Object.keys(finalAuth).length > 0) {
        authUtil.setAuth(finalAuth);
      }
      wx.showToast({ title: '登录成功', icon: 'success', duration: 400 });
      setTimeout(() => {
        // 统一返回到发起页，保持可回退
        wx.navigateBack({
          fail: () => wx.switchTab({ url: '/pages/detection/index' })
        });
      }, 400);
    } catch (err) {
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
  openUserAgreement() {
    wx.showToast({ title: '用户协议（占位）', icon: 'none' });
  },
  openPrivacy() {
    wx.showToast({ title: '隐私政策（占位）', icon: 'none' });
  }
});
