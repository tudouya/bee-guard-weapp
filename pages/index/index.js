const config = require('../../utils/config.js');
const knowledgeService = require('../../services/knowledge');
const epidemicService = require('../../services/epidemic');
const { resolveAsset } = require('../../utils/assets.js');

const ASSETS = {
    searchIcon: resolveAsset('/weapp/search.png'),
    bannerBee: resolveAsset('/weapp/banner_bee.png'),
    featureDetection: resolveAsset('/weapp/home-feature-detection.png'),
    featureEpidemic: resolveAsset('/weapp/home-feature-epidemic.png'),
    featureKnowledge: resolveAsset('/weapp/home-feature-knowledge.png'),
    featureEnterprise: resolveAsset('/weapp/home-feature-enterprise.png'),
    featureProduct: resolveAsset('/weapp/home-feature-product.png'),
    featureQna: resolveAsset('/weapp/home-feature-qna.png'),
    placeholderCard: resolveAsset('/weapp/placeholder-card.png'),
    rankIcons: [
        resolveAsset('/weapp/rank-1.png'),
        resolveAsset('/weapp/rank-2.png'),
        resolveAsset('/weapp/rank-3.png'),
        resolveAsset('/weapp/rank-4.png')
    ]
};

Page({
    data: {
        IP: "",
        topicHost: [],
        infoData: [],
        num: 0,
        recordNum: 0,
        assets: ASSETS,
        bannerSlides: [
            {
                id: 'platform',
                title: '中国蜜蜂疫病监控平台',
                subtitle: '检测·监测·防控一站式服务',
                badge: '安心守护',
                gradient: 'gradient-platform'
            },
            {
                id: 'research',
                title: '中国农业科学院蜜蜂研究所',
                subtitle: '科研赋能 · 权威背书',
                badge: '科研协同',
                gradient: 'gradient-research'
            },
            {
                id: 'project',
                title: '农业农村部动物疫病监测与防治项目',
                subtitle: '国家级防控体系保障',
                badge: '国家项目',
                gradient: 'gradient-project'
            }
        ]
    },
    onLoad: function () {
        this.handleTopicHost();
        this.handleIndustry();
        this.handleWarnNum();
        this.setData({ IP: config.apiBase });
    },
    onShow: function () {
        this.handleTopicHost({ silent: true });
        this.handleIndustry({ silent: true });
        this.handleWarnNum();
        this.setData({ IP: config.apiBase });
    },
    handleChange: function() {
        wx.showToast({
            title: '搜索功能开发中',
            icon: 'none'
        });
    },
    handleDetection: function() {
        wx.switchTab({
            url: '/pages/detection/index'
        });
    },
    handleEpidemic: function() {
        wx.switchTab({
            url: '/pages/epidemic/index'
        });
    },
    handleKnowledge: function() {
        wx.navigateTo({ url: '/packageCommunity/pages/disease-list/index' });
    },
    // 新增：企业展示
    handleEnterprise: function() {
        wx.navigateTo({ url: '/pages/enterprise/list/index' });
    },
    // 新增：产品推荐
    handleProduct: function() {
        wx.navigateTo({ url: '/pages/product/list/index' });
    },
    // 新增：答疑解惑（跳转社区三标签页并默认激活“蜂农提问”）
    handleQna: function() {
        wx.navigateTo({ url: '/packageCommunity/pages/disease-list/index?tab=qa' });
    },
    handleInfo: function() {
        wx.switchTab({
            url: '/pages/epidemic/index'
        });
    },
    handleTopicHost: function(options = {}) {
        const silent = options && options.silent;
        if (this._loadingFeaturedArticles) return;
        this._loadingFeaturedArticles = true;
        knowledgeService.listFeaturedArticles()
            .then((list) => {
                const featured = Array.isArray(list) ? list.slice(0, 4) : [];
                const totalViews = featured.reduce((sum, item) => sum + (item.views || 0), 0);
                this.setData({
                    topicHost: featured,
                    num: totalViews
                });
            })
            .catch((err) => {
                if (!silent) {
                    wx.showToast({
                        title: err && err.message ? err.message : '防控知识加载失败',
                        icon: 'none'
                    });
                }
                this.setData({
                    topicHost: [],
                    num: 0
                });
            })
            .finally(() => {
                this._loadingFeaturedArticles = false;
            });
    },
    handleTopicFireInfo: function(event) {
        const { id, code } = event.currentTarget.dataset || {};
        if (!id) {
            return;
        }
        const query = code ? `?id=${id}&d=${code}` : `?id=${id}`;
        wx.navigateTo({
            url: `/packageCommunity/pages/article-detail/index${query}`
        });
    },
    handleIndustry: function (options = {}) {
        const silent = options && options.silent;
        if (this._loadingBulletins) return;
        this._loadingBulletins = true;
        epidemicService.fetchFeaturedBulletins()
            .then((list) => {
                const items = Array.isArray(list) ? list.slice(0, 4) : [];
                const mapped = items.map((item) => ({
                    id: item.id,
                    title: item.title || '',
                    summary: item.summary || '',
                    thumbnailUrl: item.thumbnailUrl || ''
                }));
                this.setData({
                    infoData: mapped
                });
            })
            .catch((err) => {
                if (!silent) {
                    wx.showToast({
                        title: err && err.message ? err.message : '疫情快报加载失败',
                        icon: 'none'
                    });
                }
                this.setData({
                    infoData: []
                });
            })
            .finally(() => {
                this._loadingBulletins = false;
            });
    },
    handleIndustryInfo: function () {
        wx.switchTab({
            url: '/pages/epidemic/index'
        });
    },
    handleWarn: function() {
        wx.showToast({
            title: '告警记录功能开发中',
            icon: 'none'
        });
    },
    handleWarnNum: function() {
        // 占位告警数量
        this.setData({
            recordNum: 0
        });
    },
    preview: function(n) {
        wx.previewImage({
            current: n.currentTarget.dataset.url,
            urls: [ n.currentTarget.dataset.url ]
        });
    }
});
