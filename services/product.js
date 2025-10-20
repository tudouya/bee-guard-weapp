const api = require('../utils/api.js');
const config = require('../utils/config.js');

const PLACEHOLDER_IMAGE = '/images/common/placeholder-card.png';

function resolveUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return 'https:' + url;
  const base = config && config.apiBase ? String(config.apiBase).replace(/\/$/, '') : '';
  if (!base) return url;
  if (url.startsWith('/')) return base + url;
  return base + '/' + url;
}

function ensureArray(value) {
  if (Array.isArray(value)) return value.filter(item => item != null && item !== '');
  return [];
}

function parseMedia(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function normalizeBaseProduct(item) {
  if (!item || typeof item !== 'object') return null;
  const images = ensureArray(item.images).map(resolveUrl);
  const contact = item.contact && typeof item.contact === 'object' ? item.contact : {};
  const source = item.source || 'platform';
  const highlights = ensureArray(item.highlights);
  const price = item.price || item.priceRange || '';
  const sourceLabel = contact.company || item.sourceLabel || (source === 'platform' ? '平台推荐' : '企业推荐');
  const normalizedContact = {
    company: contact.company || '',
    phone: contact.phone || '',
    wechat: contact.wechat || '',
    website: contact.website || ''
  };
  const hasContact = Object.values(normalizedContact).some(value => typeof value === 'string' && value.trim());

  return {
    id: item.productId || item.id || '',
    name: item.productName || item.name || '',
    subtitle: item.brief || item.subtitle || '',
    banner: images.length ? images[0] : PLACEHOLDER_IMAGE,
    images,
    source,
    sourceLabel,
    priceRange: price || '价格面议',
    recommendedFor: ensureArray(item.applicableScene || item.recommendedFor),
    tags: highlights.slice(0, 4),
    highlights,
    notice: ensureArray(item.cautions || item.notice),
    registrationNo: item.registrationNo || '',
    targetType: item.targetType || '',
    url: item.url || '',
    sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : Number.MAX_SAFE_INTEGER,
    contact: hasContact ? normalizedContact : null
  };
}

function mergeMediaFields(detail, media) {
  if (!media || typeof media !== 'object') return detail;
  const merged = Object.assign({}, detail);
  if (Array.isArray(media.composition) && !merged.composition) {
    merged.composition = media.composition;
  }
  if (Array.isArray(media.usageSteps) && !merged.usageSteps) {
    merged.usageSteps = media.usageSteps;
  }
  if (Array.isArray(media.notice) && (!merged.notice || merged.notice.length === 0)) {
    merged.notice = media.notice;
  }
  if (Array.isArray(media.faq) && !merged.faq) {
    merged.faq = media.faq;
  }
  if (Array.isArray(media.tags) && merged.tags.length === 0) {
    merged.tags = media.tags;
  }
  if (Array.isArray(media.highlights) && merged.highlights.length === 0) {
    merged.highlights = media.highlights;
  }
  if (typeof media.description === 'string' && !merged.description) {
    merged.description = media.description;
  }
  return merged;
}

async function listRecommendedProducts({ page = 1, per_page = 10, scene, source } = {}) {
  const response = await api.get('/api/recommendations/homepage');
  const rawList = Array.isArray(response)
    ? response
    : Array.isArray(response && response.data)
      ? response.data
      : Array.isArray(response && response.list)
        ? response.list
        : [];

  const normalized = rawList
    .map(normalizeBaseProduct)
    .filter(Boolean)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  let filtered = normalized;
  if (source && ['enterprise', 'platform'].includes(source)) {
    filtered = filtered.filter(item => item.source === source);
  }

  if (scene) {
    const keyword = String(scene).toLowerCase();
    filtered = filtered.filter(item => {
      if (!keyword) return true;
      const nameMatch = (item.name || '').toLowerCase().includes(keyword);
      const subtitleMatch = (item.subtitle || '').toLowerCase().includes(keyword);
      const sceneMatch = (item.recommendedFor || []).some(text => String(text).toLowerCase().includes(keyword));
      return nameMatch || subtitleMatch || sceneMatch;
    });
  }

  const total = filtered.length;
  const start = Math.max(0, (page - 1) * per_page);
  const end = start + per_page;
  const list = filtered.slice(start, end);

  return {
    list,
    meta: {
      total,
      page,
      per_page,
      has_more: end < total
    }
  };
}

async function getProductDetail(id) {
  if (!id) throw new Error('缺少产品 ID');
  const response = await api.get(`/api/products/${id}`);
  const detailRaw = response && response.data
    ? response.data
    : response && response.detail
      ? response.detail
      : response && response.product
        ? response.product
        : response;
  if (!detailRaw || typeof detailRaw !== 'object') {
    throw new Error('未找到产品信息');
  }

  const base = normalizeBaseProduct(detailRaw) || {};
  const media = parseMedia(detailRaw.media);
  const merged = mergeMediaFields(base, media);

  const enterprise = detailRaw.enterprise && typeof detailRaw.enterprise === 'object' ? detailRaw.enterprise : null;
  const enterpriseContact = enterprise && enterprise.contact && typeof enterprise.contact === 'object' ? enterprise.contact : {};

  const detail = Object.assign({}, merged, {
    description: merged.description || detailRaw.description || '',
    enterprise: enterprise
      ? {
          id: enterprise.id || '',
          name: enterprise.name || '',
          intro: enterprise.intro || '',
          logo: resolveUrl(enterprise.logoUrl || enterprise.logo),
          contact: {
            phone: enterpriseContact.phone || '',
            wechat: enterpriseContact.wechat || '',
            website: enterpriseContact.website || ''
          }
        }
      : null
  });

  const mergedContact = detail.contact || {};
  const contactHasInfo = mergedContact && Object.values(mergedContact).some(value => typeof value === 'string' && value.trim());

  if (!contactHasInfo && enterpriseContact) {
    const fallbackContact = {
      company: mergedContact && mergedContact.company ? mergedContact.company : enterprise && enterprise.name ? enterprise.name : '',
      phone: enterpriseContact.phone || '',
      wechat: enterpriseContact.wechat || '',
      website: enterpriseContact.website || ''
    };
    const fallbackHasInfo = Object.values(fallbackContact).some(value => typeof value === 'string' && value.trim());
    detail.contact = fallbackHasInfo ? fallbackContact : null;
  } else if (!contactHasInfo) {
    detail.contact = null;
  }

  if (!detail.tags || detail.tags.length === 0) {
    detail.tags = (detail.highlights || []).slice(0, 4);
  }

  return detail;
}

module.exports = {
  listRecommendedProducts,
  getProductDetail
};
