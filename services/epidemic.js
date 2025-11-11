// Epidemic services: 对接后台通报 API + 保留地图/趋势的临时数据。

const api = require('../utils/api');
const config = require('../utils/config');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildQuery(params = {}) {
  const segments = [];
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value === undefined || value === null || value === '') return;
    segments.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });
  return segments.join('&');
}

function normalizeRegion(region) {
  if (!region || typeof region !== 'object') {
    return {
      provinceCode: null,
      provinceName: null,
      cityCode: null,
      cityName: null,
      districtCode: null,
      districtName: null
    };
  }
  return {
    provinceCode: region.provinceCode || null,
    provinceName: region.provinceName || null,
    cityCode: region.cityCode || null,
    cityName: region.cityName || null,
    districtCode: region.districtCode || null,
    districtName: region.districtName || null
  };
}

function buildRegionText(region = {}) {
  const names = [region.provinceName, region.cityName, region.districtName].filter(Boolean);
  if (!names.length) return '';
  return names.join(' ');
}

function pickArray(source) {
  if (Array.isArray(source)) return source;
  if (source && Array.isArray(source.data)) return source.data;
  if (source && typeof source === 'object') {
    if (Array.isArray(source.list)) return source.list;
    if (Array.isArray(source.items)) return source.items;
  }
  return [];
}

function pickObject(source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return {};
  }
  if (source.success === true && source.data && typeof source.data === 'object') {
    return source.data;
  }
  if (source.data && typeof source.data === 'object' && !Array.isArray(source.data)) {
    return source.data;
  }
  return source;
}

function normalizeBulletin(item = {}) {
  const region = normalizeRegion(item.region);
  let thumbnailUrl = item.thumbnailUrl || item.thumbnail_url || '';
  if (thumbnailUrl && !/^https?:\/\//i.test(thumbnailUrl)) {
    const base = (config && config.apiBase) ? String(config.apiBase).replace(/\/$/, '') : '';
    const path = thumbnailUrl.startsWith('/') ? thumbnailUrl : `/${thumbnailUrl}`;
    thumbnailUrl = base ? `${base}${path}` : thumbnailUrl;
  }
  return {
    id: item.id,
    title: item.title || '',
    summary: item.summary || '',
    content: item.content || '',
    thumbnailUrl,
    riskLevel: item.riskLevel || item.risk_level || 'low',
    riskLevelText: item.riskLevelText || item.risk_level_text || '',
    region,
    regionText: buildRegionText(region),
    publishedAt: item.publishedAt || item.published_at || '',
    source: item.source || '',
    attachments: Array.isArray(item.attachments) ? item.attachments : []
  };
}

function fetchBulletins({ page = 1, perPage = 5, provinceCode, cityCode, districtCode, riskLevel } = {}) {
  const query = buildQuery({
    page,
    per_page: perPage,
    province_code: provinceCode,
    city_code: cityCode,
    district_code: districtCode,
    risk_level: riskLevel
  });

  const url = '/api/epidemic/bulletins' + (query ? `?${query}` : '');

  return api.get(url).then((res) => {
    const payload = (res && typeof res === 'object' && !Array.isArray(res))
      ? res
      : { data: Array.isArray(res) ? res : [], meta: {} };

    const listSource = Array.isArray(payload.data) ? payload.data : [];
    const list = listSource.map(normalizeBulletin);
    const meta = payload.meta || {};
    return { list, meta };
  });
}

function fetchFeaturedBulletins() {
  return api.get('/api/epidemic/bulletins/featured').then((res) => {
    const source = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
    return source.map(normalizeBulletin);
  });
}

function normalizeRegionOption(item = {}) {
  return {
    code: item.code || item.regionCode || item.provinceCode || item.districtCode || item.id || '',
    name: item.name || item.regionName || item.provinceName || item.districtName || item.label || ''
  };
}

function fetchProvinces() {
  return api.get('/api/regions/provinces').then((res) => {
    const list = pickArray(res);
    return list.map(normalizeRegionOption).filter((item) => item.code && item.name);
  });
}

function fetchProvinceCities(provinceCode) {
  if (!provinceCode) return Promise.resolve([]);
  const encoded = encodeURIComponent(provinceCode);
  const url = `/api/regions/${encoded}/cities`;
  return api.get(url).then((res) => {
    const list = pickArray(res);
    return list.map(normalizeRegionOption).filter((item) => item.code && item.name);
  });
}

function fetchProvinceDistricts(provinceCode) {
  if (!provinceCode) return Promise.resolve([]);
  const encoded = encodeURIComponent(provinceCode);
  const url = `/api/regions/provinces/${encoded}/districts`;
  return api.get(url).then((res) => {
    const list = pickArray(res);
    return list.map(normalizeRegionOption).filter((item) => item.code && item.name);
  });
}

function fetchCityDistricts(cityCode) {
  if (!cityCode) return Promise.resolve([]);
  const encoded = encodeURIComponent(cityCode);
  const url = `/api/regions/${encoded}/districts`;
  return api.get(url).then((res) => {
    const list = pickArray(res);
    return list.map(normalizeRegionOption).filter((item) => item.code && item.name);
  });
}

function fetchBulletinDetail(id) {
  if (!id) return Promise.reject(new Error('缺少通报 ID'));
  const url = `/api/epidemic/bulletins/${id}`;
  return api.get(url).then((res) => {
    const data = (res && typeof res === 'object' && !Array.isArray(res))
      ? (res.data ?? res)
      : res;
    return normalizeBulletin(data);
  });
}

function fetchDiseaseLegend({ active = true } = {}) {
  const query = buildQuery({ active: active ? 1 : undefined });
  const url = '/api/diseases' + (query ? `?${query}` : '');

  return api.get(url).then((res) => {
    const list = pickArray(res);
    return list.map((item = {}) => ({
      code: item.code || item.diseaseCode || '',
      name: item.name || item.displayName || item.label || '',
      color: item.display_color || item.color || item.displayColor || '',
      order: typeof item.display_order === 'number' ? item.display_order : (typeof item.order === 'number' ? item.order : null),
      isActive: item.is_active !== undefined ? !!item.is_active : (item.status !== undefined ? item.status === 1 : true)
    })).filter((item) => item.code && item.name);
  });
}

function fetchMonthlyDistribution({ provinceCode, countyCode, periods } = {}) {
  const query = buildQuery({
    province_code: provinceCode,
    county_code: countyCode,
    periods: Array.isArray(periods) ? periods.join(',') : periods
  });

  const url = '/api/epidemic/monthly-distribution' + (query ? `?${query}` : '');

  return api.get(url).then((res) => {
    const payload = pickObject(res);
    const legend = pickArray(payload.legend); 
    const groups = Array.isArray(payload.groups) ? payload.groups : [];
    const region = payload.region || {};
    const updatedAt = payload.updatedAt || payload.updated_at || null;
    return { legend, groups, region, updatedAt };
  });
}

function fetchEpidemicPie({ provinceCode, districtCode, year, compareYear, month } = {}) {
  if (!provinceCode || !districtCode) {
    return Promise.reject(new Error('缺少地区参数'));
  }

  const query = buildQuery({
    province_code: provinceCode,
    district_code: districtCode,
    year,
    compare_year: compareYear,
    month
  });

  const url = '/api/epidemic/map/pie' + (query ? `?${query}` : '');

  return api.get(url).then((res) => {
    const payload = pickObject(res);
    const legend = pickArray(payload.legend);
    const groups = Array.isArray(payload.groups) ? payload.groups : [];
    const region = payload.region || {};
    const updatedAt = payload.updatedAt || payload.updated_at || null;
    const availableMonths = Array.isArray(payload.availableMonths) ? payload.availableMonths : (Array.isArray(payload.available_months) ? payload.available_months : []);
    return { legend, groups, region, updatedAt, availableMonths };
  });
}

const DISEASES = [
  { code: 'SBV', name: 'SBV' },
  { code: 'IAPV', name: 'IAPV' },
  { code: 'BQCV', name: 'BQCV' },
  { code: 'AFB', name: 'AFB' },
  { code: 'EFB', name: 'EFB' },
  { code: 'NOSEMA', name: '微孢子虫' },
  { code: 'CHALK', name: '白垩病' }
];

function seededRand(seed, i) {
  // simple deterministic pseudo-random based on seed and index
  const x = Math.sin(seed * 9301 + i * 49297) * 233280;
  return x - Math.floor(x);
}

function getDistribution({ provinceName = '', cityName = '', districtName = '', month = '' } = {}) {
  const seedStr = `${provinceName}|${cityName}|${districtName}|${month}`;
  const seed = seedStr.split('').reduce((s, c) => s + c.charCodeAt(0), 0) || 1;
  const list = DISEASES.map((d, idx) => {
    // make AFB/EFB seasonally higher when month in 03-05; NOSEMA in 08-10
    let base = Math.round(seededRand(seed, idx) * 20 + (idx % 3) * 5);
    const m = (month || '').slice(5, 7);
    if (d.code === 'AFB' || d.code === 'EFB') {
      if (['03','04','05'].includes(m)) base += 10;
    }
    if (d.code === 'NOSEMA') {
      if (['08','09','10'].includes(m)) base += 8;
    }
    return { diseaseCode: d.code, diseaseName: d.name, positive: base, samples: base * 6 + 20, rate: base > 0 ? base / (base * 6 + 20) : 0 };
  });
  const totalPositive = list.reduce((s, i) => s + i.positive, 0);
  const totalSamples = list.reduce((s, i) => s + i.samples, 0);
  return delay(250).then(() => ({ list, totalPositive, totalSamples, updatedAt: new Date().toISOString() }));
}

function getTrend({ provinceName = '', cityName = '', districtName = '', diseaseCode = 'AFB', fromMonth = '', toMonth = '' } = {}) {
  const end = toMonth || '2025-01';
  const months = [];
  const parts = end.split('-');
  const baseDate = new Date(Number(parts[0] || 2025), Number(parts[1] || 1) - 1, 1);
  for (let i = 11; i >= 0; i--) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const seedStr = `${provinceName}|${cityName}|${districtName}|${diseaseCode}`;
  const seed = seedStr.split('').reduce((s, c) => s + c.charCodeAt(0), 0) || 1;
  const points = months.map((m, idx) => {
    let v = Math.round(seededRand(seed, idx) * 18 + (idx % 4) * 3);
    if ((diseaseCode === 'AFB' || diseaseCode === 'EFB') && ['03','04','05'].includes(m.slice(5,7))) v += 8;
    if (diseaseCode === 'NOSEMA' && ['08','09','10'].includes(m.slice(5,7))) v += 6;
    return { month: m, positive: v, samples: v * 6 + 15, rate: v > 0 ? v / (v * 6 + 15) : 0 };
  });
  return delay(220).then(() => ({ points, diseaseCode, updatedAt: new Date().toISOString() }));
}

module.exports = {
  fetchBulletins,
  fetchBulletinDetail,
  fetchFeaturedBulletins,
  fetchProvinces,
  fetchProvinceCities,
  fetchProvinceDistricts,
  fetchCityDistricts,
  fetchDiseaseLegend,
  fetchMonthlyDistribution,
  fetchEpidemicPie,
  getDistribution,
  getTrend,
  DISEASES
};
