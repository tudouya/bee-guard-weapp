// Enterprise service (mock implementation for UI polishing)
// TODO: Replace mock data with real API integration when backend is ready.

const MOCK_ENTERPRISES = [
  {
    id: 'ENT-001',
    name: '蜂卫士生物科技',
    logo: '/images/home-feature-detection.png',
    summary: '核心业务涵盖蜂群疫病检测、病原基因测序、疫病应急防控培训，已与全国 86 家蜂场建立长期合作。',
    coverage: '覆盖 12 省，68 家示范蜂场',
    tags: ['国家级合作实验室', '24h 快速出报告', '技术团队 30+ 成员'],
    services: [
      { title: '蜂病快检', desc: '现场采样 24 小时内出具初检报告，并跟进复检服务。' },
      { title: '防控方案定制', desc: '根据检测结果制定差异化防控策略，支持实地驻场。' }
    ],
    highlights: [
      '2023 年农业农村部蜂产业示范单位',
      '蜂群健康指数模型入选省级科技成果'
    ],
    certifications: ['蜂业协会认证合作伙伴', 'ISO9001 质量体系认证'],
    contact: {
      manager: '李工',
      phone: '400-800-8123',
      wechat: 'BeeGuard-Service',
      link: 'https://www.beeguard-lab.com'
    }
  },
  {
    id: 'ENT-002',
    name: '蜜康检测中心',
    logo: '/images/home-feature-epidemic.png',
    summary: '专注于蜂产品质量与疫病监测，提供从样品采集、分子检测到溯源追踪的全流程服务。',
    coverage: '全国 5 大区域联合实验室',
    tags: ['蜂产品溯源', '国家高新技术企业'],
    services: [
      { title: '蜂产品品质检测', desc: '针对蜂蜜、蜂胶等产品提供重金属、农残、营养成分检测。' },
      { title: '疫病追踪溯源', desc: '建立疫病传播链条，提供可视化风险分析报告。' }
    ],
    highlights: [
      '已帮助 200+ 蜂农建立质量档案',
      '提供线上检测报告与预警订阅'
    ],
    certifications: ['CNAS 国家实验室认可', '蜂业协会推荐机构'],
    contact: {
      manager: '周老师',
      phone: '010-6666-9001',
      wechat: 'MikangLab',
      link: 'https://www.mikang-lab.com'
    }
  },
  {
    id: 'ENT-003',
    name: '蜂盾科技',
    logo: '/images/home-feature-knowledge.png',
    summary: '提供数字化疫病监测设备、云端监测平台以及驻场服务，支持蜂场智能化管理。',
    coverage: '全国 30+ 重点蜂业园区',
    tags: ['数字化监测', '硬件+SaaS 一体化'],
    services: [
      { title: '智能蜂箱监测', desc: '部署传感器实时采集蜂群温湿度、活动强度，异常自动预警。' },
      { title: '疫病数据分析', desc: '结合历史检测结果给出疫病趋势预测与干预建议。' }
    ],
    highlights: [
      '合作蜂场平均减少 32% 疫病爆发',
      '提供 7×24 小时远程值守服务'
    ],
    certifications: ['高新技术企业', '软件著作权 6 项'],
    contact: {
      manager: '陈经理',
      phone: '0755-8672-2210',
      wechat: 'HiveShield-Tech',
      link: 'https://www.hiveshield.com'
    }
  }
];

function paginate(list, { page = 1, per_page = 10 } = {}) {
  const start = (page - 1) * per_page;
  const end = start + per_page;
  const sliced = list.slice(start, end);
  return {
    list: sliced,
    meta: {
      total: list.length,
      page,
      per_page,
      has_more: end < list.length
    }
  };
}

function listFeaturedEnterprises(options = {}) {
  return Promise.resolve(paginate(MOCK_ENTERPRISES, options));
}

function getEnterpriseDetail(id) {
  if (!id) {
    return Promise.reject(new Error('缺少企业 ID'));
  }
  const found = MOCK_ENTERPRISES.find((item) => item.id === id);
  if (!found) {
    return Promise.reject(new Error('未找到企业信息'));
  }
  return Promise.resolve(found);
}

module.exports = {
  listFeaturedEnterprises,
  getEnterpriseDetail
};
