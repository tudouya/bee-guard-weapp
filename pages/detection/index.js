const authUtil = require('../../utils/auth.js');

Page({
  data: {
    // 界面模式：code 有检测号 | paid 自费检测
    activeMode: 'code',
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
    loggedIn: false
  },
  // 跳转至确认邮寄页面（需登录）
  goToShipping(){
    if (authUtil.ensureLogin) {
      Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return;
        wx.navigateTo({ url: '/pages/detection/shipping/index' });
      });
      return;
    }
    wx.navigateTo({ url: '/pages/detection/shipping/index' });
  },

  onLoad: function (options) {
    // 支持通过 ?mode=paid 定位到自费检测分段
    if (options && options.mode && (options.mode === 'paid' || options.mode === 'code')) {
      this.setData({ activeMode: options.mode });
    }
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

  // 验证检测号并开始检测（需登录）
  verifyAndStartDetection: function() {
    if (authUtil.ensureLogin) {
      const self = this;
      Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return;
        self._doVerifyAndStart();
      });
      return;
    }
    this._doVerifyAndStart();
  },

  _doVerifyAndStart: function() {
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
      wx.showToast({ title: '验证成功，开始检测流程', icon: 'success', duration: 600 });
      const detectId = detectionNumber || '';
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/detection/survey/index?detectId=${encodeURIComponent(detectId)}`
        });
      }, 600);
    }, 1000);
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

  // 扫码支付（需登录）
  payForDetection: function() {
    if (authUtil.ensureLogin) {
      const self = this;
      Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return;
        self._goPay();
      });
      return;
    }
    this._goPay();
  },

  _goPay: function() {
    const selectedPackage = this.data.paidPackages.find(pkg => pkg.selected);
    
    if (!selectedPackage) {
      wx.showToast({ title: '请选择检测套餐', icon: 'none' });
      return;
    }
    const { id, name, price } = selectedPackage;
    wx.navigateTo({
      url: `/pages/detection/payment/index?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&price=${price}`
    });
  },

  // 顶部分段切换
  switchMode: function(e) {
    const mode = e.currentTarget.dataset.mode;
    if (!mode) return;
    this.setData({ activeMode: mode });
  },

  // 底部主按钮
  onPrimaryAction: function() {
    if (this.data.activeMode === 'code') {
      this.verifyAndStartDetection();
    } else {
      this.payForDetection();
    }
  },

  goToResults: function() {
    if (authUtil.ensureLogin) {
      Promise.resolve(authUtil.ensureLogin()).then(res => {
        if (!res || !res.ok) return;
        wx.navigateTo({ url: '/pages/results/list/index' });
      });
      return;
    }
    wx.navigateTo({ url: '/pages/results/list/index' });
  },

  // 手机号登录
  handleLogin: function() {
    wx.navigateTo({ url: '/pages/auth/login/index' });
  },

  onShow: function() {
    const logged = authUtil.isLoggedIn && authUtil.isLoggedIn();
    this.setData({ loggedIn: !!logged });
  }
});
