// Enterprise services: fetch list & detail for mini program showcase

const config = require('../utils/config.js');

const PLACEHOLDER_LOGO = '/images/common/placeholder-card.png';

function getBaseUrl() {
  const base = (config && config.apiBase) || '';
  return base.replace(/\/+$/, '');
}

function resolveLogoUrl(url) {
  if (!url || typeof url !== 'string') return PLACEHOLDER_LOGO;
  const trimmed = url.trim();
  if (!trimmed) return PLACEHOLDER_LOGO;
  if (/^data:/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return 'https:' + trimmed;
  const base = getBaseUrl();
  if (!base) return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`;
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

function request({ path, query }) {
  return new Promise((resolve, reject) => {
    const url = buildUrl(path, query);
    if (!url) {
      reject(new Error('接口基础地址未配置，请在 utils/config.js 设置 apiBase'));
      return;
    }

    wx.request({
      url,
      method: 'GET',
      header: { 'Accept': 'application/json' },
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
      fail(err) {
        reject(err || new Error('网络错误'));
      }
    });
  });
}

function normalizeEnterprise(item) {
  if (!item || typeof item !== 'object') return item;
  const logoSource = item.logo || item.logoUrl || item.enterpriseLogo || '';
  return Object.assign({}, item, {
    logo: resolveLogoUrl(logoSource)
  });
}

function listEnterprises({ page = 1, per_page = 10 } = {}) {
  if (per_page > 50) per_page = 50;
  return request({ path: '/api/enterprises', query: { page, per_page } })
    .then(({ data, meta }) => ({
      list: Array.isArray(data) ? data.map(normalizeEnterprise) : [],
      meta: meta || {}
    }));
}

function getEnterpriseDetail(id) {
  if (!id) {
    return Promise.reject(new Error('缺少企业 ID'));
  }
  return request({ path: `/api/enterprises/${id}` })
    .then(({ data }) => normalizeEnterprise(data || {}));
}

module.exports = {
  listEnterprises,
  getEnterpriseDetail
};
