Page({
  data: {
    item: { title: '问题详情', author: '蜂友', date: '—', desc: '—', views: 0, suggest: '' },
    replies: []
  },
  onLoad(options) {
    const id = options && options.id || '1';
    // mock 一条数据
    const long = '还是这离蜂，蜂群小，脾里没子、没蜜、没粉，现在外面也没有什么蜜源，但是啊，也没有什么蜜源，这离蜂真是愁人。' +
      '最近气温忽高忽低，白天温差也大，担心影响群势。请大家帮忙看看需要从饲喂、保温还是病原检测入手？先谢过各位老师。';
    const item = {
      title: id === '2' ? '疑似AFB，如何快速排查？' : '春季群势下降如何处理？',
      author: id === '2' ? '蜂友B' : '蜂友A',
      date: '2025-01-06',
      desc: long,
      views: 12,
      suggest: id === '2' ? '建议先进行病原检测，保持干燥，严格隔离疑似病群。' : ''
    };
    const replies = [
      { author: '顾念', date: '2025-01-07', text: '本人钥匙丢失在大榕树餐厅一楼，捡到请联系我，重谢！', children: [ { author: '小竹吟风', text: '没有看到' } ] },
      { author: '喜洋洋', date: '2025-01-07', text: '建议先观察 2 天，必要时加热保温，补粉补蜜。', children: [ { author: '星', text: '同意，注意通风，避免潮湿。' } ] },
      { author: '蜂友C', date: '2025-01-08', text: '我遇到过类似情况，按流程做检测后对症处理就好了。' }
    ];
    this.setData({ item, replies });
  }
});
