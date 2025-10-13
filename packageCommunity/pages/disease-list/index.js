// 社区入口已统一至本页（disease/qa/share 三标签页）
// 说明：
// - 原 qa-list 与 share-list 页面在 onLoad 即重定向到本页，并携带 ?tab=qa|share 参数
// - 本页根据 active 渲染三块内容，保持页内切换以提升流畅度
// - 疾病百科与社区帖子均按需拉取真实接口数据，并缓存分页进度
const knowledge = require('../../../services/knowledge');
const community = require('../../../services/community');

const DEFAULT_AVATAR = '/images/profile-avatar-default.png';
const ROLE_LABELS = {
  farmer: '蜂农',
  enterprise_admin: '企业管理员',
  super_admin: '平台管理员'
};

const COMMUNITY_CATEGORIES = [
  { label: '全部', value: '' },
  { label: '健康养殖', value: '健康养殖' },
  { label: '疫病防控', value: '疫病防控' },
  { label: '蜜蜂产品', value: '蜜蜂产品' },
  { label: '蜜蜂育种', value: '蜜蜂育种' },
  { label: '蜜蜂授粉', value: '蜜蜂授粉' },
  { label: '市场信息', value: '市场信息' }
];

function resolveRoleLabel(role = '') {
  const key = typeof role === 'string' ? role.trim().toLowerCase() : '';
  if (!key) return '';
  if (ROLE_LABELS[key]) return ROLE_LABELS[key];
  return role;
}

function normalizePost(item = {}, fallbackType = 'question') {
  const author = item.author || {};
  const authorRole = author.role || '';
  return {
    id: item.id,
    type: item.type || fallbackType,
    title: item.title || '—',
    excerpt: item.excerpt || '',
    authorName: author.nickname || '蜂友',
    avatar: author.avatar || DEFAULT_AVATAR,
    authorRole,
    authorRoleLabel: resolveRoleLabel(authorRole),
    category: item.category || (fallbackType === 'question' ? '问题咨询' : '经验分享'),
    diseaseName: item.disease && item.disease.name || '',
    diseaseCode: item.disease && item.disease.code || '',
    likes: Number(item.likes || 0),
    replies: Number(item.replies || 0),
    views: Number(item.views || 0),
    publishedAt: item.published_at || '',
  };
}

Page({
  data: {
    active: 'disease',
    // 疾病百科列表（对接接口）
    diseaseList: [],
    dPage: 1,
    dPerPage: 25,
    dTotalPages: 1,
    dLoading: false,
    dNoMore: false,
    dLoaded: false,
    // 问答列表（分页加载）
    qaList: [],
    qaPage: 1,
    qaPerPage: 10,
    qaTotalPages: 1,
    qaLoading: false,
    qaNoMore: false,
    qaLoaded: false,
    qaError: '',
    qaSort: 'latest',
    qaCategories: COMMUNITY_CATEGORIES,
    qaActiveCategory: '',
    // 经验分享列表（分页加载）
    shareList: [],
    sharePage: 1,
    sharePerPage: 10,
    shareTotalPages: 1,
    shareLoading: false,
    shareNoMore: false,
    shareLoaded: false,
    shareError: '',
    shareSort: 'latest',
    shareCategories: COMMUNITY_CATEGORIES,
    shareActiveCategory: '',
    // 每个 Tab 的滚动位置
    scrollPositions: { disease: 0, qa: 0, share: 0 }
  },
  onLoad(options){
    const tab = options && options.tab;
    if (tab && ['disease','qa','share'].includes(tab)) {
      this.setData({ active: tab });
    }
    // 读取持久化的滚动位置
    try {
      const saved = wx.getStorageSync('communityScroll') || {};
      if (saved && typeof saved === 'object') {
        this.setData({ scrollPositions: Object.assign({ disease: 0, qa: 0, share: 0 }, saved) });
      }
    } catch (e) {}
    // 初始恢复当前标签滚动
    const sp = this.data.scrollPositions || {}; const key = this.data.active || 'disease';
    const y = Number(sp[key] || 0);
    if (y > 0) { setTimeout(()=> wx.pageScrollTo({ scrollTop: y, duration: 0 }), 0); }
    // 首次拉取疾病列表
    if (this.data.active === 'disease') {
      this.fetchDiseases();
    } else if (this.data.active === 'qa') {
      this.fetchQaList({ reset: true });
    } else if (this.data.active === 'share') {
      this.fetchShareList({ reset: true });
    }
  },
  onShow(){
    try {
      const needs = wx.getStorageSync('communityNeedsRefresh');
      if (needs && typeof needs === 'object') {
        if (needs.qa) {
          this.resetQaState();
          this.fetchQaList({ reset: true });
        }
        if (needs.share) {
          this.resetShareState();
          this.fetchShareList({ reset: true });
        }
        wx.removeStorageSync('communityNeedsRefresh');
      }
    } catch (e) {}
  },
  switchTab(e){
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.active) return;
    this.setData({ active: key }, () => {
      const sp = this.data.scrollPositions || {}; const y = Number(sp[key] || 0);
      if (y >= 0) { wx.pageScrollTo({ scrollTop: y, duration: 0 }); }
      if (key === 'disease' && !this.data.dLoaded) {
        this.fetchDiseases();
      }
      if (key === 'qa' && !this.data.qaLoaded) {
        this.fetchQaList({ reset: true });
      }
      if (key === 'share' && !this.data.shareLoaded) {
        this.fetchShareList({ reset: true });
      }
    });
  },
  async fetchDiseases(){
    if (this.data.dLoading || this.data.dNoMore) return;
    this.setData({ dLoading: true });
    try {
      const { list, meta } = await knowledge.listDiseases({ page: this.data.dPage, per_page: this.data.dPerPage });
      const cleaned = (list || [])
        .filter(it => it && it.code)
        .map(it => ({
          code: it.code,
          name: it.name || '未命名',
          brief: it.brief || '暂无简介',
          symptom: it.symptom || '—',
          articleCount: Number(it.articleCount || 0)
        }));
      const nextList = (this.data.diseaseList || []).concat(cleaned);
      const totalPages = meta && meta.total_pages ? Number(meta.total_pages) : this.data.dTotalPages;
      const curPage = meta && meta.page ? Number(meta.page) : this.data.dPage;
      const noMore = curPage >= totalPages;
      this.setData({
        diseaseList: nextList,
        dTotalPages: totalPages,
        dPage: curPage + 1,
        dNoMore: noMore,
        dLoaded: true
      });
    } catch (e) {
      wx.showToast({ title: e && e.message ? e.message : '加载失败', icon: 'none' });
    } finally {
      this.setData({ dLoading: false });
    }
  },
  onQaCategoryChange(e){
    let value = e && e.currentTarget ? e.currentTarget.dataset.value : undefined;
    if (typeof value === 'undefined') value = '';
    if (value === this.data.qaActiveCategory) return;
    this.resetQaState();
    const scrollPositions = Object.assign({}, this.data.scrollPositions, { qa: 0 });
    this.setData({ qaActiveCategory: value, scrollPositions }, () => {
      wx.pageScrollTo({ scrollTop: 0, duration: 0 });
      this.fetchQaList({ reset: true });
    });
  },
  onShareCategoryChange(e){
    let value = e && e.currentTarget ? e.currentTarget.dataset.value : undefined;
    if (typeof value === 'undefined') value = '';
    if (value === this.data.shareActiveCategory) return;
    this.resetShareState();
    const scrollPositions = Object.assign({}, this.data.scrollPositions, { share: 0 });
    this.setData({ shareActiveCategory: value, scrollPositions }, () => {
      wx.pageScrollTo({ scrollTop: 0, duration: 0 });
      this.fetchShareList({ reset: true });
    });
  },
  resetQaState(){
    this.setData({
      qaList: [],
      qaPage: 1,
      qaTotalPages: 1,
      qaNoMore: false,
      qaLoaded: false,
      qaError: ''
    });
  },
  resetShareState(){
    this.setData({
      shareList: [],
      sharePage: 1,
      shareTotalPages: 1,
      shareNoMore: false,
      shareLoaded: false,
      shareError: ''
    });
  },
  async fetchQaList({ reset = false } = {}){
    if (this.data.qaLoading) return;
    if (!reset && this.data.qaNoMore) return;
    const nextPage = reset ? 1 : this.data.qaPage;
    this.setData({ qaLoading: true, qaError: '' });
    try {
      const { list, meta } = await community.listPosts({
        type: 'question',
        page: nextPage,
        per_page: this.data.qaPerPage,
        sort: this.data.qaSort,
        category: this.data.qaActiveCategory || undefined
      });
      const cleaned = (list || []).map((item) => normalizePost(item, 'question'));
      const currentList = reset ? [] : (this.data.qaList || []);
      const merged = currentList.concat(cleaned);
      const perPage = this.data.qaPerPage;
      const totalPages = meta && meta.total_pages ? Number(meta.total_pages) : (cleaned.length < perPage ? nextPage : nextPage + 1);
      const currentPage = meta && meta.page ? Number(meta.page) : nextPage;
      const noMore = meta && meta.total_pages ? currentPage >= totalPages : cleaned.length < perPage;
      this.setData({
        qaList: merged,
        qaPage: currentPage + 1,
        qaTotalPages: totalPages,
        qaNoMore: noMore,
        qaLoaded: true
      });
    } catch (err) {
      const msg = err && err.message ? err.message : '加载失败';
      this.setData({ qaError: msg });
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ qaLoading: false });
      wx.stopPullDownRefresh();
    }
  },
  async fetchShareList({ reset = false } = {}){
    if (this.data.shareLoading) return;
    if (!reset && this.data.shareNoMore) return;
    const nextPage = reset ? 1 : this.data.sharePage;
    this.setData({ shareLoading: true, shareError: '' });
    try {
      const { list, meta } = await community.listPosts({
        type: 'experience',
        page: nextPage,
        per_page: this.data.sharePerPage,
        sort: this.data.shareSort,
        category: this.data.shareActiveCategory || undefined
      });
      const cleaned = (list || []).map((item) => normalizePost(item, 'experience'));
      const currentList = reset ? [] : (this.data.shareList || []);
      const merged = currentList.concat(cleaned);
      const perPage = this.data.sharePerPage;
      const totalPages = meta && meta.total_pages ? Number(meta.total_pages) : (cleaned.length < perPage ? nextPage : nextPage + 1);
      const currentPage = meta && meta.page ? Number(meta.page) : nextPage;
      const noMore = meta && meta.total_pages ? currentPage >= totalPages : cleaned.length < perPage;
      this.setData({
        shareList: merged,
        sharePage: currentPage + 1,
        shareTotalPages: totalPages,
        shareNoMore: noMore,
        shareLoaded: true
      });
    } catch (err) {
      const msg = err && err.message ? err.message : '加载失败';
      this.setData({ shareError: msg });
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ shareLoading: false });
      wx.stopPullDownRefresh();
    }
  },
  // 疾病百科详情
  openDiseaseDetail(e){
    const code = e.currentTarget.dataset.id;
    if (!code) return;
    wx.navigateTo({ url: `/packageCommunity/pages/disease-detail/index?id=${code}` });
  },
  // 问答详情
  openQaDetail(e){
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/packageCommunity/pages/qa-detail/index?id=${id}` });
  },
  // 分享详情
  openShareDetail(e){
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/packageCommunity/pages/share-detail/index?id=${id}` });
  },
  // 发帖/分享
  goQaPost(){ wx.navigateTo({ url: '/packageCommunity/pages/qa-post/index' }); },
  goSharePost(){ wx.navigateTo({ url: '/packageCommunity/pages/share-post/index' }); }
  ,
  onPageScroll(e){
    const y = e && typeof e.scrollTop === 'number' ? e.scrollTop : 0;
    const key = this.data.active || 'disease';
    const sp = Object.assign({}, this.data.scrollPositions, { [key]: y });
    this.setData({ scrollPositions: sp });
  },
  onHide(){
    try { wx.setStorageSync('communityScroll', this.data.scrollPositions || {}); } catch (e) {}
  },
  onUnload(){
    try { wx.setStorageSync('communityScroll', this.data.scrollPositions || {}); } catch (e) {}
  },
  onReachBottom(){
    if (this.data.active === 'disease') {
      this.fetchDiseases();
    } else if (this.data.active === 'qa') {
      this.fetchQaList();
    } else if (this.data.active === 'share') {
      this.fetchShareList();
    }
  },
  onPullDownRefresh(){
    if (this.data.active === 'qa') {
      this.fetchQaList({ reset: true });
    } else if (this.data.active === 'share') {
      this.fetchShareList({ reset: true });
    } else if (this.data.active === 'disease') {
      this.setData({
        diseaseList: [],
        dPage: 1,
        dTotalPages: 1,
        dNoMore: false,
        dLoaded: false
      }, () => {
        this.fetchDiseases();
      });
    }
  }
});
