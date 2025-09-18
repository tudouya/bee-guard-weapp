// Small static region dataset for demo (province/city/district)
// Keep minimal footprint for UI stage; replace with backend data later.

const REGION = [
  {
    name: '北京市',
    cities: [
      { name: '北京市', districts: ['东城区', '西城区', '朝阳区', '海淀区'] }
    ]
  },
  {
    name: '浙江省',
    cities: [
      { name: '杭州市', districts: ['上城区', '西湖区', '拱墅区'] },
      { name: '宁波市', districts: ['海曙区', '江北区', '鄞州区'] }
    ]
  },
  {
    name: '四川省',
    cities: [
      { name: '成都市', districts: ['锦江区', '青羊区', '武侯区'] },
      { name: '绵阳市', districts: ['涪城区', '游仙区'] }
    ]
  }
];

function getProvinces() {
  return REGION.map(p => p.name);
}

function getCities(provinceIndex = 0) {
  const p = REGION[provinceIndex] || REGION[0];
  return (p.cities || []).map(c => c.name);
}

function getDistricts(provinceIndex = 0, cityIndex = 0) {
  const p = REGION[provinceIndex] || REGION[0];
  const c = (p.cities || [])[cityIndex] || (p.cities || [])[0];
  return (c && c.districts) ? c.districts : [];
}

function getRegionTriple(provinceIndex = 0, cityIndex = 0) {
  return [getProvinces(), getCities(provinceIndex), getDistricts(provinceIndex, cityIndex)];
}

module.exports = {
  REGION,
  getProvinces,
  getCities,
  getDistricts,
  getRegionTriple
};
