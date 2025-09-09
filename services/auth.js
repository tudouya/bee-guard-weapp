// Mock auth services for WeChat login and phone binding

function loginByWeChatCode(loginCode) {
  // Simulate exchanging code for session/openid on backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ session: 'mock_session_' + Date.now(), openid: 'mock_openid' });
    }, 500);
  });
}

function bindPhoneByCode(phoneCode, session) {
  // Simulate getting phone number from WeChat server and issuing token
  return new Promise((resolve) => {
    setTimeout(() => {
      // mock phone number
      const phone = '138' + Math.floor(10000000 + Math.random() * 89999999);
      resolve({ token: 'mock_token_' + Date.now(), phone, expiresAt: '' });
    }, 600);
  });
}

module.exports = {
  loginByWeChatCode,
  bindPhoneByCode
};

