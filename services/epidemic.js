// Epidemic services: areas, distribution and trend (temporary placeholder dataset)

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// minimal area dataset
const AREAS = {
  provinces: [
    { code: '110000', name: '北京市' },
    { code: '310000', name: '上海市' },
    { code: '140000', name: '山西省' },
    { code: '370000', name: '山东省' }
  ],
  cities: {
    '110000': [ { code: '110100', name: '北京市' } ],
    '310000': [ { code: '310100', name: '上海市' } ],
    '140000': [ { code: '140100', name: '太原市' }, { code: '140200', name: '大同市' } ],
    '370000': [ { code: '370100', name: '济南市' }, { code: '370200', name: '青岛市' } ]
  },
  districts: {
    '110100': [ { code: '110101', name: '东城区' }, { code: '110102', name: '西城区' }, { code: '110105', name: '朝阳区' } ],
    '310100': [ { code: '310101', name: '黄浦区' }, { code: '310104', name: '徐汇区' }, { code: '310115', name: '浦东新区' } ],
    '140100': [ { code: '140105', name: '小店区' }, { code: '140106', name: '迎泽区' } ],
    '140200': [ { code: '140212', name: '新荣区' } ],
    '370100': [ { code: '370102', name: '历下区' }, { code: '370104', name: '槐荫区' } ],
    '370200': [ { code: '370202', name: '市南区' }, { code: '370211', name: '黄岛区' } ]
  }
};

function getAreas(parentCode) {
  // no parent => provinces
  if (!parentCode) {
    return delay(150).then(() => AREAS.provinces.slice());
  }
  // province -> cities
  if (AREAS.cities[parentCode]) {
    return delay(150).then(() => AREAS.cities[parentCode].slice());
  }
  // city -> districts
  if (AREAS.districts[parentCode]) {
    return delay(150).then(() => AREAS.districts[parentCode].slice());
  }
  return delay(150).then(() => []);
}

const DISEASES = [
  { code: 'SBV', name: 'SBV' },
  { code: 'IAPV', name: 'IAPV' },
  { code: 'BQCV', name: 'BQCV' },
  { code: 'AFB', name: 'AFB' },
  { code: 'EFB', name: 'EFB' },
  { code: 'NOSEMA', name: '微孢子虫' },
  { code: 'CHALK', name: '白垩病' }
];

function seededRand(seed, i) {
  // simple deterministic pseudo-random based on seed and index
  const x = Math.sin(seed * 9301 + i * 49297) * 233280;
  return x - Math.floor(x);
}

function getDistribution({ provinceName = '', cityName = '', districtName = '', month = '' } = {}) {
  const seedStr = `${provinceName}|${cityName}|${districtName}|${month}`;
  const seed = seedStr.split('').reduce((s, c) => s + c.charCodeAt(0), 0) || 1;
  const list = DISEASES.map((d, idx) => {
    // make AFB/EFB seasonally higher when month in 03-05; NOSEMA in 08-10
    let base = Math.round(seededRand(seed, idx) * 20 + (idx % 3) * 5);
    const m = (month || '').slice(5, 7);
    if (d.code === 'AFB' || d.code === 'EFB') {
      if (['03','04','05'].includes(m)) base += 10;
    }
    if (d.code === 'NOSEMA') {
      if (['08','09','10'].includes(m)) base += 8;
    }
    return { diseaseCode: d.code, diseaseName: d.name, positive: base, samples: base * 6 + 20, rate: base > 0 ? base / (base * 6 + 20) : 0 };
  });
  const totalPositive = list.reduce((s, i) => s + i.positive, 0);
  const totalSamples = list.reduce((s, i) => s + i.samples, 0);
  return delay(250).then(() => ({ list, totalPositive, totalSamples, updatedAt: new Date().toISOString() }));
}

function getTrend({ provinceName = '', cityName = '', districtName = '', diseaseCode = 'AFB', fromMonth = '', toMonth = '' } = {}) {
  const end = toMonth || '2025-01';
  const months = [];
  const parts = end.split('-');
  const baseDate = new Date(Number(parts[0] || 2025), Number(parts[1] || 1) - 1, 1);
  for (let i = 11; i >= 0; i--) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const seedStr = `${provinceName}|${cityName}|${districtName}|${diseaseCode}`;
  const seed = seedStr.split('').reduce((s, c) => s + c.charCodeAt(0), 0) || 1;
  const points = months.map((m, idx) => {
    let v = Math.round(seededRand(seed, idx) * 18 + (idx % 4) * 3);
    if ((diseaseCode === 'AFB' || diseaseCode === 'EFB') && ['03','04','05'].includes(m.slice(5,7))) v += 8;
    if (diseaseCode === 'NOSEMA' && ['08','09','10'].includes(m.slice(5,7))) v += 6;
    return { month: m, positive: v, samples: v * 6 + 15, rate: v > 0 ? v / (v * 6 + 15) : 0 };
  });
  return delay(220).then(() => ({ points, diseaseCode, updatedAt: new Date().toISOString() }));
}

module.exports = {
  getAreas,
  getDistribution,
  getTrend,
  DISEASES
};
