Page({
  data: {
    item: { title: '问题详情', author: '蜂友', date: '—', desc: '—', status: 'pending', suggest: '' }
  },
  onLoad(options) {
    const id = options && options.id || '1';
    // mock 一条数据
    const item = {
      title: id === '2' ? '疑似AFB，如何快速排查？' : '春季群势下降如何处理？',
      author: id === '2' ? '蜂友B' : '蜂友A',
      date: '2025-01-06',
      desc: '上传了图片并描述了群势变化，求助如何处理。',
      status: id === '2' ? 'approved' : 'pending',
      suggest: id === '2' ? '建议先进行病原检测，保持干燥，严格隔离疑似病群。' : ''
    };
    this.setData({ item });
  }
});

