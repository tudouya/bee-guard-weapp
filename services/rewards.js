// Rewards service – real API integration
// Rewards service: backend endpoints under envelope { code, message, data, meta }

const config = require('../utils/config.js');
const authUtil = require('../utils/auth.js');

function getBaseUrl() {
  const base = (config && config.apiBase) || '';
  return base.replace(/\/$/, '');
}

function buildQuery(params = {}) {
  return Object.keys(params)
    .filter((key) => {
      const value = params[key];
      return value !== undefined && value !== null && value !== '';
    })
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

function buildUrl(path, query = {}) {
  const base = getBaseUrl();
  if (!base) return '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const qs = buildQuery(query);
  return qs ? `${base}${cleanPath}?${qs}` : `${base}${cleanPath}`;
}

function request({ path, method = 'GET', query, data, auth = false, headers = {} }) {
  return new Promise((resolve, reject) => {
    const base = getBaseUrl();
    if (!base) {
      reject(new Error('接口基础地址未配置，请在 utils/config.js 设置 apiBase'));
      return;
    }
    const url = buildUrl(path, method === 'GET' ? query : undefined);
    const requestHeaders = Object.assign({ 'Accept': 'application/json' }, headers || {});
    if (method !== 'GET') {
      requestHeaders['Content-Type'] = 'application/json';
    }
    if (auth) {
      try {
        const { token } = authUtil.getAuth();
        if (token) {
          requestHeaders['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {}
    }

    wx.request({
      url,
      method,
      data: method === 'GET' ? undefined : (data || {}),
      header: requestHeaders,
      success(res) {
        const body = res && res.data;
        if (!body || typeof body !== 'object') {
          reject(new Error('网络返回异常'));
          return;
        }
        if (body.code !== 0) {
          const msg = body.message || '接口错误';
          reject(new Error(msg));
          return;
        }
        resolve(body);
      },
      fail(err) {
        reject(err || new Error('网络错误'));
      }
    });
  });
}

function getRewardSummary() {
  return request({ path: '/api/rewards/summary', method: 'GET', auth: true })
    .then(({ data }) => data || { pending: 0, usable: 0, used: 0, expired: 0 });
}

function getRewardsByStatus(status) {
  const query = {};
  if (status && status !== 'all') query.status = status;
  return request({ path: '/api/rewards', method: 'GET', query, auth: true })
    .then(({ data }) => (Array.isArray(data) ? data : []));
}

function getRewardDetail(rewardId) {
  if (!rewardId) return Promise.reject(new Error('缺少奖励ID'));
  return request({ path: `/api/rewards/${rewardId}`, method: 'GET', auth: true })
    .then(({ data }) => data || {});
}

function markRewardUsed(rewardId) {
  if (!rewardId) return Promise.reject(new Error('缺少奖励ID'));
  return request({ path: `/api/rewards/${rewardId}/mark-used`, method: 'POST', auth: true })
    .then(({ data }) => data || {});
}

module.exports = {
  getRewardSummary,
  getRewardsByStatus,
  getRewardDetail,
  markRewardUsed
};
