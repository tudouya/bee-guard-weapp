// Product recommendation service (mock implementation for UI polishing)
// TODO: Replace with real API integration once backend endpoints are ready.

const MOCK_PRODUCTS = [
  {
    id: 'PROD-001',
    name: '蜂卫士防疫组合包',
    subtitle: '针对 SBV/AFB 监测和应急处理的一站式方案',
    banner: 'https://dtm123.com:7803/targets/image/images/004.png',
    recommendedFor: ['囊状幼虫病 (SBV)', '美洲幼虫腐臭病 (AFB)'],
    source: 'enterprise',
    sourceLabel: '蜂卫士生物科技',
    enterprise: {
      name: '蜂卫士生物科技',
      phone: '400-800-8123',
      wechat: 'BeeGuard-Service',
      link: 'https://www.beeguard-lab.com'
    },
    priceRange: '¥699 - ¥899 / 套',
    tags: ['企业合作', '24h 快速响应', '驻场指导'],
    highlights: [
      '包含 2 次核酸检测 + 1 次现场消杀指导',
      '附赠蜂群健康评估报告及复检券'
    ],
    composition: ['核酸快检试剂 2 份', '蜂具消杀套件 1 份', '蜂群复健营养包 3 袋'],
    usageSteps: [
      { title: '提交检测', detail: '预约检测服务，寄送样品并上传蜂场信息。' },
      { title: '接收方案', detail: '根据检测结果获取防控方案与指导手册。' },
      { title: '驻场服务', detail: '专家可预约视频或实地驻场，指导执行方案。' }
    ],
    notice: [
      '套餐内含检测服务，请确保提供的样品符合采样指引。',
      '如需开具发票，请在下单时备注企业抬头。'
    ],
    faq: [
      { q: '套餐是否包含检测邮寄费用？', a: '首检包含顺丰到付，复检样品需自理快递费用。' },
      { q: '驻场服务如何预约？', a: '支付成功后工作人员将在 24 小时内联系安排，如有紧急情况可致电客服。' }
    ]
  },
  {
    id: 'PROD-002',
    name: '蜜康蜂产品品质检测包',
    subtitle: '支持蜂蜜、蜂蜜膏等多品类品质检测与安全评估',
    banner: 'https://dtm123.com:7803/targets/image/images/013.png',
    recommendedFor: ['蜂产品品质检测', '出厂批次复检'],
    source: 'enterprise',
    sourceLabel: '蜜康检测中心',
    enterprise: {
      name: '蜜康检测中心',
      phone: '010-6666-9001',
      wechat: 'MikangLab',
      link: 'https://www.mikang-lab.com'
    },
    priceRange: '¥399 起 / 批次',
    tags: ['CNAS 实验室', '产品溯源'],
    highlights: [
      '支持重金属、农残、营养成分 30+ 项指标检测',
      '检测报告提供电子版与纸质盖章版本'
    ],
    composition: ['样品采集说明 1 份', '冷链邮寄包材 1 套', '专业检测报告 1 份'],
    usageSteps: [
      { title: '下单并获取采样包', detail: '确认品类后将于 1-2 天内寄出采样包。' },
      { title: '回寄样品', detail: '按说明采集样品并使用冷链包材回寄至实验室。' },
      { title: '获取报告', detail: '5-7 个工作日内生成检测报告并提供解读服务。' }
    ],
    notice: ['样品需保持低温运输，建议使用顺丰冷运。', '如需多个批次检测，可联系客服获取优惠报价。'],
    faq: [{ q: '报告是否具有法律效力？', a: '蜜康检测中心具备 CNAS 资质，报告可用于市场抽检与合作证明。' }]
  },
  {
    id: 'PROD-003',
    name: '蜂盾智慧守护 SaaS',
    subtitle: '蜂场数字化监测平台，实时掌握蜂群健康',
    banner: 'https://dtm123.com:7803/targets/image/images/015.png',
    recommendedFor: ['蜂场数字化管理', '蜂群活力监测'],
    source: 'enterprise',
    sourceLabel: '蜂盾科技',
    enterprise: {
      name: '蜂盾科技',
      phone: '0755-8672-2210',
      wechat: 'HiveShield-Tech',
      link: 'https://www.hiveshield.com'
    },
    priceRange: '¥1299 / 套起',
    tags: ['硬件+SaaS', '7×24 远程预警'],
    highlights: ['实时监测温湿度、蜂群活力指数', '异常自动推送短信 + 小程序通知'],
    composition: ['智能蜂箱监测设备 1 套', '云端监测平台账号 1 个', '季度数据分析报告'],
    usageSteps: [
      { title: '部署设备', detail: '预约工程师上门安装或远程指导部署。' },
      { title: '绑定平台', detail: '小程序扫码绑定设备，实时查看蜂群状态。' },
      { title: '分析优化', detail: '每季度提供蜂群健康分析报告，给出管理建议。' }
    ],
    notice: ['设备需通电与 4G 信号覆盖。', '支持与检测结果联动，提供防控提醒。'],
    faq: [{ q: '是否支持多蜂场管理？', a: '支持，一个账号可管理多个蜂场并统一监控。' }]
  },
  {
    id: 'PROD-004',
    name: '平台推荐 | 蜂场基础消杀套包',
    subtitle: '平台精选消毒剂与工具包，适用于蜂场日常消杀',
    banner: 'https://dtm123.com:7803/targets/image/images/010.png',
    recommendedFor: ['蜂具消毒', '蜂场日常保洁'],
    source: 'platform',
    sourceLabel: '蜜蜂疫病监控平台',
    enterprise: null,
    priceRange: '¥169 / 套',
    tags: ['平台推荐', '高性价比'],
    highlights: ['含低温消毒剂、喷雾器、一次性手套等常规工具', '附赠蜂具消杀操作指引'],
    composition: ['多功能喷雾器 1 个', '低温消毒剂 2 瓶', '一次性手套 10 副', '防护口罩 5 个'],
    usageSteps: [
      { title: '准备工具', detail: '按指引准备好防护用品与消毒剂。' },
      { title: '分区消杀', detail: '对蜂箱、蜂具、采蜜室等区域分区处理。' },
      { title: '复查', detail: '消杀后 24 小时复查蜂群状态，必要时重复处理。' }
    ],
    notice: ['消毒剂需按比例稀释后使用。', '操作时保持蜂场通风良好。'],
    faq: [{ q: '消毒剂是否对蜂有刺激？', a: '按比例稀释后刺激性低，仍建议在无蜂时段操作。' }]
  }
];

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function listRecommendedProducts({ page = 1, per_page = 10, scene, source } = {}) {
  let list = MOCK_PRODUCTS.slice();
  if (source && ['enterprise', 'platform'].includes(source)) {
    list = list.filter(item => item.source === source);
  }
  if (scene) {
    const keyword = String(scene).toLowerCase();
    list = list.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.subtitle.toLowerCase().includes(keyword) ||
      (item.recommendedFor || []).some(text => String(text).toLowerCase().includes(keyword))
    );
  }
  const start = (page - 1) * per_page;
  const end = start + per_page;
  const sliced = list.slice(start, end).map(clone);
  return Promise.resolve({
    list: sliced,
    meta: {
      total: list.length,
      page,
      per_page,
      has_more: end < list.length
    }
  });
}

function getProductDetail(id) {
  if (!id) return Promise.reject(new Error('缺少产品 ID'));
  const found = MOCK_PRODUCTS.find(item => item.id === id);
  if (!found) return Promise.reject(new Error('未找到产品信息'));
  return Promise.resolve(clone(found));
}

module.exports = {
  listRecommendedProducts,
  getProductDetail
};

