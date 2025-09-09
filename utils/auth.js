function setAuth(auth) {
  try {
    if (auth && auth.token) {
      wx.setStorageSync('auth_token', auth.token);
      wx.setStorageSync('auth_phone', auth.phone || '');
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

module.exports = {
  setAuth,
  getAuth,
  clearAuth,
  isLoggedIn
};

