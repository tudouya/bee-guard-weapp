function setAuth(auth) {
  try {
    if (!auth || typeof auth !== 'object') return;
    if (auth.token !== undefined && auth.token !== null && auth.token !== '') {
      wx.setStorageSync('auth_token', auth.token);
    }
    if (auth.phone !== undefined) {
      wx.setStorageSync('auth_phone', auth.phone || '');
    }
    if (auth.expiresAt !== undefined) {
      wx.setStorageSync('auth_expires', auth.expiresAt || '');
    }
  } catch (e) {}
}

function getAuth() {
  try {
    const token = wx.getStorageSync('auth_token');
    const phone = wx.getStorageSync('auth_phone');
    const expiresAt = wx.getStorageSync('auth_expires');
    return { token, phone, expiresAt };
  } catch (e) {
    return { token: '', phone: '', expiresAt: '' };
  }
}

function clearAuth() {
  try {
    wx.removeStorageSync('auth_token');
    wx.removeStorageSync('auth_phone');
    wx.removeStorageSync('auth_expires');
  } catch (e) {}
}

function isLoggedIn() {
  const { token } = getAuth();
  return !!token;
}

// Ensure user has logged in before proceeding an action
// Usage: const { ok } = await ensureLogin(); if (!ok) return;
function ensureLogin(options = {}) {
  const logged = isLoggedIn();
  if (logged) {
    return Promise.resolve({ ok: true });
  }
  // Minimal-intrusion: navigate to standalone login page
  try {
    wx.showToast({ title: '请先登录', icon: 'none', duration: 600 });
  } catch (e) {}
  try {
    wx.navigateTo({ url: '/pages/auth/login/index' });
  } catch (e) {}
  return Promise.resolve({ ok: false, pending: true });
}

module.exports = {
  setAuth,
  getAuth,
  clearAuth,
  isLoggedIn,
  ensureLogin
};
