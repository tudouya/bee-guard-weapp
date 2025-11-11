const echarts = require('../../ec-canvas/echarts.js');
const epiSvc = require('../../../services/epidemic.js');
const knowledgeSvc = require('../../../services/knowledge.js');

const MONTH_LABELS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const LEGEND_PRESET = [
  { key: 'microsporidia', name: '微孢子虫', color: '#F05A5A' },
  { key: 'larva', name: '囊状幼虫病', color: '#65C18C' },
  { key: 'chalkbrood', name: '白垩病', color: '#F9C74F' },
  { key: 'american', name: '美洲幼瘤病', color: '#42A5F5' },
  { key: 'mite', name: '大蜂螨', color: '#8E6CFF' }
];

const DEFAULT_YEAR = 2025;
const YEAR_RANGE = 5;
const CURRENT_MONTH = new Date().getMonth() + 1;

function buildYearOptions(centerYear = DEFAULT_YEAR, span = YEAR_RANGE) {
  const list = [];
  const start = centerYear - span;
  const end = centerYear + span;
  for (let year = start; year <= end; year += 1) {
    list.push({
      key: `year-${year}`,
      year,
      label: `${year}年`
    });
  }
  return list;
}

const PREDEFINED_YEAR_OPTIONS = buildYearOptions();
const DEFAULT_YEAR_OPTION_INDEX_RAW = PREDEFINED_YEAR_OPTIONS.findIndex((item) => item.year === DEFAULT_YEAR);
const DEFAULT_YEAR_OPTION_INDEX = DEFAULT_YEAR_OPTION_INDEX_RAW !== -1 ? DEFAULT_YEAR_OPTION_INDEX_RAW : 0;
const DEFAULT_YEAR_OPTION = PREDEFINED_YEAR_OPTIONS[DEFAULT_YEAR_OPTION_INDEX] || null;

function buildMonthOptions(availableMonths = []) {
  return MONTH_LABELS.map((label, idx) => {
    const monthValue = idx + 1;
    return {
      key: `month-${monthValue}`,
      label,
      monthValue,
      rawMonthValue: monthValue,
      hasData: availableMonths.includes(monthValue)
    };
  });
}

const INITIAL_MONTH_STATE = (() => {
  const options = buildMonthOptions();
  const defaultIndex = Math.min(Math.max(CURRENT_MONTH - 1, 0), options.length - 1);
  return {
    options,
    defaultIndex,
    selected: options[defaultIndex] || null,
    defaultValue: options[defaultIndex]?.monthValue || 1,
  };
})();
const DEFAULT_MONTH_VALUE = INITIAL_MONTH_STATE.defaultValue;

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
    const resolvedName = item.name || item.diseaseName || '';
    const label = item.label || item.codeLabel || code || key;
    const name = resolvedName || label || key;
    const color = item.color || item.displayColor || item.display_color || '';
    return {
      key,
      code: code || undefined,
      name,
      label: label || undefined,
      color: color || ''
    };
  }).filter((item) => !!item.name || !!item.label);

  const colorMap = {};
  legendItems.forEach((item) => {
    if (!item.color) {
      const preset = LEGEND_PRESET.find((presetItem) => (
        presetItem.key === item.code
        || presetItem.key === item.key
        || presetItem.key === item.label
        || presetItem.name === item.name
      ));
      if (preset) {
        item.color = preset.color;
      }
    }
    if (item.color) {
      colorMap[item.key] = item.color;
      if (item.code) colorMap[item.code] = item.color;
      if (item.label) colorMap[item.label] = item.color;
      if (item.name) colorMap[item.name] = item.color;
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
    const rawName = slice.name || slice.diseaseName || '';
    const label = slice.label || slice.codeLabel || code || key;
    const name = rawName || label || key;
    const valueSource = typeof slice.value === 'number' ? slice.value : (typeof slice.positive === 'number' ? slice.positive : (typeof slice.samples === 'number' ? slice.samples : 0));
    const numericValue = Number(valueSource);
    const value = Number.isFinite(numericValue) ? numericValue : 0;
    const fallbackColor = LEGEND_PRESET[idx % LEGEND_PRESET.length] ? LEGEND_PRESET[idx % LEGEND_PRESET.length].color : '#65C18C';
    const color = slice.color || colorMap[key] || colorMap[code] || colorMap[label] || colorMap[name] || fallbackColor;
    return {
      key,
      code: code || undefined,
      name,
      label: label || undefined,
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
    cities: [],
    counties: [],
    selectedProvinceIndex: 0,
    selectedCityIndex: 0,
    selectedCountyIndex: 0,
    selectedProvince: null,
    selectedCity: null,
    selectedCounty: null,
    regionLoading: false,
    cityLoading: false,
    countyLoading: false,
    yearOptions: PREDEFINED_YEAR_OPTIONS,
    selectedYearIndex: DEFAULT_YEAR_OPTION_INDEX,
    selectedYear: DEFAULT_YEAR_OPTION,
    monthOptions: INITIAL_MONTH_STATE.options,
    selectedMonthIndex: INITIAL_MONTH_STATE.defaultIndex,
    selectedMonth: INITIAL_MONTH_STATE.selected,
    displayCharts: [],
    legendItems: [],
    loadingCharts: false,
    diseaseMappings: [],
    diseaseMappingLoading: false,
    diseaseMappingError: '',
    showDiseaseMapping: false
  },

  onLoad() {
    this.chartInstances = {};
    this.chartOptions = {};
    this.allPieGroups = [];
    this.availableMonths = [];
    this.loadInitialRegions();
    this.loadDiseaseMappings();
  },

  onReady() {
    this.pageReady = true;
    this.refreshCharts();
  },

  onUnload() {
    this.disposeCharts();
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
      return this.loadCities(firstProvince && firstProvince.code);
    }).catch((err) => {
      wx.showToast({ title: '省份加载失败', icon: 'none' });
      console.error('load provinces failed', err);
      this.setData({
        provinces: [],
        cities: [],
        counties: [],
        selectedProvince: null,
        selectedCity: null,
        selectedCounty: null
      });
      this.updateChartGroups({ preserveMonthSelection: false });
    }).finally(() => {
      this.setData({ regionLoading: false });
    });
  },

  loadCities(provinceCode) {
    if (!provinceCode) {
      this.setData({
        cities: [],
        counties: [],
        selectedCity: null,
        selectedCityIndex: -1,
        selectedCounty: null,
        selectedCountyIndex: -1,
        cityLoading: false,
        countyLoading: false
      });
      this.updateChartGroups({ preserveMonthSelection: false });
      return Promise.resolve([]);
    }

    this.pendingCityToken = provinceCode;
    this.setData({ cityLoading: true });

    return epiSvc.fetchProvinceCities(provinceCode).then((cities = []) => {
      if (this.pendingCityToken !== provinceCode) {
        return cities;
      }

      const firstCity = cities[0] || null;
      this.setData({
        cities,
        selectedCityIndex: firstCity ? 0 : -1,
        selectedCity: firstCity
      });

      return this.loadCounties(firstCity && firstCity.code);
    }).catch((err) => {
      console.error('load cities failed', err);
      if (this.pendingCityToken === provinceCode) {
        this.setData({
          cities: [],
          counties: [],
          selectedCity: null,
          selectedCityIndex: -1,
          selectedCounty: null,
          selectedCountyIndex: -1,
          countyLoading: false
        });
        this.updateChartGroups({ preserveMonthSelection: false });
      }
      wx.showToast({ title: '城市加载失败', icon: 'none' });
      return [];
    }).finally(() => {
      if (this.pendingCityToken === provinceCode) {
        this.setData({ cityLoading: false });
      }
    });
  },

  loadCounties(cityCode) {
    if (!cityCode) {
      this.setData({ counties: [], selectedCountyIndex: -1, selectedCounty: null, countyLoading: false });
      this.updateChartGroups({ preserveMonthSelection: false });
      return Promise.resolve([]);
    }

    this.pendingCountyToken = cityCode;
    this.setData({ countyLoading: true });

    return epiSvc.fetchCityDistricts(cityCode).then((districts = []) => {
      if (this.pendingCountyToken !== cityCode) {
        return districts;
      }
      const firstCounty = districts[0] || null;
      this.setData({
        counties: districts,
        selectedCountyIndex: firstCounty ? 0 : -1,
        selectedCounty: firstCounty
      });
      this.updateChartGroups({ preserveMonthSelection: false });
      return districts;
    }).catch((err) => {
      console.error('load counties failed', err);
      if (this.pendingCountyToken === cityCode) {
        this.setData({ counties: [], selectedCountyIndex: -1, selectedCounty: null });
        this.updateChartGroups({ preserveMonthSelection: false });
      }
      wx.showToast({ title: '区县加载失败', icon: 'none' });
      return [];
    }).finally(() => {
      if (this.pendingCountyToken === cityCode) {
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
      selectedProvince: province,
      cities: [],
      selectedCity: null,
      selectedCityIndex: -1,
      counties: [],
      selectedCounty: null,
      selectedCountyIndex: -1
    });
    this.loadCities(province.code);
  },

  onCityChange(event) {
    const index = Number(event.detail.value || 0);
    const city = this.data.cities[index];
    if (!city) return;
    this.setData({
      selectedCityIndex: index,
      selectedCity: city,
      counties: [],
      selectedCounty: null,
      selectedCountyIndex: -1
    });
    this.loadCounties(city.code);
  },

  onCountyChange(event) {
    const index = Number(event.detail.value || 0);
    const county = this.data.counties[index] || null;
    this.setData({
      selectedCountyIndex: index,
      selectedCounty: county
    });
    this.updateChartGroups({ preserveMonthSelection: false });
  },

  onYearChange(event) {
    const index = Number(event.detail.value || 0);
    const option = this.data.yearOptions[index] || null;
    const fallbackIndex = option ? index : DEFAULT_YEAR_OPTION_INDEX;
    const fallbackOption = option || this.data.yearOptions[fallbackIndex] || DEFAULT_YEAR_OPTION;
    this.setData({
      selectedYearIndex: fallbackIndex,
      selectedYear: fallbackOption
    }, () => {
      this.updateChartGroups({ preserveMonthSelection: true });
    });
  },

  onMonthChange(event) {
    const index = Number(event.detail.value || 0);
    const option = this.data.monthOptions[index] || null;
    if (!option) {
      return;
    }
    this.setData({
      selectedMonthIndex: index,
      selectedMonth: option
    }, () => {
      this.updateChartGroups({ preserveMonthSelection: true });
    });
  },

  resolveSelectedMonthValue() {
    const { selectedMonth } = this.data;
    if (selectedMonth && selectedMonth.monthValue !== undefined) {
      const numeric = Number(selectedMonth.monthValue);
      if (!Number.isNaN(numeric)) {
        return numeric;
      }
    }
    if (selectedMonth && selectedMonth.rawMonthValue !== undefined) {
      const numeric = Number(selectedMonth.rawMonthValue);
      if (!Number.isNaN(numeric)) {
        return numeric;
      }
    }
    return null;
  },

  buildMonthStateFromAvailability(availableMonths = [], fallbackValue = null) {
    const normalized = Array.isArray(availableMonths)
      ? availableMonths.map((value) => Number(value)).filter((value) => Number.isFinite(value))
      : [];
    const options = buildMonthOptions(normalized);
    const preferredValue = fallbackValue ?? this.resolveSelectedMonthValue() ?? DEFAULT_MONTH_VALUE;
    let nextIndex = options.findIndex((option) => option.monthValue === preferredValue);
    if (nextIndex === -1 && options.length) {
      nextIndex = 0;
    }
    return {
      monthOptions: options,
      selectedMonthIndex: nextIndex,
      selectedMonth: nextIndex !== -1 ? options[nextIndex] : null,
    };
  },

  applySelectedPeriod() {
    const { selectedYear, selectedMonth } = this.data;

    if (!selectedYear || !selectedMonth) {
      this.clearChartDisplay();
      return;
    }

    const normalizeMonthValue = (value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : String(value);
    };

    let resolvedYear = Number.isFinite(selectedYear.year) ? selectedYear.year : Number(selectedYear.year);
    if (!Number.isFinite(resolvedYear) && selectedYear.groupKey) {
      const matchedGroup = (this.allPieGroups || []).find((group) => group.key === selectedYear.groupKey);
      if (matchedGroup && Number.isFinite(matchedGroup.yearNumber)) {
        resolvedYear = matchedGroup.yearNumber;
      }
    }

    const normalizedMonthValue = normalizeMonthValue(selectedMonth.monthValue ?? selectedMonth.rawMonthValue);

    if (!Number.isFinite(resolvedYear) || normalizedMonthValue === undefined || normalizedMonthValue === null) {
      this.clearChartDisplay();
      return;
    }

    const compareYear = resolvedYear - 1;

    const numericMonthValue = Number(normalizedMonthValue);
    const monthDisplayText = Number.isFinite(numericMonthValue)
      ? `${numericMonthValue}月`
      : resolveMonthLabel(normalizedMonthValue, selectedMonth.label);

    let currentGroup = this.findGroupByYear(resolvedYear);
    if (!currentGroup && selectedYear.groupKey) {
      currentGroup = (this.allPieGroups || []).find((group) => group.key === selectedYear.groupKey) || null;
    }
    let previousGroup = this.findGroupByYear(compareYear);
    if (!previousGroup) {
      previousGroup = (this.allPieGroups || []).find((group) => group.isPrevious) || null;
    }

    const chartOptions = {};
    const displayCharts = [];

    const buildChartEntry = (group, year, role, subtitle) => {
      const monthEntry = group && Array.isArray(group.months)
        ? group.months.find((item) => normalizeMonthValue(item.monthValue) === normalizedMonthValue)
        : null;
      const hasData = !!(monthEntry && monthEntry.hasData);
      const slices = hasData ? (monthEntry.slices || []) : [];
      const chartYear = Number.isFinite(year) ? year : null;
      const chartId = `pie-${role}-${chartYear !== null ? chartYear : 'na'}-${normalizedMonthValue}`;

      displayCharts.push({
        chartId,
        title: chartYear !== null ? `${chartYear}年${monthDisplayText}` : monthDisplayText,
        subtitle,
        hasData,
        ec: hasData ? { lazyLoad: true } : null
      });

      chartOptions[chartId] = {
        chartId,
        hasData,
        slices
      };
    };

    const currentYearForDisplay = currentGroup && Number.isFinite(currentGroup.yearNumber) ? currentGroup.yearNumber : resolvedYear;
    const previousYearForDisplay = previousGroup && Number.isFinite(previousGroup.yearNumber) ? previousGroup.yearNumber : compareYear;

    buildChartEntry(currentGroup, currentYearForDisplay, 'current', '当前月份');
    buildChartEntry(previousGroup, previousYearForDisplay, 'previous', '上一年同期');

    const hasChartData = displayCharts.some((chart) => chart.hasData);
    this.chartOptions = chartOptions;
    this.setData({
      displayCharts,
      showDiseaseMapping: hasChartData
    }, () => {
      this.refreshCharts();
    });
  },

  findGroupByYear(year) {
    if (!Number.isFinite(year)) {
      return null;
    }
    return (this.allPieGroups || []).find((group) => Number.isFinite(group.yearNumber) && group.yearNumber === year) || null;
  },

  ensureYearSelection() {
    let { yearOptions, selectedYear, selectedYearIndex } = this.data;
    const optionsList = Array.isArray(yearOptions) && yearOptions.length ? yearOptions : PREDEFINED_YEAR_OPTIONS;
    const defaultIndex = optionsList.findIndex((option) => option.year === DEFAULT_YEAR);
    const fallbackIndex = defaultIndex !== -1 ? defaultIndex : 0;

    if (!Array.isArray(yearOptions) || yearOptions.length !== optionsList.length) {
      this.setData({ yearOptions: optionsList });
    }

    if (!selectedYear || !Number.isFinite(selectedYear.year) || selectedYearIndex < 0) {
      const fallbackOption = optionsList[fallbackIndex] || null;
      this.setData({
        selectedYear: fallbackOption,
        selectedYearIndex: fallbackIndex
      });
      return { options: optionsList, selectedYear: fallbackOption, selectedYearIndex: fallbackIndex };
    }

    return { options: optionsList, selectedYear, selectedYearIndex };
  },

  clearChartDisplay() {
    this.chartOptions = {};
    this.disposeCharts();
    this.setData({ displayCharts: [], showDiseaseMapping: false });
  },

  updateChartGroups({ preserveMonthSelection = true } = {}) {
    const { selectedProvince, selectedCity, selectedCounty } = this.data;

    if (!selectedProvince || !selectedProvince.code || !selectedCity || !selectedCity.code || !selectedCounty || !selectedCounty.code) {
      this.pendingPieToken = null;
      this.allPieGroups = [];
      this.clearChartDisplay();
      this.setData({
        legendItems: [],
        loadingCharts: false,
        showDiseaseMapping: false
      });
      return;
    }

    const { selectedYear } = this.ensureYearSelection();
    const activeYear = selectedYear && Number.isFinite(selectedYear.year) ? selectedYear.year : DEFAULT_YEAR;
    const compareYear = activeYear - 1;
    const selectedMonthValue = preserveMonthSelection ? this.resolveSelectedMonthValue() : null;
    const fallbackMonthValue = DEFAULT_MONTH_VALUE;
    const targetMonthValue = Number.isFinite(selectedMonthValue) && selectedMonthValue >= 1 && selectedMonthValue <= 12
      ? selectedMonthValue
      : fallbackMonthValue;

    const requestToken = `${selectedProvince.code}|${selectedCity.code}|${selectedCounty.code}|${activeYear}|${compareYear}|${targetMonthValue}`;
    this.pendingPieToken = requestToken;

    this.setData({ loadingCharts: true });

    epiSvc.fetchEpidemicPie({
      provinceCode: selectedProvince.code,
      districtCode: selectedCounty.code,
      year: activeYear,
      compareYear,
      month: targetMonthValue
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
        const groupYearRaw = group.year !== undefined ? group.year : group.groupYear;
        const groupYearNumber = Number(groupYearRaw);
        let resolvedGroupYear = Number.isFinite(groupYearNumber) ? groupYearNumber : null;
        if (!Number.isFinite(resolvedGroupYear)) {
          if (group.type === 'current' || groupKey === 'current') {
            resolvedGroupYear = activeYear;
          } else if (group.type === 'previous' || groupKey === 'previous') {
            resolvedGroupYear = compareYear;
          }
        }
        const monthsSource = Array.isArray(group.months) ? group.months : [];
        const normalizedMonths = monthsSource.map((month, monthIdx) => {
          const monthValueRaw = month.monthValue || month.month || month.monthNumber || targetMonthValue;
          const numericValue = Number(monthValueRaw);
          const monthValue = (!Number.isNaN(numericValue) && numericValue > 0) ? numericValue : targetMonthValue;
          const chartId = `chart-${groupKey}-${resolvedGroupYear || 'year'}-${monthValue}-${monthIdx}`;
          const slices = normalizeSlices(month.slices, colorMap);
          const hasData = month.hasData !== undefined ? !!month.hasData : slices.length > 0;
          return {
            chartId,
            monthValue,
            hasData,
            slices: hasData ? slices : [],
            ec: hasData ? { lazyLoad: true } : null,
            year: resolvedGroupYear,
            monthLabel: month.monthLabel || resolveMonthLabel(monthValue)
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
          months: normalizedMonths,
          year: groupYearRaw,
          yearNumber: resolvedGroupYear,
          type: group.type || null,
          isCurrent: group.type === 'current' || groupKey === 'current' || groupIdx === 0,
          isPrevious: group.type === 'previous' || groupKey === 'previous' || groupIdx === 1
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
                  label: slice.label || slice.code || slice.name,
                  color: slice.color
                });
              }
            });
          });
        });
        legendItems = Array.from(derivedMap.values());
      }

      this.allPieGroups = groupsWithEc;
      this.availableMonths = Array.isArray(payload.availableMonths)
        ? payload.availableMonths.map((value) => Number(value)).filter((value) => Number.isFinite(value))
        : [];

      const updatedYearOptions = (this.data.yearOptions || PREDEFINED_YEAR_OPTIONS).map((option) => {
        const matchGroup = groupsWithEc.find((group) => Number.isFinite(group.yearNumber) && group.yearNumber === option.year);
        if (matchGroup) {
          return { ...option, groupKey: matchGroup.key };
        }
        return option;
      });

      const selectedYearIndex = updatedYearOptions.findIndex((option) => option.year === activeYear);
      const updatedSelectedYear = selectedYearIndex !== -1 ? updatedYearOptions[selectedYearIndex] : selectedYear;

      const monthState = this.buildMonthStateFromAvailability(this.availableMonths, targetMonthValue);

      this.setData({
        legendItems,
        yearOptions: updatedYearOptions,
        selectedYear: updatedSelectedYear,
        selectedYearIndex: selectedYearIndex !== -1 ? selectedYearIndex : this.data.selectedYearIndex,
        ...monthState,
        showDiseaseMapping: false
      }, () => {
        this.applySelectedPeriod();
      });
    }).catch((err) => {
      console.error('load pie data failed', err);
      if (this.pendingPieToken === requestToken) {
        wx.showToast({ title: '饼图数据获取失败', icon: 'none' });
        this.allPieGroups = [];
        this.clearChartDisplay();
        this.setData({
          legendItems: [],
          showDiseaseMapping: false
        });
      }
    }).finally(() => {
      if (this.pendingPieToken === requestToken) {
        this.setData({ loadingCharts: false });
        this.pendingPieToken = null;
      }
    });
  },

  loadDiseaseMappings() {
    this.setData({ diseaseMappingLoading: true, diseaseMappingError: '' });
    const perPage = 50;

    const collectPage = (page = 1, acc = []) => {
      return knowledgeSvc.listDiseases({ page, per_page: perPage }).then(({ list, meta }) => {
        const incoming = Array.isArray(list) ? list : [];
        const nextAcc = acc.concat(incoming);
        const metaInfo = meta || {};
        const totalPagesRaw = metaInfo.total_pages ?? metaInfo.totalPages ?? metaInfo.pages;
        const totalCountRaw = metaInfo.total ?? metaInfo.total_count ?? metaInfo.totalCount;
        const totalPages = Number(totalPagesRaw);
        const hasMoreByPage = Number.isFinite(totalPages) && totalPages > page;
        const totalCount = Number(totalCountRaw);
        const hasMoreByCount = Number.isFinite(totalCount) && totalCount > nextAcc.length;
        if (hasMoreByPage || hasMoreByCount) {
          return collectPage(page + 1, nextAcc);
        }
        return nextAcc;
      });
    };

    collectPage().then((allDiseases) => {
      const mapping = new Map();
      (Array.isArray(allDiseases) ? allDiseases : []).forEach((item) => {
        const code = item && item.code ? String(item.code).trim() : '';
        const name = item && item.name ? String(item.name).trim() : '';
        if (!code || !name) return;
        if (!mapping.has(code)) {
          mapping.set(code, { code, name });
        }
      });
      const diseaseMappings = Array.from(mapping.values());
      this.setData({
        diseaseMappings,
        diseaseMappingLoading: false,
        diseaseMappingError: diseaseMappings.length ? '' : '暂无对照数据'
      });
    }).catch((err) => {
      console.error('load disease mapping failed', err);
      this.setData({
        diseaseMappingLoading: false,
        diseaseMappingError: (err && err.message) ? err.message : '对照表加载失败'
      });
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
      const displayLabel = slice.label || slice.name || slice.key;
      const item = {
        name: displayLabel,
        value,
        originalName: slice.name,
        code: slice.code
      };
      if (slice.color) {
        item.itemStyle = { color: slice.color };
      }
      return item;
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params = {}) => {
          const { data = {}, value } = params;
          const percentValue = Number.isFinite(params.percent) ? params.percent : null;
          const originalName = data.originalName;
          const paramsName = params.name || '';
          const combinedName = originalName && originalName !== paramsName
            ? `${originalName} (${paramsName})`
            : (originalName || paramsName);
          const percentText = percentValue !== null ? `<br/>占比：${percentValue}%` : '';
          return `${combinedName}<br/>数量：${value}${percentText}`;
        }
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
