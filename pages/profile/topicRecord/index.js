Page({
  data: {
    typeData: [
      { id: 1, name: '发布记录', checked: true },
      { id: 2, name: '回复记录', checked: false }
    ],
    publicData: [],
    replyData: [],
    id: 1
  },
  onLoad() {
    // 可按需注入占位数据，当前仅展示头部 Tab
  },
  handleChangeType(e) {
    const item = e.currentTarget.dataset.item;
    const typeData = (this.data.typeData || []).map(t => ({ ...t, checked: t.id === item.id }));
    this.setData({ typeData, id: item.id });
  },
  handleDetails(e) {
    wx.showToast({ title: '详情占位', icon: 'none' });
  }
});

