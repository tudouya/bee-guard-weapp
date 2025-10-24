const echarts = require('../../ec-canvas/echarts.js');
const epiSvc = require('../../../services/epidemic.js');

const MONTH_LABELS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const LEGEND_PRESET = [
  { key: 'microsporidia', name: '微孢子虫', color: '#F05A5A' },
  { key: 'larva', name: '囊状幼虫病', color: '#65C18C' },
  { key: 'chalkbrood', name: '白垩病', color: '#F9C74F' },
  { key: 'american', name: '美洲幼瘤病', color: '#42A5F5' },
  { key: 'mite', name: '大蜂螨', color: '#8E6CFF' }
];

function resolveMonthLabel(monthValue, explicitLabel) {
  if (explicitLabel) return explicitLabel;
  const numeric = Number(monthValue);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 12) {
    return MONTH_LABELS[numeric - 1];
  }
  if (typeof monthValue === 'string' && monthValue) {
    return monthValue;
  }
  if (typeof monthValue === 'number' && monthValue) {
    return `${monthValue}月`;
  }
  return '未知';
}

function buildLegendContext(legendList = []) {
  const source = Array.isArray(legendList) ? legendList : [];
  const legendItems = source.map((item, idx) => {
    const code = item.code || item.diseaseCode || item.key || '';
    const key = item.key || code || `legend-${idx}`;
    const name = item.name || item.diseaseName || item.label || key;
    const color = item.color || item.displayColor || item.display_color || '';
    return {
      key,
      code: code || undefined,
      name,
      color: color || ''
    };
  }).filter((item) => !!item.name);

  const colorMap = {};
  legendItems.forEach((item) => {
    if (!item.color) {
      const preset = LEGEND_PRESET.find((presetItem) => presetItem.key === item.code || presetItem.key === item.key || presetItem.name === item.name);
      if (preset) {
        item.color = preset.color;
      }
    }
    if (item.color) {
      colorMap[item.key] = item.color;
      if (item.code) colorMap[item.code] = item.color;
      colorMap[item.name] = item.color;
    }
  });

  LEGEND_PRESET.forEach((preset) => {
    if (!colorMap[preset.key]) colorMap[preset.key] = preset.color;
    if (!colorMap[preset.name]) colorMap[preset.name] = preset.color;
  });

  return { legendItems, colorMap };
}

function normalizeSlices(rawSlices = [], colorMap = {}) {
  const slices = Array.isArray(rawSlices) ? rawSlices : [];
  return slices.map((slice, idx) => {
    const code = slice.code || slice.diseaseCode || slice.key || '';
    const key = slice.key || code || `slice-${idx}`;
    const name = slice.name || slice.diseaseName || slice.label || key;
    const valueSource = typeof slice.value === 'number' ? slice.value : (typeof slice.positive === 'number' ? slice.positive : (typeof slice.samples === 'number' ? slice.samples : 0));
    const numericValue = Number(valueSource);
    const value = Number.isFinite(numericValue) ? numericValue : 0;
    const fallbackColor = LEGEND_PRESET[idx % LEGEND_PRESET.length] ? LEGEND_PRESET[idx % LEGEND_PRESET.length].color : '#65C18C';
    const color = slice.color || colorMap[key] || colorMap[code] || colorMap[name] || fallbackColor;
    return {
      key,
      code: code || undefined,
      name,
      color,
      value,
      positive: slice.positive,
      samples: slice.samples,
      rate: slice.rate
    };
  }).filter((slice) => slice.value > 0);
}

Page({
  data: {
    provinces: [],
    counties: [],
    selectedProvinceIndex: 0,
    selectedCountyIndex: 0,
    selectedProvince: null,
    selectedCounty: null,
    regionLoading: false,
    countyLoading: false,
    chartGroups: [],
    legendItems: [],
    loadingCharts: false
  },

  onLoad() {
    this.chartInstances = {};
    this.chartOptions = {};
    this.applyLandscape();
    this.loadInitialRegions();
  },

  onReady() {
    this.pageReady = true;
    this.refreshCharts();
  },

  onShow() {
    this.applyLandscape();
  },

  onUnload() {
    this.disposeCharts();
    this.restorePortrait();
  },

  applyLandscape() {
    if (wx.setScreenOrientation) {
      try {
        wx.setScreenOrientation({ orientation: 'landscape' });
      } catch (err) {
        // ignore devices that do not support programmatic orientation
      }
    }
  },

  restorePortrait() {
    if (wx.setScreenOrientation) {
      try {
        wx.setScreenOrientation({ orientation: 'portrait' });
      } catch (err) {
        // ignore when not supported
      }
    }
  },

  loadInitialRegions() {
    this.setData({ regionLoading: true });
    epiSvc.fetchProvinces().then((provinces = []) => {
      const firstProvince = provinces[0] || null;
      this.setData({
        provinces,
        selectedProvinceIndex: firstProvince ? 0 : -1,
        selectedProvince: firstProvince
      });
      return this.loadCounties(firstProvince && firstProvince.code);
    }).catch((err) => {
      wx.showToast({ title: '省份加载失败', icon: 'none' });
      console.error('load provinces failed', err);
      this.setData({
        provinces: [],
        counties: [],
        selectedProvince: null,
        selectedCounty: null
      });
      this.updateChartGroups();
    }).finally(() => {
      this.setData({ regionLoading: false });
    });
  },

  loadCounties(provinceCode) {
    if (!provinceCode) {
      this.setData({ counties: [], selectedCountyIndex: -1, selectedCounty: null });
      this.updateChartGroups();
      return Promise.resolve([]);
    }

    this.pendingCountyToken = provinceCode;
    this.setData({ countyLoading: true });

    return epiSvc.fetchProvinceDistricts(provinceCode).then((districts = []) => {
      if (this.pendingCountyToken !== provinceCode) {
        return districts;
      }
      const firstCounty = districts[0] || null;
      this.setData({
        counties: districts,
        selectedCountyIndex: firstCounty ? 0 : -1,
        selectedCounty: firstCounty
      });
      this.updateChartGroups();
      return districts;
    }).catch((err) => {
      console.error('load counties failed', err);
      if (this.pendingCountyToken === provinceCode) {
        this.setData({ counties: [], selectedCountyIndex: -1, selectedCounty: null });
        this.updateChartGroups();
      }
      wx.showToast({ title: '区县加载失败', icon: 'none' });
      return [];
    }).finally(() => {
      if (this.pendingCountyToken === provinceCode) {
        this.setData({ countyLoading: false });
      }
    });
  },

  onProvinceChange(event) {
    const index = Number(event.detail.value || 0);
    const province = this.data.provinces[index];
    if (!province) return;
    this.setData({
      selectedProvinceIndex: index,
      selectedProvince: province
    });
    this.loadCounties(province.code);
  },

  onCountyChange(event) {
    const index = Number(event.detail.value || 0);
    const county = this.data.counties[index] || null;
    this.setData({
      selectedCountyIndex: index,
      selectedCounty: county
    });
    this.updateChartGroups();
  },

  updateChartGroups() {
    const { selectedProvince, selectedCounty } = this.data;

    if (!selectedProvince || !selectedProvince.code || !selectedCounty || !selectedCounty.code) {
      this.pendingPieToken = null;
      this.chartOptions = {};
      this.disposeCharts();
      this.setData({
        legendItems: [],
        chartGroups: [],
        loadingCharts: false
      });
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const compareYear = year - 1;
    const requestToken = `${selectedProvince.code}|${selectedCounty.code}|${year}|${compareYear}`;
    this.pendingPieToken = requestToken;

    this.setData({ loadingCharts: true });

    epiSvc.fetchEpidemicPie({
      provinceCode: selectedProvince.code,
      districtCode: selectedCounty.code,
      year,
      compareYear
    }).then((payload) => {
      if (this.pendingPieToken !== requestToken) {
        return;
      }

      const { legendItems: payloadLegendItems, colorMap } = buildLegendContext(payload.legend);
      let legendItems = payloadLegendItems;

      const groupsSource = Array.isArray(payload.groups) ? payload.groups : [];
      const groupsWithEc = groupsSource.map((group, groupIdx) => {
        const rawKey = group.key || group.type || (group.year ? `year-${group.year}` : '');
        const groupKey = rawKey || (groupIdx === 0 ? 'current' : `group-${groupIdx}`);
        const monthsSource = Array.isArray(group.months) ? group.months : [];
        const normalizedMonths = monthsSource.map((month, monthIdx) => {
          const monthValueRaw = month.monthValue || month.month || month.monthNumber || (monthIdx + 1);
          const numericValue = Number(monthValueRaw);
          const monthValue = (!Number.isNaN(numericValue) && numericValue > 0) ? numericValue : (monthIdx + 1);
          const monthLabel = resolveMonthLabel(monthValue, month.monthLabel);
          const chartId = `chart-${groupKey}-${monthValue}-${monthIdx}`;
          const slices = normalizeSlices(month.slices, colorMap);
          const hasData = month.hasData !== undefined ? !!month.hasData : slices.length > 0;
          return {
            chartId,
            monthLabel,
            monthValue,
            hasData,
            slices: hasData ? slices : [],
            ec: hasData ? { lazyLoad: true } : null
          };
        });

        let title = group.title || group.groupLabel || group.label || '';
        if (!title) {
          if (group.year) {
            title = `${group.year}年病害流行图`;
          } else if (group.type === 'previous' || groupKey === 'previous') {
            title = '往年病害流行图';
          } else if (group.type === 'current' || groupKey === 'current') {
            title = '今年病害流行图';
          } else {
            title = groupIdx === 0 ? '今年病害流行图' : '往年病害流行图';
          }
        }

        return {
          key: groupKey,
          title,
          months: normalizedMonths
        };
      }).filter((group) => Array.isArray(group.months) && group.months.length);

      if (!legendItems.length) {
        const derivedMap = new Map();
        groupsWithEc.forEach((group) => {
          group.months.forEach((month) => {
            (month.slices || []).forEach((slice) => {
              if (!derivedMap.has(slice.key)) {
                derivedMap.set(slice.key, {
                  key: slice.key,
                  name: slice.name,
                  color: slice.color
                });
              }
            });
          });
        });
        legendItems = Array.from(derivedMap.values());
      }

      this.chartOptions = {};
      groupsWithEc.forEach((group) => {
        group.months.forEach((month) => {
          this.chartOptions[month.chartId] = month;
        });
      });

      if (!groupsWithEc.length) {
        this.disposeCharts();
      }

      this.setData({
        legendItems,
        chartGroups: groupsWithEc
      }, () => {
        if (this.pendingPieToken === requestToken) {
          this.refreshCharts();
        }
      });
    }).catch((err) => {
      console.error('load pie data failed', err);
      if (this.pendingPieToken === requestToken) {
        wx.showToast({ title: '饼图数据获取失败', icon: 'none' });
        this.chartOptions = {};
        this.disposeCharts();
        this.setData({
          legendItems: [],
          chartGroups: []
        });
      }
    }).finally(() => {
      if (this.pendingPieToken === requestToken) {
        this.setData({ loadingCharts: false });
      }
    });
  },

  refreshCharts() {
    if (!this.pageReady) {
      return;
    }

    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      const optionIds = Object.keys(this.chartOptions || {});
      Object.keys(this.chartInstances || {}).forEach((chartId) => {
        if (optionIds.indexOf(chartId) === -1) {
          const chart = this.chartInstances[chartId];
          if (chart && chart.dispose) {
            try {
              chart.dispose();
            } catch (err) {}
          }
          delete this.chartInstances[chartId];
        }
      });

      optionIds.forEach((chartId) => {
        const month = this.chartOptions[chartId];
        if (!month || !month.hasData) {
          if (this.chartInstances[chartId]) {
            try {
              this.chartInstances[chartId].dispose();
            } catch (err) {}
            delete this.chartInstances[chartId];
          }
          return;
        }

        const component = this.selectComponent(`#${chartId}`);
        if (!component) {
          return;
        }

        if (this.chartInstances[chartId]) {
          const option = this.buildPieOption(month);
          try {
            this.chartInstances[chartId].setOption(option, true);
          } catch (err) {
            console.error('update chart option failed', chartId, err);
          }
          return;
        }

        component.init((canvas, width, height, dpr) => {
          const chart = echarts.init(canvas, null, {
            width,
            height,
            devicePixelRatio: dpr
          });
          canvas.setChart(chart);
          const option = this.buildPieOption(month);
          chart.setOption(option);
          this.chartInstances[chartId] = chart;
          return chart;
        });
      });
    }, 80);
  },

  buildPieOption(month) {
    const data = (month.slices || []).map((slice) => {
      const value = typeof slice.value === 'number' ? slice.value : (typeof slice.positive === 'number' ? slice.positive : 0);
      const item = {
        name: slice.name,
        value
      };
      if (slice.color) {
        item.itemStyle = { color: slice.color };
      }
      return item;
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>数量：{c}<br/>占比：{d}%'
      },
      series: [{
        type: 'pie',
        radius: ['35%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: {
          formatter: '{b}\n{d}%'
        },
        labelLine: {
          length: 12,
          length2: 8
        },
        data
      }]
    };
  },

  disposeCharts() {
    clearTimeout(this.refreshTimer);
    Object.keys(this.chartInstances || {}).forEach((chartId) => {
      const chart = this.chartInstances[chartId];
      if (chart && chart.dispose) {
        try {
          chart.dispose();
        } catch (err) {}
      }
    });
    this.chartInstances = {};
  }
});
