const echarts = require('../../ec-canvas/echarts.js');
const epiSvc = require('../../../services/epidemic.js');

function buildOption(region){
  const categories = ['SBV','IAPV','BQCV','AFB','EFB','微孢子虫','白垩病'];
  // 简单占位：根据区域名哈希出伪随机数，保持切换有差异
  const seed = (region.province+region.city+region.district).split('').reduce((s,c)=>s+c.charCodeAt(0),0);
  const data = categories.map((_,i)=> Math.round((Math.sin(seed+i)+1)*20 + (i%3)*8) );
  return {
    grid: { left: 8, right: 8, top: 18, bottom: 24, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: categories, axisLabel: { interval: 0, rotate: 25 } },
    yAxis: { type: 'value', name: '阳性数' },
    series: [{ type: 'bar', data, itemStyle: { color: '#07c160' } }]
  };
}

Page({
  data: {
    region: { province: '北京市', city: '北京市', district: '东城区' },
    provinces: ['北京市','上海市','山西省','山东省'],
    cities: ['北京市'],
    districts: ['东城区','西城区','朝阳区'],
    loading: false,
    empty: false,
    ec: {
      onInit: function(canvas, width, height, dpr){
        try {
          if (!height || height === 0) { height = 320; }
          const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
          canvas.setChart(chart);
          const opt = buildOption({ province: '北京市', city: '北京市', district: '东城区' });
          chart.setOption(opt);
          // attempt resize after next tick if actual size available
          setTimeout(()=>{
            try {
              const comp = getCurrentPages().slice(-1)[0].selectComponent && getCurrentPages().slice(-1)[0].selectComponent('#dist');
              if (comp && comp.data && comp.data.isUseNewCanvas) {
                const q = wx.createSelectorQuery().in(comp);
                q.select('.ec-canvas').fields({ size: true }).exec(res => {
                  if (res && res[0] && res[0].height) {
                    chart.resize({ width: res[0].width, height: res[0].height });
                  }
                });
              }
            } catch (e) {}
          }, 100);
          return chart;
        } catch (e) {
          
        }
      }
    }
  },
  onReady(){ setTimeout(()=> this.refreshChart(), 120); },
  onProv(e) { const i=Number(e.detail.value||0); const p=this.data.provinces[i]; this.setData({ 'region.province': p }, this.refreshChart); },
  onCity(e) { const i=Number(e.detail.value||0); const c=this.data.cities[i]; this.setData({ 'region.city': c }, this.refreshChart); },
  onDist(e) { const i=Number(e.detail.value||0); const d=this.data.districts[i]; this.setData({ 'region.district': d }, this.refreshChart); },
  refreshChart(){
    const comp = this.selectComponent('#dist');
    if (!comp) { return; }
    this.setData({ loading: true });
    const { province, city, district } = this.data.region;
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    epiSvc.getDistribution({ provinceName: province, cityName: city, districtName: district, month }).then(res => {
      const cats = (res.list||[]).map(x=>x.diseaseName);
      const vals = (res.list||[]).map(x=>x.positive);
      const option = {
        grid: { left: 8, right: 8, top: 18, bottom: 24, containLabel: true },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: cats, axisLabel: { interval: 0, rotate: 25 } },
        yAxis: { type: 'value', name: '阳性数' },
        series: [{ type: 'bar', data: vals, itemStyle: { color: '#07c160' } }]
      };
      try { comp.chart && comp.chart.setOption(option, true); } catch (e) { }
      this.setData({ empty: !res.list || res.list.length === 0 });
    }).catch(()=>{
      wx.showToast({ title: '加载失败', icon: 'none' });
    }).finally(()=>{
      this.setData({ loading: false });
    });
  }
});
