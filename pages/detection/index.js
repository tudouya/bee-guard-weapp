Page({
  data: {
    activeTab: 'detection',
    searchValue: '',
    // 检测号验证表单数据
    detectionForm: {
      detectionNumber: '',
      phoneNumber: ''
    },
    // 自费检测套餐
    paidPackages: [
      {
        id: 'basic',
        name: '基础检测套餐',
        price: 199,
        desc: '常见蜜蜂疾病检测，包含AFB、EFB、黑蜂病等基础项目',
        selected: false
      },
      {
        id: 'advanced', 
        name: '深度检测套餐',
        price: 399,
        desc: '全面疾病检测+环境因子分析+防控建议报告',
        selected: false
      }
    ],
    // 检测结果数据
    results: [
      {
        id: 1,
        detectionId: 'BG202409001',
        status: 'completed',
        statusText: '检测完成',
        date: '2024-09-08',
        type: '免费检测'
      },
      {
        id: 2,
        detectionId: 'BG202409002',
        status: 'processing',
        statusText: '检测中',
        date: '2024-09-09',
        type: '自费检测'
      }
    ]
  },

  onLoad: function (options) {
    // 检查是否需要直接跳转到结果查询
    if (options.tab === 'results') {
      this.setData({
        activeTab: 'results'
      });
    }
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 检测号输入事件
  onDetectionNumberInput: function(e) {
    this.setData({
      'detectionForm.detectionNumber': e.detail.value
    });
  },

  // 手机号输入事件
  onPhoneNumberInput: function(e) {
    this.setData({
      'detectionForm.phoneNumber': e.detail.value
    });
  },

  // 验证检测号并开始检测
  verifyAndStartDetection: function() {
    const { detectionNumber, phoneNumber } = this.data.detectionForm;
    
    if (!detectionNumber) {
      wx.showToast({ title: '请输入检测号', icon: 'none' });
      return;
    }
    
    if (!phoneNumber) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    
    // 验证手机号格式
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phoneNumber)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '验证中...' });
    
    // 模拟API验证
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '验证成功，开始检测流程', icon: 'success' });
      // TODO: 跳转到调查问卷页面
    }, 1500);
  },

  // 选择自费检测套餐
  selectPaidPackage: function(e) {
    const packageId = e.currentTarget.dataset.id;
    const packages = this.data.paidPackages.map(pkg => ({
      ...pkg,
      selected: pkg.id === packageId
    }));
    
    this.setData({
      paidPackages: packages
    });
  },

  // 扫码支付
  payForDetection: function() {
    const selectedPackage = this.data.paidPackages.find(pkg => pkg.selected);
    
    if (!selectedPackage) {
      wx.showToast({ title: '请选择检测套餐', icon: 'none' });
      return;
    }
    
    wx.showToast({
      title: `选择${selectedPackage.name} ¥${selectedPackage.price}，支付功能开发中`,
      icon: 'none',
      duration: 2000
    });
  },

  onSearchInput: function(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  searchResults: function() {
    wx.showToast({
      title: '查询功能开发中',
      icon: 'none'
    });
  },

  viewDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '结果详情功能开发中',
      icon: 'none'
    });
  },

  // 手机号登录
  handleLogin: function() {
    wx.showToast({
      title: '登录功能开发中',
      icon: 'none'
    });
  }
});