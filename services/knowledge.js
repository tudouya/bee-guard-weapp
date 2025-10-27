// 防控知识服务（真实接口对接版）
// 说明：
// - 所有接口匿名可读；无需 Token。
// - 依赖全局配置 utils/config.js 的 apiBase，例如 https://api.bee-guard.com
// - 返回 Promise，解析后统一抛出 { list, meta } 或实体对象，便于页面使用

const config = require('../utils/config');
function getBaseUrl() {
  const base = (config && config.apiBase) || '';
  return base.replace(/\/$/, '');
}

function request({ url, method = 'GET', data = {} }) {
  const base = getBaseUrl();
  return new Promise((resolve, reject) => {
    if (!base) {
      reject(new Error('接口基础地址未配置，请在 utils/config.js 设置 apiBase'));
      return;
    }
    wx.request({
      url: base + url,
      method,
      data,
      header: { 'Content-Type': 'application/json' },
      success(res) {
        const body = res && res.data;
        if (!body || typeof body !== 'object') {
          reject(new Error('网络返回异常'));
          return;
        }
        if (body.code !== 0) {
          reject(new Error(body.message || '接口错误'));
          return;
        }
        resolve(body);
      },
      fail(err) { reject(err || new Error('网络错误')); }
    });
  });
}

function listDiseases({ page = 1, per_page = 10 } = {}) {
  if (per_page > 50) per_page = 50;
  return request({ url: `/api/knowledge/diseases`, data: { page, per_page } })
    .then(({ data, meta }) => ({ list: Array.isArray(data) ? data : [], meta: meta || {} }));
}

function getDisease(code) {
  if (!code) return Promise.reject(new Error('缺少疾病编码'));
  return request({ url: `/api/knowledge/diseases/${code}` })
    .then(({ data }) => data || {});
}

function listArticlesByDisease(code, { page = 1, per_page = 10 } = {}) {
  if (!code) return Promise.reject(new Error('缺少疾病编码'));
  if (per_page > 50) per_page = 50;
  return request({ url: `/api/knowledge/diseases/${code}/articles`, data: { page, per_page } })
    .then(({ data, meta }) => ({ list: Array.isArray(data) ? data : [], meta: meta || {} }));
}

function getArticle(id) {
  if (!id) return Promise.reject(new Error('缺少文章ID'));
  return request({ url: `/api/knowledge/articles/${id}` })
    .then(({ data }) => data || {});
}

function reportArticleExposure(id, payload = {}) {
  if (!id) return Promise.reject(new Error('缺少文章ID'));
  return request({ url: `/api/knowledge/articles/${id}/exposure`, method: 'POST', data: payload })
    .then(({ data }) => data || { counted: false, windowSeconds: 1800 });
}

function listFeaturedArticles() {
  return request({ url: `/api/knowledge/articles/featured` })
    .then(({ data }) => {
      if (!Array.isArray(data)) return [];
      return data.map((item) => ({
        id: item.id,
        title: item.title || '',
        brief: item.brief || '',
        date: item.date || '',
        views: typeof item.views === 'number' ? item.views : 0,
        diseaseCode: item.diseaseCode || ''
      }));
    });
}

module.exports = {
  listDiseases,
  getDisease,
  listArticlesByDisease,
  getArticle,
  reportArticleExposure,
  listFeaturedArticles
};
