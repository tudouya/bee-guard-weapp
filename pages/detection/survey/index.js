const region = require('../../../services/region.js');
const api = require('../../../utils/api.js');

function nowDateStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function nowTimeStr() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

Page({
  data: {
    detectionId: '',
    detectionCodeId: null,
    form: {
      // 1 填表时间（日期 + 时间，默认当前，可编辑）
      fillDate: '',
      fillTime: '',
      // 2 场主姓名
      ownerName: '',
      // 3 地址（自动选择）
      locationName: '',
      locationPoint: null,
      // 4 手机号
      phone: '',
      // 5 蜂群数量
      beeCount: '',
      // 6 饲养方式
      raiseMethod: '',
      // 7 蜂种
      beeSpecies: '',
      // 8 收入来源排序（1-4）
      incomeRanks: {
        honey: '',
        royalJelly: '',
        pollination: '',
        sellBee: ''
      },
      // 9 是否生产期
      isProductionNow: '', // '是' | '否'
      // 10 当前主要产品
      productType: '', // 蜂蜜/花粉/蜂王浆/其他
      // 11 蜂蜜种类
      honeyType: '',
      // 12 花粉种类
      pollenType: '',
      // 13 下一个生产期开始时间（月或无）
      nextMonth: '',
      // 14 是否需要转地
      needMove: '', // '是' | '否'
      // 15 转地目的地（省市县）
      moveDestination: {
        province: '', city: '', district: ''
      },
      // 16 下个生产期主要蜜粉源
      nextFloral: '',
      // 17 是否有蜂群异常
      hasAbnormal: '', // '是' | '否'
      // 18 发病虫龄（多选）
      sickAges: [],
      // 19 发病蜂群数
      sickCount: '',
      // 20 主要症状（多选） + 其他说明
      symptoms: [],
      symptomOther: '',
      // 21 近一月用过的药物（多项填空）
      meds: [''],
      // 22 发生规律（单选）
      occurRule: '',
      // 23 可能原因（单选）
      possibleReason: '',
      // 24 往年集中发病时间段（多选月份）
      pastMonths: []
    },
    // 供原生控件派发后辅助显隐（如“其他症状”）
    hasSymptomOther: false,
    // 复选预选映射，便于在 WXML 中标记 checked
    selectedMaps: {
      sickAges: {},
      symptoms: {},
      pastMonths: {}
    },
    // 选项
    raiseMethodOptions: ['定地','省内小转地','跨省大转地'],
    beeSpeciesOptions: ['中华蜜蜂','西方蜜蜂（意大利蜜蜂等）'],
    incomeItems: [
      { key: 'honey', label: '蜂蜜' },
      { key: 'royalJelly', label: '蜂王浆' },
      { key: 'pollination', label: '为农作物授粉' },
      { key: 'sellBee', label: '出售蜂群或蜂王' }
    ],
    rankChoices: ['1','2','3','4'],
    productTypeOptions: ['蜂蜜','花粉','蜂王浆','其他'],
    monthOptions: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','没有或已是当年最后一个生产期'],
    sickAgeOptions: ['幼虫','成蜂'],
    symptomOptions: [
      '未封盖幼虫死亡','封盖后的大幼虫死亡','成蜂爬蜂','成蜂腹部膨大','成蜂发黑并颤抖','箱外大量成蜂排泄物','其他'
    ],
    occurRuleOptions: ['基本每年该时段均有发生','之前有发生但时间不固定','第一次发生'],
    reasonOptions: ['蜂群中残余的病原每年固定时间造成危害','购买或交换蜂王时将病原带入','周边由外地转地进来的蜂群将病原带入','当地气候或环境造成','不清楚'],
    monthsAll: ['1','2','3','4','5','6','7','8','9','10','11','12'],

    // 多级联动（省市县）
    regionMultiArray: [[], [], []],
    regionMultiIndex: [0, 0, 0]
  },

  onLoad(options) {
    if (options && options.detectId) {
      this.setData({ detectionId: options.detectId });
    }
    if (options && (options.codeId !== undefined)) {
      const cid = String(options.codeId).trim();
      this.setData({ detectionCodeId: cid ? Number(cid) : null });
    }
    // 初始化日期与时间（默认当前，可编辑）
    this.setData({
      'form.fillDate': nowDateStr(),
      'form.fillTime': nowTimeStr()
    });
    // 初始化地区多级数据
    const [p, c, d] = region.getRegionTriple(0, 0);
    this.setData({ regionMultiArray: [p, c, d] });
  },

  // 基础输入
  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },

  // 选择单选（字符串值）
  selectValue(e) {
    const key = e.currentTarget.dataset.key;
    const val = e.currentTarget.dataset.value;
    this.setData({ [key]: val });
  },

  // 原生单选组变更
  onRadioChange(e) {
    const key = e.currentTarget.dataset.key; // 如 'form.raiseMethod'
    const val = e.detail && e.detail.value;
    if (!key) return;
    this.setData({ [key]: val });
  },

  // 原生多选组变更
  onCheckboxChange(e) {
    const key = e.currentTarget.dataset.key; // 如 'form.sickAges' / 'form.symptoms' / 'form.pastMonths'
    const values = (e.detail && e.detail.value) || [];
    if (!key) return;
    const base = key.split('.').pop();
    const map = {};
    (values || []).forEach(v => { map[v] = true; });
    const updates = { [key]: values, [`selectedMaps.${base}`]: map };
    // “其他症状”显隐
    if (key === 'form.symptoms') {
      updates.hasSymptomOther = values.indexOf('其他') > -1;
    }
    this.setData(updates);
  },

  // 地理位置选择
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        const name = res.name || `${res.latitude.toFixed(4)},${res.longitude.toFixed(4)}`;
        this.setData({ 'form.locationName': name, 'form.locationPoint': { lat: res.latitude, lng: res.longitude } });
      },
      fail: () => {
        wx.showToast({ title: '定位未授权，可手动填写', icon: 'none' });
      }
    });
  },

  // 预填：根据不同场景快速生成逻辑分支
  applyPreset(e) {
    const preset = (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.key) || '';
    const set = (obj) => this.setData(obj);
    const mkMap = (arr=[]) => {
      const m = {}; (arr||[]).forEach(v => m[v] = true); return m;
    };
    if (preset === 'reset') {
      set({
        'form.ownerName': '',
        'form.locationName': '',
        'form.phone': '',
        'form.beeCount': '',
        'form.isProductionNow': '',
        'form.productType': '',
        'form.honeyType': '',
        'form.pollenType': '',
        'form.nextMonth': '',
        'form.needMove': '',
        'form.moveDestination': { province: '', city: '', district: '' },
        'form.nextFloral': '',
        'form.hasAbnormal': '',
        'form.sickAges': [],
        'form.sickCount': '',
        'form.symptoms': [],
        'form.symptomOther': '',
        'form.meds': [''],
        'form.occurRule': '',
        'form.possibleReason': '',
        'form.pastMonths': [],
        hasSymptomOther: false,
        'selectedMaps.sickAges': {},
        'selectedMaps.symptoms': {},
        'selectedMaps.pastMonths': {}
      });
      return;
    }

    // 基础示例值（覆盖姓名/地址/手机号/蜂群数）
    let patch = {
      'form.ownerName': '张三',
      'form.locationName': '北京市朝阳区某地',
      'form.phone': '13800138000',
      'form.beeCount': '50',
      'form.raiseMethod': '定地',
      'form.beeSpecies': '中华蜜蜂'
    };

    if (preset === 'noAbnormal') {
      patch = Object.assign(patch, {
        'form.isProductionNow': '否',
        'form.productType': '',
        'form.honeyType': '',
        'form.pollenType': '',
        'form.nextMonth': '5月',
        'form.needMove': '否',
        'form.nextFloral': '油菜花',
        'form.hasAbnormal': '否',
        'form.sickAges': [],
        'form.sickCount': '',
        'form.symptoms': [],
        'form.symptomOther': '',
        'form.meds': [''],
        'form.occurRule': '',
        'form.possibleReason': '',
        'form.pastMonths': ['3','4','5'],
        hasSymptomOther: false,
        'selectedMaps.sickAges': mkMap([]),
        'selectedMaps.symptoms': mkMap([]),
        'selectedMaps.pastMonths': mkMap(['3','4','5'])
      });
    } else if (preset === 'prodHoney') {
      patch = Object.assign(patch, {
        'form.isProductionNow': '是',
        'form.productType': '蜂蜜',
        'form.honeyType': '槐花蜜',
        'form.pollenType': '',
        'form.nextMonth': '5月',
        'form.needMove': '否',
        'form.nextFloral': '槐花',
        'form.hasAbnormal': '否',
        'form.sickAges': [],
        'form.sickCount': '',
        'form.symptoms': [],
        'form.symptomOther': '',
        'form.meds': [''],
        'form.occurRule': '',
        'form.possibleReason': '',
        'form.pastMonths': ['4','5','6'],
        hasSymptomOther: false,
        'selectedMaps.sickAges': mkMap([]),
        'selectedMaps.symptoms': mkMap([]),
        'selectedMaps.pastMonths': mkMap(['4','5','6'])
      });
    } else if (preset === 'prodPollen') {
      patch = Object.assign(patch, {
        'form.isProductionNow': '是',
        'form.productType': '花粉',
        'form.honeyType': '',
        'form.pollenType': '松花粉',
        'form.nextMonth': '3月',
        'form.needMove': '否',
        'form.nextFloral': '油菜花',
        'form.hasAbnormal': '否',
        'form.sickAges': [],
        'form.sickCount': '',
        'form.symptoms': [],
        'form.symptomOther': '',
        'form.meds': [''],
        'form.occurRule': '',
        'form.possibleReason': '',
        'form.pastMonths': ['3','4'],
        hasSymptomOther: false,
        'selectedMaps.sickAges': mkMap([]),
        'selectedMaps.symptoms': mkMap([]),
        'selectedMaps.pastMonths': mkMap(['3','4'])
      });
    } else if (preset === 'abnormalDemo') {
      const sickAges = ['成蜂'];
      const symptoms = ['成蜂爬蜂','其他'];
      const past = ['7','8'];
      patch = Object.assign(patch, {
        'form.isProductionNow': '否',
        'form.productType': '',
        'form.honeyType': '',
        'form.pollenType': '',
        'form.nextMonth': '8月',
        'form.needMove': '是',
        'form.moveDestination': { province: '河南省', city: '郑州市', district: '中原区' },
        'form.nextFloral': '',
        'form.hasAbnormal': '是',
        'form.sickAges': sickAges,
        'form.sickCount': '3',
        'form.symptoms': symptoms,
        'form.symptomOther': '个别爬蜂，伴随颤抖',
        'form.meds': ['无'],
        'form.occurRule': '之前有发生但时间不固定',
        'form.possibleReason': '当地气候或环境造成',
        'form.pastMonths': past,
        hasSymptomOther: true,
        'selectedMaps.sickAges': mkMap(sickAges),
        'selectedMaps.symptoms': mkMap(symptoms),
        'selectedMaps.pastMonths': mkMap(past)
      });
    } else {
      return;
    }
    set(patch);
  },

  // 排序题：为每个收入项选择 1-4
  onRankChange(e) {
    const key = e.currentTarget.dataset.key;
    const idx = e.detail.value; // picker index
    const rankVal = this.data.rankChoices[idx];
    this.setData({ [`form.incomeRanks.${key}`]: rankVal });
  },

  // 月份选择（Q13）
  onNextMonthChange(e) {
    const idx = e.detail.value;
    this.setData({ 'form.nextMonth': this.data.monthOptions[idx] });
  },

  // 多选切换（数组）
  toggleArrayVal(e) {
    const key = e.currentTarget.dataset.key; // 如 'form.sickAges' / 'form.symptoms' / 'form.pastMonths'
    const val = e.currentTarget.dataset.value;
    if (typeof key !== 'string') return;
    if (typeof val === 'undefined') return;
    const isFormPath = /^form\./.test(key);
    const list = (this.data.form && isFormPath) ? (this.getDataByPath(key) || []) : [];
    const next = list.slice();
    const i = next.indexOf(val);
    if (i > -1) next.splice(i, 1); else next.push(val);
    this.setData({ [key]: next });
  },

  // 读取嵌套路径的数据值
  getDataByPath(path) {
    try {
      return path.split('.').reduce((acc, k) => acc && acc[k], this.data);
    } catch (e) { return undefined; }
  },

  // 症状是否包含“其他”
  hasSymptomOther() {
    return (this.data.form.symptoms || []).indexOf('其他') > -1;
  },

  // 多项填空（药物）
  addMed() {
    const meds = (this.data.form.meds || []).slice();
    meds.push('');
    this.setData({ 'form.meds': meds });
  },
  removeMed(e) {
    const idx = e.currentTarget.dataset.index;
    const meds = (this.data.form.meds || []).slice();
    if (meds.length <= 1) return;
    meds.splice(idx, 1);
    this.setData({ 'form.meds': meds });
  },
  onMedInput(e) {
    const idx = e.currentTarget.dataset.index;
    const val = e.detail.value;
    const meds = (this.data.form.meds || []).slice();
    meds[idx] = val;
    this.setData({ 'form.meds': meds });
  },

  // 多级联动（省市县）
  onRegionColumnChange(e) {
    const { column, value } = e.detail;
    const idxs = this.data.regionMultiIndex.slice();
    idxs[column] = value;
    if (column === 0) {
      const [p, c, d] = region.getRegionTriple(value, 0);
      this.setData({ regionMultiArray: [p, c, d], regionMultiIndex: [value, 0, 0] });
    } else if (column === 1) {
      const pIdx = idxs[0];
      const [p, c, d] = region.getRegionTriple(pIdx, value);
      this.setData({ regionMultiArray: [p, c, d], regionMultiIndex: [pIdx, value, 0] });
    } else {
      this.setData({ regionMultiIndex: idxs });
    }
  },
  onRegionChange(e) {
    const idxs = e.detail.value; // [p,c,d]
    const [pArr, cArr, dArr] = this.data.regionMultiArray;
    const province = pArr[idxs[0]] || '';
    const city = cArr[idxs[1]] || '';
    const district = dArr[idxs[2]] || '';
    this.setData({
      regionMultiIndex: idxs,
      'form.moveDestination': { province, city, district }
    });
  },

  // 校验逻辑
  validate() {
    const f = this.data.form;
    const req = (cond, msg) => { if (cond) return true; wx.showToast({ title: msg, icon: 'none' }); return false; };
    // 基础必填
    if (!req(!!f.ownerName, '请输入场主姓名')) return false;
    if (!req(!!f.locationName, '请选择或输入当前地址')) return false;
    if (!req(/^1\d{10}$/.test(String(f.phone || '').trim()), '请输入有效手机号')) return false;
    if (!req(/^[1-9]\d*$/.test(String(f.beeCount || '').trim()), '请输入有效蜂群数量')) return false;
    if (!req(!!f.raiseMethod, '请选择饲养方式')) return false;
    if (!req(!!f.beeSpecies, '请选择蜂种')) return false;
    // 排序题校验
    const ranks = [f.incomeRanks.honey, f.incomeRanks.royalJelly, f.incomeRanks.pollination, f.incomeRanks.sellBee];
    if (!req(ranks.every(v => ['1','2','3','4'].includes(v)), '请为收入来源选择1-4排名')) return false;
    if (!req(new Set(ranks).size === 4, '收入来源排名不能重复')) return false;
    if (!req(!!f.isProductionNow, '请选择当前是否为生产期')) return false;
    // 条件：生产期=是
    if (f.isProductionNow === '是') {
      if (!req(!!f.productType, '请选择主要蜂产品种类')) return false;
      if (f.productType === '蜂蜜' && !req(!!f.honeyType, '请输入蜂蜜种类')) return false;
      if (f.productType === '花粉' && !req(!!f.pollenType, '请输入花粉种类')) return false;
    }
    // Q13 月
    if (!req(!!f.nextMonth, '请选择下一个生产期开始时间')) return false;
    const isNone = f.nextMonth === '没有或已是当年最后一个生产期';
    // Q14/15/16
    if (!isNone) {
      if (!req(!!f.needMove, '请选择是否转地')) return false;
      if (f.needMove === '是') {
        const m = f.moveDestination || {}; const ok = m.province && m.city && m.district;
        if (!req(ok, '请选择转地目的地（省市县）')) return false;
      } else {
        if (!req(!!f.nextFloral, '请输入主要蜜粉源')) return false;
      }
    }
    // Q17 分支
    if (!req(!!f.hasAbnormal, '请选择是否有蜂群异常')) return false;
    if (f.hasAbnormal === '是') {
      if (!req((f.sickAges || []).length > 0, '请选择发病虫龄')) return false;
      if (!req(/^[1-9]\d*$/.test(String(f.sickCount || '').trim()), '请输入有效发病蜂群数')) return false;
      if (!req((f.symptoms || []).length > 0, '请选择主要症状')) return false;
      if ((f.symptoms || []).includes('其他')) {
        if (!req(!!f.symptomOther, '请输入其他症状说明')) return false;
      }
      if (!req(!!f.occurRule, '请选择该病发生规律')) return false;
      if (!req(!!f.possibleReason, '请选择可能原因')) return false;
    }
    // Q24 多选月份
    if (!req((f.pastMonths || []).length > 0, '请选择往年集中发病月份')) return false;
    return true;
  },

  // 提交（调用后端接口）
  async submitSurvey() {
    if (!this.validate()) return;
    const f = this.data.form || {};
    const payload = {
      detection_code_id: this.data.detectionCodeId != null ? Number(this.data.detectionCodeId) : undefined,
      fill_date: f.fillDate || '',
      fill_time: f.fillTime || '',
      owner_name: f.ownerName || '',
      location_name: f.locationName || '',
      location_latitude: f.locationPoint && f.locationPoint.lat || undefined,
      location_longitude: f.locationPoint && f.locationPoint.lng || undefined,
      phone: (f.phone || '').trim(),
      bee_count: f.beeCount ? Number(f.beeCount) : 0,
      raise_method: f.raiseMethod || '',
      bee_species: f.beeSpecies || '',
      income_ranks: {
        honey: f.incomeRanks && f.incomeRanks.honey || '',
        royalJelly: f.incomeRanks && f.incomeRanks.royalJelly || '',
        pollination: f.incomeRanks && f.incomeRanks.pollination || '',
        sellBee: f.incomeRanks && f.incomeRanks.sellBee || ''
      },
      is_production_now: f.isProductionNow || '',
      product_type: f.productType || '',
      honey_type: f.productType === '蜂蜜' ? (f.honeyType || '') : undefined,
      pollen_type: f.productType === '花粉' ? (f.pollenType || '') : undefined,
      next_month: f.nextMonth || '',
      need_move: f.nextMonth && f.nextMonth !== '没有或已是当年最后一个生产期' ? (f.needMove || '') : '',
      move_province: (f.needMove === '是') ? (f.moveDestination && f.moveDestination.province || '') : undefined,
      move_city: (f.needMove === '是') ? (f.moveDestination && f.moveDestination.city || '') : undefined,
      move_district: (f.needMove === '是') ? (f.moveDestination && f.moveDestination.district || '') : undefined,
      next_floral: (f.needMove === '否') ? (f.nextFloral || '') : undefined,
      has_abnormal: f.hasAbnormal || '',
      past_months: Array.isArray(f.pastMonths) ? f.pastMonths : []
    };
    if (f.hasAbnormal === '是') {
      payload.sick_ages = Array.isArray(f.sickAges) ? f.sickAges : [];
      payload.sick_count = f.sickCount ? Number(f.sickCount) : undefined;
      payload.symptoms = Array.isArray(f.symptoms) ? f.symptoms : [];
      if (payload.symptoms.indexOf('其他') > -1) payload.symptom_other = f.symptomOther || '';
      payload.medications = Array.isArray(f.meds) ? f.meds.filter(v => (v || '').trim()) : [];
      payload.occur_rule = f.occurRule || '';
      payload.possible_reason = f.possibleReason || '';
    }

    wx.showLoading({ title: '提交中...' });
    try {
      await api.post('/api/surveys', payload);
      wx.hideLoading();
      wx.showToast({ title: '提交成功', icon: 'success', duration: 600 });
      const detectId = this.data.detectionId || '';
      setTimeout(() => {
        wx.navigateTo({ url: `/pages/detection/guide/index?detectId=${encodeURIComponent(detectId)}` });
      }, 600);
    } catch (error) {
      wx.hideLoading();
      if (error && error.status === 422 && error.errors) {
        const msgs = [];
        const errs = error.errors || {};
        Object.keys(errs).forEach(k => {
          const arr = errs[k];
          if (Array.isArray(arr) && arr.length) msgs.push(arr[0]);
        });
        wx.showModal({ title: '提交失败', content: msgs.join('\n') || (error.message || '表单校验失败'), showCancel: false });
      } else {
        wx.showToast({ title: (error && error.message) || '网络异常，请稍后重试', icon: 'none' });
      }
    }
  }
});
