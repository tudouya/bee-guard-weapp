// Runtime configuration for API integration
// Adjust apiBase and paths to match your backend.

const config = {
  // Use https in prod; dev tools can bypass domain checks if enabled.
  // Default API base (dev)
  // apiBase: 'http://bee.tudouya.com',

  // Static asset host (S3). Remote assets mirror the /weapp directory within the bucket.
  assetBase: 'https://beeprotect.s3.cn-northwest-1.amazonaws.com.cn',
  
  apiBase: 'https://weapp.beemonitor.cn',

  authPaths: {
    // Exchange wx.login code for session/openid or token
    login: '/api/auth/wechat/login',
    // Exchange getPhoneNumber code (+ optional session) for token
    bindPhone: '/api/auth/wechat/bind-phone'
  },
};

module.exports = config;
