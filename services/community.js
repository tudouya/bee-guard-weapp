// Community services: Q&A and experience sharing integrations
// Handles list/detail/reply/like/post flows with backend API envelope { code, message, data, meta }

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
    const requestHeaders = Object.assign({
      'Accept': 'application/json'
    }, headers || {});
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

function listPosts({
  type,
  page = 1,
  per_page = 10,
  sort = 'latest',
  category,
  disease_code
} = {}) {
  if (!type) return Promise.reject(new Error('缺少帖子类型'));
  if (!['question', 'experience'].includes(type)) {
    return Promise.reject(new Error('帖子类型无效'));
  }
  if (per_page > 50) per_page = 50;
  const query = { type, page, per_page, sort, category, disease_code };
  return request({ path: '/api/community/posts', method: 'GET', query })
    .then(({ data, meta }) => ({ list: Array.isArray(data) ? data : [], meta: meta || {} }));
}

function getPostDetail(id, { deviceId } = {}) {
  if (!id) return Promise.reject(new Error('缺少帖子ID'));
  const path = `/api/community/posts/${id}`;
  const query = deviceId ? { deviceId } : undefined;
  return request({ path, method: 'GET', query })
    .then(({ data }) => data || {});
}

function listReplies(postId, { page = 1, per_page = 10 } = {}) {
  if (!postId) return Promise.reject(new Error('缺少帖子ID'));
  if (per_page > 50) per_page = 50;
  const path = `/api/community/posts/${postId}/replies`;
  return request({ path, method: 'GET', query: { page, per_page } })
    .then(({ data, meta }) => ({ list: Array.isArray(data) ? data : [], meta: meta || {} }));
}

function createPost(payload = {}) {
  const { type, title, content } = payload;
  if (!type || !['question', 'experience'].includes(type)) {
    return Promise.reject(new Error('请选择帖子类型'));
  }
  if (!title || title.length < 4) {
    return Promise.reject(new Error('标题至少4个字符'));
  }
  if (!content || content.length < 20) {
    return Promise.reject(new Error('正文至少20个字符'));
  }
  const body = Object.assign({}, payload);
  if (Array.isArray(body.images) && body.images.length > 3) {
    body.images = body.images.slice(0, 3);
  }
  return request({ path: '/api/community/posts', method: 'POST', data: body, auth: true })
    .then(({ data }) => data || {});
}

function listMyPosts({ status, page = 1, per_page = 10 } = {}) {
  if (per_page > 50) per_page = 50;
  const query = { status, page, per_page };
  return request({ path: '/api/community/posts/mine', method: 'GET', query, auth: true })
    .then(({ data, meta }) => ({ list: Array.isArray(data) ? data : [], meta: meta || {} }));
}

function createReply(postId, payload = {}) {
  if (!postId) return Promise.reject(new Error('缺少帖子ID'));
  if (!payload || !payload.content || payload.content.length < 5) {
    return Promise.reject(new Error('回复内容至少5个字符'));
  }
  const body = { content: payload.content };
  if (payload.parent_id) {
    body.parent_id = payload.parent_id;
  }
  return request({ path: `/api/community/posts/${postId}/replies`, method: 'POST', data: body, auth: true })
    .then(({ data }) => data || {});
}

function likePost(postId) {
  if (!postId) return Promise.reject(new Error('缺少帖子ID'));
  return request({ path: `/api/community/posts/${postId}/like`, method: 'POST', data: {}, auth: true })
    .then(({ data }) => data || {});
}

function unlikePost(postId) {
  if (!postId) return Promise.reject(new Error('缺少帖子ID'));
  return request({ path: `/api/community/posts/${postId}/like`, method: 'DELETE', data: {}, auth: true })
    .then(({ data }) => data || {});
}

module.exports = {
  listPosts,
  getPostDetail,
  listReplies,
  createPost,
  listMyPosts,
  createReply,
  likePost,
  unlikePost
};

