// Detection results service (real API)
const config = require('../utils/config.js');
const authUtil = require('../utils/auth.js');

function buildUrl(path, params = {}) {
  const q = Object.keys(params || {})
    .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  return q ? `${path}?${q}` : path;
}

function request({ url, method = 'GET', data = null, auth = true }) {
  return new Promise((resolve, reject) => {
    const headers = { 'content-type': 'application/json', 'Accept': 'application/json' };
    if (auth) {
      try {
        const { token } = authUtil.getAuth();
        if (token) headers['Authorization'] = 'Bearer ' + token;
      } catch (e) {}
    }
    wx.request({
      url,
      method,
      data,
      header: headers,
      success(res) {
        const { statusCode, data } = res;
        if (statusCode >= 200 && statusCode < 300) return resolve(data);
        // Normalize error
        const err = new Error('HTTP ' + statusCode);
        err.statusCode = statusCode;
        err.body = data;
        reject(err);
      },
      fail(err) { reject(err); }
    });
  });
}

async function getResults({ page = 1, pageSize = 10, status } = {}) {
  const url = config.apiBase + buildUrl('/api/detections', { page, per_page: pageSize, status });
  const res = await request({ url, method: 'GET', auth: true });
  const data = Array.isArray(res.data) ? res.data : [];
  const meta = res.meta || { total: data.length, has_more: false };
  return { list: data, total: meta.total || data.length, hasMore: !!meta.has_more };
}

async function getDetail(id) {
  const url = config.apiBase + `/api/detections/${encodeURIComponent(id)}`;
  const res = await request({ url, method: 'GET', auth: true });
  return res || null;
}

module.exports = { getResults, getDetail };
