const region = require('../../../services/region.js');

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
      pastMonths: [],
      // 25 是否邮寄样品
      postSample: '', // '是' | '否'
      // 26 邮寄日期（日期+时间，可编辑）
      postDate: '',
      postTime: ''
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
    const list = (this.data.form && key.startsWith('form.')) ? (this.getDataByPath(key) || []) : [];
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
    // Q25/26
    if (!req(!!f.postSample, '请选择是否邮寄样品')) return false;
    if (f.postSample === '是') {
      if (!req(!!f.postDate, '请选择邮寄日期')) return false;
      if (!req(!!f.postTime, '请选择邮寄时间')) return false;
    }
    return true;
  },

  // 提交（Mock）
  submitSurvey() {
    if (!this.validate()) return;
    wx.showLoading({ title: '提交中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '提交成功', icon: 'success', duration: 600 });
      const detectId = this.data.detectionId || '';
      setTimeout(() => {
        wx.navigateTo({ url: `/pages/detection/guide/index?detectId=${encodeURIComponent(detectId)}` });
      }, 600);
    }, 600);
  }
});
