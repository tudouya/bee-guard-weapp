// Mock results service

function demoData() {
  // 3条示例数据，覆盖不同状态
  return [
    {
      id: 1,
      detectionId: 'BG20251001', // 企业赠送
      sampleId: 'SP20252001',
      submitTime: '2025-01-12 10:30',
      status: 'completed',
      statusText: '检测完成',
      diseases: [
        { name: 'SBV 囊状幼虫病', result: '阴性' },
        { name: 'AFB 美洲幼虫腐臭病', result: '阳性' },
        { name: 'EFB 欧洲幼虫腐臭病', result: '阴性' }
      ],
      preventionBrief: '建议：隔离感染群，遵医嘱用药，保持干燥清洁。',
      sponsorType: 'enterprise',
      enterpriseId: 'ent-11',
      recommendation: {
        source: 'enterprise',
        productName: '蜂康宝抗病毒剂',
        brief: '企业推荐：针对AFB，安全高效',
        targetType: 'internal',
        productId: 'ent-101',
        url: ''
      },
      recommendations: [
        { source: 'enterprise', productName: '蜂康宝抗病毒剂', brief: '针对AFB，安全高效', targetType: 'internal', productId: 'ent-101', url: '' },
        { source: 'enterprise', productName: '蜂巢清洁剂', brief: '清洁蜂具，减少病原残留', targetType: 'internal', productId: 'ent-102', url: '' }
      ]
    },
    {
      id: 2,
      detectionId: 'ZF20251002', // 自费检测
      sampleId: 'SP20252002',
      submitTime: '2025-01-15 14:20',
      status: 'processing',
      statusText: '检测中',
      diseases: [
        { name: 'SBV 囊状幼虫病', result: '阴性' },
        { name: 'AFB 美洲幼虫腐臭病', result: '阴性' }
      ],
      preventionBrief: '建议：保持通风干燥，观察群势变化。',
      sponsorType: 'self',
      enterpriseId: '',
      recommendation: {
        source: 'platform',
        productName: '蜂群健康营养液',
        brief: '平台推荐：提升免疫力，预防疾病',
        targetType: 'external',
        productId: '',
        url: 'https://example.com/mall/product/bee-nutrition'
      },
      recommendations: [
        { source: 'platform', productName: '蜂群健康营养液', brief: '提升免疫力，预防疾病', targetType: 'external', productId: '', url: 'https://example.com/mall/product/bee-nutrition' },
        { source: 'platform', productName: '蜂具消毒喷雾', brief: '便捷消杀，保障卫生', targetType: 'external', productId: '', url: 'https://example.com/mall/product/bee-sanitize' }
      ]
    },
    {
      id: 3,
      detectionId: 'ZF20251003', // 自费检测
      sampleId: 'SP20252003',
      submitTime: '2025-01-18 09:05',
      status: 'pending',
      statusText: '待邮寄',
      diseases: [],
      preventionBrief: '请尽快按说明邮寄样品，以免影响检测进度。',
      sponsorType: 'self',
      enterpriseId: '',
      recommendation: {
        source: 'platform',
        productName: '蜂具消毒喷雾',
        brief: '平台推荐：便捷消杀，保障卫生',
        targetType: 'external',
        productId: '',
        url: 'https://example.com/mall/product/bee-sanitize'
      },
      recommendations: [
        { source: 'platform', productName: '蜂具消毒喷雾', brief: '便捷消杀，保障卫生', targetType: 'external', productId: '', url: 'https://example.com/mall/product/bee-sanitize' },
        { source: 'platform', productName: '包装密封袋', brief: '密封防泄露，便于邮寄', targetType: 'external', productId: '', url: 'https://example.com/mall/product/bee-bag' }
      ]
    }
  ];
}

function getResults({ page = 1, pageSize = 10 } = {}) {
  const demo = demoData();
  const total = demo.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const list = demo.slice(start, end);
  return new Promise((resolve) => setTimeout(() => resolve({ list, total }), 300));
}

function getDetail(id) {
  const demo = demoData();
  const item = demo.find(x => String(x.id) === String(id)) || null;
  return new Promise((resolve) => setTimeout(() => resolve(item), 200));
}

module.exports = {
  getResults,
  getDetail
};
