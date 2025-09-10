const MAP = {
  sbv: {
    title: '囊状幼虫病 (SBV)',
    intro: '由囊状幼虫病毒引起，主要危害幼虫。',
    symptom: '幼虫呈囊状、透明胶样，易与其他病害混淆。',
    transmit: '通过密接、蜂具、盗蜂等途径传播。',
    prevention: '保持干燥卫生，隔离病群，按指导用药。'
  },
  afb: {
    title: '美洲幼虫腐臭病 (AFB)',
    intro: '细菌性疾病，传染性强，需严格防控。',
    symptom: '幼虫腐烂，有臭味，拉丝试验阳性。',
    transmit: '蜜蜂接触、蜂具、盗蜂传播。',
    prevention: '隔离病群，消毒蜂具，遵医嘱用药。'
  },
  efb: {
    title: '欧洲幼虫腐臭病 (EFB)',
    intro: '细菌性疾病，常见于春季与群势变动期。',
    symptom: '幼虫颜色变黄、腐烂，无明显臭味。',
    transmit: '接触传播为主。',
    prevention: '改善饲喂环境，按指导防治。'
  },
  varroa: {
    title: '蜂螨病',
    intro: '寄生虫危害，影响成蜂与幼虫健康。',
    symptom: '蜂体消瘦，翅畸形，群势下降。',
    transmit: '寄生、盗蜂、调群传播。',
    prevention: '生物与化学综合防治，定期监测。'
  }
};

Page({
  data: {
    title: '病害详情',
    intro: '',
    symptom: '',
    transmit: '',
    prevention: ''
  },
  onLoad(options) {
    const id = options && options.id || 'sbv';
    const d = MAP[id] || MAP.sbv;
    this.setData({
      title: d.title,
      intro: d.intro,
      symptom: d.symptom,
      transmit: d.transmit,
      prevention: d.prevention
    });
  },
  openProducts() {
    wx.showToast({ title: '企业/平台产品链接开发中', icon: 'none' });
  }
});

