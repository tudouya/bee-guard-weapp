const community = require('../../../services/community');
const authUtil = require('../../../utils/auth.js');

const DEFAULT_AVATAR = 'https://dtm123.com:7803/targets/image/images/010.png';

function ensureDeviceId(){
  try {
    const existed = wx.getStorageSync('deviceId');
    if (existed) return existed;
    const id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    wx.setStorageSync('deviceId', id);
    return id;
  } catch (e) {
    return '';
  }
}

function normalizeReply(item) {
  if (!item || typeof item !== 'object') return null;
  const author = item.author || {};
  return {
    id: item.id,
    content: item.content || '',
    replyType: item.reply_type || 'farmer',
    authorName: author.nickname || '蜂友',
    avatar: author.avatar || DEFAULT_AVATAR,
    publishedAt: item.published_at || '',
    children: Array.isArray(item.children)
      ? item.children.map((child) => {
        const cauthor = child.author || {};
        return {
          id: child.id,
          content: child.content || '',
          authorName: cauthor.nickname || '蜂友',
          avatar: cauthor.avatar || DEFAULT_AVATAR,
          publishedAt: child.published_at || ''
        };
      })
      : []
  };
}

Page({
  data: {
    id: '',
    loading: true,
    item: null,
    likes: 0,
    liked: false,
    likeLoading: false,
    replies: [],
    replyPage: 1,
    replyPerPage: 10,
    replyNoMore: false,
    replyLoading: false,
    replyError: '',
    replyContent: '',
    submittingReply: false
  },
  onLoad(options) {
    const id = options && options.id;
    if (!id) {
      wx.showToast({ title: '参数缺失', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 600);
      return;
    }
    this.setData({ id: String(id) });
    this.fetchDetail();
    this.fetchReplies({ reset: true });
  },
  async fetchDetail(){
    const { id } = this.data;
    if (!id) return;
    this.setData({ loading: true });
    try {
      const detail = await community.getPostDetail(id, { deviceId: ensureDeviceId() });
      if (!detail || !detail.id) throw new Error('内容不存在');
      const author = detail.author || {};
      const disease = detail.disease || {};
      const item = {
        id: detail.id,
        title: detail.title || '无标题',
        content: detail.content || '',
        contentFormat: detail.content_format || 'plain',
        images: Array.isArray(detail.images) ? detail.images : [],
        authorName: author.nickname || '蜂友',
        avatar: author.avatar || DEFAULT_AVATAR,
        category: detail.category || '经验分享',
        diseaseName: disease.name || '',
        publishedAt: detail.published_at || '',
        views: Number(detail.views || 0),
        repliesCount: Number(detail.replies || 0)
      };
      this.setData({
        item,
        likes: Number(detail.likes || 0),
        liked: !!detail.liked
      });
    } catch (err) {
      const msg = err && err.message ? err.message : '加载失败';
      wx.showToast({ title: msg, icon: 'none' });
      this.setData({ item: null });
    } finally {
      this.setData({ loading: false });
    }
  },
  async fetchReplies({ reset = false } = {}){
    const { id, replyLoading, replyNoMore, replyPage, replyPerPage } = this.data;
    if (!id || replyLoading) return;
    if (!reset && replyNoMore) return;
    const nextPage = reset ? 1 : replyPage;
    this.setData({ replyLoading: true, replyError: '' });
    try {
      const { list, meta } = await community.listReplies(id, { page: nextPage, per_page: replyPerPage });
      const normalized = (list || []).map((item) => normalizeReply(item)).filter(Boolean);
      const current = reset ? [] : (this.data.replies || []);
      const merged = current.concat(normalized);
      const totalPages = meta && meta.total_pages ? Number(meta.total_pages) : (meta && meta.page ? Number(meta.page) : nextPage);
      const currentPage = meta && meta.page ? Number(meta.page) : nextPage;
      if (meta && typeof meta.total === 'number' && this.data.item) {
        this.setData({ 'item.repliesCount': Number(meta.total) });
      }
      this.setData({
        replies: merged,
        replyPage: currentPage + 1,
        replyNoMore: currentPage >= totalPages
      });
    } catch (err) {
      const msg = err && err.message ? err.message : '回复加载失败';
      this.setData({ replyError: msg });
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ replyLoading: false });
      wx.stopPullDownRefresh();
    }
  },
  onReplyInput(e){
    this.setData({ replyContent: e.detail.value });
  },
  async submitReply(){
    if (this.data.submittingReply) return;
    const ensure = authUtil && authUtil.ensureLogin ? await authUtil.ensureLogin() : { ok: true };
    if (!ensure || !ensure.ok) return;
    const content = (this.data.replyContent || '').trim();
    if (content.length < 5) {
      wx.showToast({ title: '回复内容至少5个字', icon: 'none' });
      return;
    }
    this.setData({ submittingReply: true });
    try {
      await community.createReply(this.data.id, { content });
      wx.showToast({ title: '已提交，待审核', icon: 'success' });
      this.setData({ replyContent: '' });
    } catch (err) {
      const msg = err && err.message ? err.message : '提交失败';
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ submittingReply: false });
    }
  },
  async toggleLike(){
    if (this.data.likeLoading) return;
    const ensure = authUtil && authUtil.ensureLogin ? await authUtil.ensureLogin() : { ok: true };
    if (!ensure || !ensure.ok) return;
    this.setData({ likeLoading: true });
    try {
      const res = this.data.liked
        ? await community.unlikePost(this.data.id)
        : await community.likePost(this.data.id);
      const liked = res && typeof res.liked === 'boolean' ? res.liked : !this.data.liked;
      const likes = res && typeof res.likes === 'number' ? res.likes : (liked ? this.data.likes + 1 : Math.max(0, this.data.likes - 1));
      this.setData({ liked, likes });
    } catch (err) {
      const msg = err && err.message ? err.message : '操作失败';
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ likeLoading: false });
    }
  },
  previewImage(e){
    const { index } = e.currentTarget.dataset;
    const images = (this.data.item && this.data.item.images) || [];
    if (!images.length) return;
    const urls = images.map(img => img.url || img);
    wx.previewImage({ current: urls[index || 0], urls });
  },
  onPullDownRefresh(){
    this.fetchDetail();
    this.fetchReplies({ reset: true });
  },
  onReachBottom(){
    this.fetchReplies();
  }
});
