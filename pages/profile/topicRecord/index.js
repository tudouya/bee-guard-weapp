const authUtil = require('../../../utils/auth.js');
const community = require('../../../services/community.js');
const { resolveAsset } = require('../../../utils/assets.js');

const DEFAULT_AVATAR = resolveAsset('/weapp/profile-avatar-default.png');

function normalizeStatus(status) {
  switch (status) {
    case 'approved':
      return { text: '已发布', tone: 'success' };
    case 'pending':
      return { text: '审核中', tone: 'pending' };
    case 'rejected':
      return { text: '已驳回', tone: 'danger' };
    default:
      return { text: '未知', tone: 'pending' };
  }
}

function normalizePost(item) {
  if (!item || typeof item !== 'object') return null;
  const { text, tone } = normalizeStatus(item.status);
  return {
    id: item.id,
    title: item.title || '未命名话题',
    type: item.type || 'question',
    typeName: item.type === 'experience' ? '经验分享' : '蜂农提问',
    statusText: text,
    statusTone: tone,
    rejectReason: item.reject_reason || '',
    likes: Number(item.likes || 0),
    replies: Number(item.replies || 0),
    views: Number(item.views || 0),
    publishedAt: item.published_at || item.created_at || '',
    avatar: DEFAULT_AVATAR
  };
}

Page({
  data: {
    typeData: [
      { id: 1, name: '发布记录', checked: true },
      { id: 2, name: '回复记录', checked: false }
    ],
    publicData: [],
    replyData: [],
    id: 1,
    loading: false,
    error: ''
  },
  onLoad() {
    this.fetchMyPosts();
  },
  onShow() {
    // 目标功能页守卫：未登录则跳登录页
    if (authUtil && authUtil.ensureLogin) {
      authUtil.ensureLogin();
    }
    if (this.data.id === 1) {
      this.fetchMyPosts();
    }
  },
  handleChangeType(e) {
    const item = e.currentTarget.dataset.item;
    const typeData = (this.data.typeData || []).map(t => ({ ...t, checked: t.id === item.id }));
    this.setData({ typeData, id: item.id });
    if (item.id === 1) {
      this.fetchMyPosts();
    }
  },
  handleDetails(e) {
    const id = e.currentTarget.dataset.id;
    const dataset = e.currentTarget.dataset.item;
    if (!id || !dataset) {
      wx.showToast({ title: '无法打开详情', icon: 'none' });
      return;
    }
    const type = dataset.type || 'question';
    const url = type === 'experience'
      ? `/packageCommunity/pages/share-detail/index?id=${id}`
      : `/packageCommunity/pages/qa-detail/index?id=${id}`;
    wx.navigateTo({ url });
  },
  onPullDownRefresh(){
    if (this.data.id === 1) {
      this.fetchMyPosts();
    } else {
      wx.stopPullDownRefresh();
    }
  },
  async fetchMyPosts(){
    if (!authUtil || !authUtil.isLoggedIn || !authUtil.isLoggedIn()) {
      this.setData({ publicData: [], loading: false, error: '' });
      wx.stopPullDownRefresh();
      return;
    }
    this.setData({ loading: true, error: '' });
    try {
      const { list } = await community.listMyPosts();
      const mapped = (list || []).map((item) => normalizePost(item)).filter(Boolean);
      this.setData({ publicData: mapped });
    } catch (err) {
      const msg = err && err.message ? err.message : '加载失败';
      this.setData({ error: msg });
      wx.showToast({ title: msg, icon: 'none' });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  }
});
