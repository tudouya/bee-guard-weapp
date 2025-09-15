// Lightweight API wrapper for WeChat Mini Program
// Handles base URL, Authorization header, unified response envelope, and uploads.

const config = require('./config.js');
const authUtil = require('./auth.js');

function buildUrl(path) {
  if (!path) return config.apiBase || '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = config.apiBase || '';
  if (path.startsWith('/')) return base + path;
  return base + '/' + path;
}

function parseJSONSafe(val) {
  if (val == null) return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch (e) { return null; }
}

function normalizeError(status, payload, fallbackMessage) {
  const data = typeof payload === 'object' ? payload : parseJSONSafe(payload);
  let message = fallbackMessage || '请求失败';
  let errors = undefined;
  if (data) {
    if (typeof data.message === 'string' && data.message) message = data.message;
    if (data.errors && typeof data.errors === 'object') errors = data.errors;
  }
  const err = new Error(message);
  err.status = status;
  if (errors) err.errors = errors;
  err.payload = data || payload;
  return err;
}

function request(method, path, data = {}, opts = {}) {
  const url = buildUrl(path);
  const headers = Object.assign({
    'Accept': 'application/json'
  }, opts.headers || {});

  // Default JSON for non-GET
  if (method !== 'GET') headers['content-type'] = 'application/json';

  // Auth header when available
  try {
    const { token } = authUtil.getAuth();
    if (token) headers['Authorization'] = 'Bearer ' + token;
  } catch (e) {}

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data: method === 'GET' ? undefined : data,
      header: headers,
      success(res) {
        const { statusCode, data: body } = res;
        if (statusCode >= 200 && statusCode < 300) {
          // Handle new API format: { success: true, data: [...] }
          if (body && typeof body === 'object' && body.success === true) {
            resolve(body);
            return;
          }
          // Expect envelope: { code: 0, message, data }
          if (body && typeof body === 'object' && body.code === 0) {
            resolve(body.data);
            return;
          }
          // Tolerate successful 2xx without code===0
          resolve((body && body.data) || body);
          return;
        }
        // Handle error envelopes
        reject(normalizeError(statusCode, body, '请求失败'));
      },
      fail(err) {
        reject(normalizeError(0, null, err && err.errMsg ? err.errMsg : '网络异常'));
      }
    });
  });
}

function get(path) {
  return request('GET', path);
}

function post(path, data) {
  return request('POST', path, data);
}

function upload(filePath, path = '/api/uploads', formData = {}) {
  const url = buildUrl(path);
  const headers = { 'Accept': 'application/json' };
  try {
    const { token } = authUtil.getAuth();
    if (token) headers['Authorization'] = 'Bearer ' + token;
  } catch (e) {}

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      filePath,
      name: 'file',
      formData,
      header: headers,
      success(res) {
        const { statusCode, data } = res;
        if (statusCode >= 200 && statusCode < 300) {
          const parsed = parseJSONSafe(data) || {};
          if (parsed && parsed.code === 0) {
            const d = parsed.data || {};
            if (d && typeof d.url === 'string' && !/^https?:\/\//i.test(d.url)) {
              d.url = buildUrl(d.url);
            }
            resolve(d);
            return;
          }
          // If backend returns bare data
          const d2 = (parsed && parsed.data) || parsed || {};
          if (d2 && typeof d2.url === 'string' && !/^https?:\/\//i.test(d2.url)) {
            d2.url = buildUrl(d2.url);
          }
          resolve(d2);
          return;
        }
        reject(normalizeError(statusCode, res.data, '上传失败'));
      },
      fail(err) {
        reject(normalizeError(0, null, err && err.errMsg ? err.errMsg : '上传失败'));
      }
    });
  });
}

module.exports = {
  request,
  get,
  post,
  upload
};
