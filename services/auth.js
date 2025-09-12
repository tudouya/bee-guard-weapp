// Real auth services for WeChat login and phone binding
const config = require('../utils/config.js');
const authUtil = require('../utils/auth.js');

function request({ url, method = 'POST', data = {}, auth = false, headers = {} }) {
  return new Promise((resolve, reject) => {
    const baseHeaders = {
      'content-type': 'application/json',
      'Accept': 'application/json'
    };
    if (auth) {
      try {
        const { token } = authUtil.getAuth();
        if (token) baseHeaders['Authorization'] = 'Bearer ' + token;
      } catch (e) {}
    }
    wx.request({
      url,
      method,
      data,
      header: Object.assign({}, baseHeaders, headers),
      success(res) {
        const { statusCode, data } = res;
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error('HTTP ' + statusCode));
        }
      },
      fail(err) { reject(err); }
    });
  });
}

// Exchange wx.login code for session/openid or token
function loginByWeChatCode(loginCode) {
  const url = config.apiBase + config.authPaths.login;
  return request({ url, method: 'POST', data: { code: loginCode } });
}

// Exchange getPhoneNumber code (+session) for token
function bindPhoneByCode(phoneCode, session) {
  const url = config.apiBase + config.authPaths.bindPhone;
  // Backend expects `phone_code` (Laravel FormRequest WeChatBindPhoneRequest)
  const payload = { phone_code: phoneCode };
  if (session) {
    payload.session = session;
    // Provide alias if backend expects session_key
    payload.session_key = session;
  }
  // Protected by Sanctum: require Bearer token and Accept header
  return request({ url, method: 'POST', data: payload, auth: true });
}

module.exports = { loginByWeChatCode, bindPhoneByCode };
