Page({
  data: {
    detail: {
      title: '',
      date: '',
      level: 'low',
      levelText: '',
      region: '',
      paragraphs: []
    }
  },
  onLoad(options){
    const id = Number(options && options.id || 0);
    const d = this.buildDetail(id);
    this.setData({ detail: d });
  },
  buildDetail(id){
    const base = {
      1: {
        title: '北京市发现蜂螨病疫情，加强监控',
        date: '2024-09-08', level: 'high', levelText: '高风险', region: '北京市 朝阳区',
        paragraphs: [
          '近期监测显示，北京市部分蜂场出现蜂螨病阳性样本，已启动针对性监控与防控。',
          '建议：加强蜂具消毒与环境卫生，必要时在专业指导下开展药物防治。',
          '平台将持续跟踪并发布最新进展。'
        ]
      },
      2: {
        title: '山东省蜂群疫情防控工作取得阶段性成果',
        date: '2024-09-07', level: 'medium', levelText: '中风险', region: '山东省 济南市',
        paragraphs: [
          '根据近期检测数据，山东省多地阳性比例有所下降，防控工作取得阶段性成果。',
          '建议：继续保持通风干燥与定期检查，做好病群隔离，避免盗蜂传播。'
        ]
      },
      3: {
        title: '全国蜂群健康检测网络建设稳步推进',
        date: '2024-09-06', level: 'low', levelText: '低风险', region: '全国',
        paragraphs: [
          '全国检测网络覆盖率稳步提升，数据上报与复核机制愈发完善。',
          '后续将联动更多区域站点，优化样品采集、邮寄与结果反馈流程。'
        ]
      }
    };
    return base[id] || {
      title: '疫情通报', date: '', level: 'low', levelText: '低风险', region: '', paragraphs: ['暂无更多信息']
    };
  },
  viewMap(){
    wx.navigateTo({ url: '/packageCharts/pages/epidemic-map/index' });
  },
  onShareAppMessage(){
    const d = this.data.detail || {};
    return { title: d.title || '疫情通报', path: '/pages/epidemic/detail/index' };
  }
});
