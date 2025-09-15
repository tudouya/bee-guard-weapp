const authUtil = require('../../utils/auth.js');
const detectionService = require('../../services/detectionNumbers.js');

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

    // 支持从检测号页面传入检测号
    if (options && options.detectionNumber) {
      this.setData({
        activeMode: 'code',
        'detectionForm.detectionNumber': decodeURIComponent(options.detectionNumber)
      });
    }
  },

  onShow: function() {
    const logged = authUtil.isLoggedIn && authUtil.isLoggedIn();
    this.setData({ loggedIn: !!logged });

    // 检查是否有待填入的检测号（从检测号页面跳转过来）
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage && currentPage.pendingDetectionNumber) {
      this.setData({
        activeMode: 'code',
        'detectionForm.detectionNumber': currentPage.pendingDetectionNumber
      });
      delete currentPage.pendingDetectionNumber;
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

  async _doVerifyAndStart() {
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

    try {
      // 调用后端验证接口（携带手机号）
      const response = await detectionService.validateDetectionNumber(detectionNumber, phoneNumber);
      wx.hideLoading();

      if (response.success) {
        // 验证成功
        const { detection_code_id, full_code, source_type, phone } = response.data;

        wx.showToast({
          title: '验证成功，开始检测流程',
          icon: 'success',
          duration: 600
        });

        // 跳转到调查问卷页面，传递验证后的数据
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/detection/survey/index?detectId=${encodeURIComponent(full_code)}&codeId=${detection_code_id}&sourceType=${encodeURIComponent(source_type)}`
          });
        }, 600);
      } else {
        // 处理验证失败
        wx.showToast({
          title: response.message || '验证失败',
          icon: 'none'
        });
      }

    } catch (error) {
      wx.hideLoading();
      console.error('检测号验证失败:', error);

      // 处理验证错误
      if (error.status === 422 && error.errors) {
        // 处理表单验证错误
        const errorMessages = [];
        for (const field in error.errors) {
          if (error.errors[field] && error.errors[field].length > 0) {
            errorMessages.push(error.errors[field][0]);
          }
        }
        const message = errorMessages.length > 0 ? errorMessages.join('\n') : '检测号验证失败';
        wx.showModal({
          title: '验证失败',
          content: message,
          showCancel: false
        });
      } else if (error.status === 401) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        setTimeout(() => {
          wx.navigateTo({ url: '/pages/auth/login/index' });
        }, 1000);
      } else {
        wx.showToast({
          title: error.message || '网络异常，请稍后重试',
          icon: 'none'
        });
      }
    }
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

});
