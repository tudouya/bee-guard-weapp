var app = getApp();

Page({
    data: {
        IP: "",
        topicHost: [],
        infoData: [],
        num: 0,
        recordNum: 0
    },
    onLoad: function(n) {
        this.handleTopicHost();
        this.handleIndustry(); 
        this.handleWarnNum();
        this.setData({
            IP: app.globalData.apiUrl
        });
    },
    onShow: function() {
        this.handleTopicHost();
        this.handleIndustry();
        this.handleWarnNum();
        this.setData({
            IP: app.globalData.apiUrl
        });
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
        wx.showToast({
            title: '防控知识功能开发中',
            icon: 'none'
        });
    },
    handleInfo: function() {
        wx.switchTab({
            url: '/pages/epidemic/index'
        });
    },
    handleTopicHost: function() {
        // 防控知识热门数据
        var mockTopics = [
            { problem_id: 1, problem_content: "春季蜂群健康检查要点及操作步骤", num: 286 },
            { problem_id: 2, problem_content: "蜂箱消毒的正确方法和注意事项", num: 195 },
            { problem_id: 3, problem_content: "如何识别蜜蜂幼虫病早期症状", num: 143 },
            { problem_id: 4, problem_content: "蜂群越冬前的疫病预防措施", num: 128 }
        ];
        var totalNum = mockTopics.reduce(function(sum, item) {
            return sum + item.num;
        }, 0);
        this.setData({
            topicHost: mockTopics,
            num: totalNum
        });
    },
    handleTopicFireInfo: function(n) {
        wx.showToast({
            title: '防控知识详情功能开发中',
            icon: 'none'
        });
    },
    handleIndustry: function() {
        // 疫情监测快报数据
        var mockInfo = [
            { consult_id: 1, consult_title: "山西省太原市发现SBV疫情，启动应急响应", type_name: "疫情通报", image_url: "" },
            { consult_id: 2, consult_title: "北京市蜂场AFB疫情得到有效控制", type_name: "防控进展", image_url: "" },
            { consult_id: 3, consult_title: "全国蜜蜂疫病监测网络覆盖率达85%", type_name: "监测数据", image_url: "" },
            { consult_id: 4, consult_title: "春季蜂病高发期防控指导意见发布", type_name: "防控指南", image_url: "" }
        ];
        this.setData({
            infoData: mockInfo
        });
    },
    handleIndustryInfo: function(n) {
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
        // 模拟告警数量
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