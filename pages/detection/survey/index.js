Page({
  data: {
    detectionId: '',
    form: {
      beeCount: '',
      beeType: '中华蜜蜂',
      scale: '中型(11-50群)',
      management: ['定期健康检查', '病群隔离管理'],
      experience: '熟练(1-5年)',
      abnormalDesc: ''
    },
    managementOptions: ['定期健康检查','药物预防治疗','病群隔离管理','生物防治','环境控制'],
    beeTypeOptions: ['中华蜜蜂','意大利蜂','其他'],
    scaleOptions: ['小型(1-10群)','中型(11-50群)','大型(50群以上)'],
    experienceOptions: ['新手(1年以下)','熟练(1-5年)','专业(5年以上)']
  },

  onLoad(options) {
    if (options && options.detectId) {
      this.setData({ detectionId: options.detectId });
    }
  },

  onBeeCountInput(e) {
    this.setData({ 'form.beeCount': e.detail.value });
  },
  onBeeTypeChange(e) {
    this.setData({ 'form.beeType': e.detail.value });
  },
  selectBeeType(e) {
    const val = e.currentTarget.dataset.value;
    this.setData({ 'form.beeType': val });
  },
  onScaleChange(e) {
    this.setData({ 'form.scale': e.detail.value });
  },
  selectScale(e) {
    const val = e.currentTarget.dataset.value;
    this.setData({ 'form.scale': val });
  },
  onMgmtChange(e) {
    this.setData({ 'form.management': e.detail.value });
  },
  onExpChange(e) {
    this.setData({ 'form.experience': e.detail.value });
  },
  selectExperience(e) {
    const val = e.currentTarget.dataset.value;
    this.setData({ 'form.experience': val });
  },
  onDescInput(e) {
    this.setData({ 'form.abnormalDesc': e.detail.value });
  },

  submitSurvey() {
    const { beeCount } = this.data.form;
    if (!beeCount) {
      wx.showToast({ title: '请输入蜂群数量', icon: 'none' });
      return;
    }
    // TODO: 提交问卷到后端
    wx.showToast({ title: '提交成功', icon: 'success', duration: 800 });
    const detectId = this.data.detectionId || '';
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/detection/guide/index?detectId=${encodeURIComponent(detectId)}`
      });
    }, 800);
  }
  ,
  toggleMgmt(e) {
    const val = e.currentTarget.dataset.value;
    const list = (this.data.form.management || []).slice();
    const idx = list.indexOf(val);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(val);
    }
    this.setData({ 'form.management': list });
  }
});
