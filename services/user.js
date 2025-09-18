const api = require('../utils/api.js');

async function getProfile() {
  return await api.get('/api/profile');
}

async function updateProfile({ avatar, nickname }) {
  const payload = {};
  if (typeof avatar === 'string' && avatar) payload.avatar = avatar;
  if (typeof nickname === 'string') payload.nickname = nickname;
  // 后端支持 PATCH（别名 POST 也可），此处固定 PATCH
  return await api.request('PATCH', '/api/profile', payload);
}

module.exports = { getProfile, updateProfile };
