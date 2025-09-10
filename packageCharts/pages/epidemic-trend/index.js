const echarts = require('../../ec-canvas/echarts.js');
const epiSvc = require('../../../services/epidemic.js');

function buildTrendOption(disease){
  const months = [];
  const now = new Date(2025, 0, 1);
  for (let i=11;i>=0;i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const m = d.getMonth()+1; const y = d.getFullYear();
    months.push(`${y}-${String(m).padStart(2,'0')}`);
  }
  const seed = disease.split('').reduce((s,c)=>s+c.charCodeAt(0),0);
  const data = months.map((_,i)=> Math.round((Math.sin(i/3 + seed)+1)*10 + (i%4)*3) );
  return {
    grid: { left: 8, right: 8, top: 18, bottom: 24, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '阳性数' },
    series: [{ type: 'line', data, smooth: true, areaStyle: { opacity: 0.08 }, lineStyle: { color: '#07c160' }, itemStyle: { color: '#07c160' } }]
  };
}

Page({
  data: {
    diseases: ['SBV','IAPV','BQCV','AFB','EFB','微孢子虫','白垩病'],
    currentDisease: 'AFB',
    months: ['2025-01','2024-12','2024-11','2024-10'],
    currentMonth: '2025-01',
    loading: false,
    empty: false,
    ec: {
      onInit: function(canvas, width, height, dpr){
        try {
          if (!height || height === 0) { height = 320; }
          const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
          canvas.setChart(chart);
          const opt = buildTrendOption('AFB');
          chart.setOption(opt);
          setTimeout(()=>{
            try {
              const comp = getCurrentPages().slice(-1)[0].selectComponent && getCurrentPages().slice(-1)[0].selectComponent('#trend');
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
  onDisease(e) { const i=Number(e.detail.value||0); this.setData({ currentDisease: this.data.diseases[i] }, this.refreshChart); },
  onMonth(e) { const i=Number(e.detail.value||0); this.setData({ currentMonth: this.data.months[i] }, this.refreshChart); },
  refreshChart(){
    const comp = this.selectComponent('#trend'); if(!comp){ return; }
    this.setData({ loading: true });
    const diseaseCodeMap = { 'SBV':'SBV','IAPV':'IAPV','BQCV':'BQCV','AFB':'AFB','EFB':'EFB','微孢子虫':'NOSEMA','白垩病':'CHALK' };
    const code = diseaseCodeMap[this.data.currentDisease] || 'AFB';
    const toMonth = this.data.currentMonth;
    epiSvc.getTrend({ diseaseCode: code, toMonth }).then(res => {
      const months = (res.points||[]).map(p=>p.month);
      const vals = (res.points||[]).map(p=>p.positive);
      const option = {
        grid: { left: 8, right: 8, top: 18, bottom: 24, containLabel: true },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: months },
        yAxis: { type: 'value', name: '阳性数' },
        series: [{ type: 'line', data: vals, smooth: true, areaStyle: { opacity: 0.08 }, lineStyle: { color: '#07c160' }, itemStyle: { color: '#07c160' } }]
      };
      try { comp.chart && comp.chart.setOption(option, true); } catch (e) { }
      this.setData({ empty: !res.points || res.points.length === 0 });
    }).catch(()=>{
      wx.showToast({ title: '加载失败', icon: 'none' });
    }).finally(()=>{
      this.setData({ loading: false });
    });
  }
});
