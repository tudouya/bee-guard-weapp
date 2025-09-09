var e = require("../../config/api"), t = e.req_findPcRply, a = e.req_saveReply, n = require("../../utils/util"), r = getApp();

Page({
    data: {
        placeholder: "发表回复",
        questionData: {},
        replyData: [],
        item: {},
        index: "1",
        content: "",
        comment: {}
    },
    onLoad: function(e) {
        this.handleTopicInfo(e.id), this.setData({
            IP: r.globalData.url
        });
    },
    bindClone: function() {
        this.setData({
            index: "1",
            item: {},
            placeholder: "发表回复",
            content: "",
            comment: {}
        });
    },
    onShow: function() {},
    handleTopicInfo: function(e) {
        var a = this;
        t({
            problemId: e
        }).then(function(e) {
            if (2e4 === e.data.code) {
                var t = e.data.data.problemEntity;
                t.time = t.problem_create_time ? n.formatDateLine(new Date(t.problem_create_time)) : "", 
                t.images = t.problem_images ? t.problem_images.split(",").map(function(e) {
                    return e = -1 !== e.indexOf("http") ? e : r.globalData.url + e;
                }) : [], t.videos = t.video_url ? t.video_url.split(",").map(function(e) {
                    return e = -1 !== e.indexOf("http") ? e : r.globalData.url + e;
                }) : [], t.widths = 72 + 5 * t.video_druction;
                var i = e.data.data.problemReplyEntities.map(function(e) {
                    return e.time = e.reply_time ? n.formatDateLine(new Date(e.reply_time)) : "", e;
                });
                a.setData({
                    questionData: t,
                    replyData: i
                });
            } else wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        });
    },
    handlePlayRecord: function(e) {
        var t = wx.getBackgroundAudioManager();
        t.title = " ", t.epname = "", t.singer = "", t.coverImgUrl = "", t.src = e.currentTarget.dataset.url, 
        t.play();
    },
    findComment: function(e) {
        var t = e.currentTarget.dataset.item, a = e.currentTarget.dataset.index;
        this.setData({
            item: t,
            index: a,
            placeholder: "回复" + ("2" === a ? t.reply_user_nick : t.userNick),
            content: "",
            comment: "3" === a ? e.currentTarget.dataset.comment : {}
        });
    },
    handleInput: function(e) {
        this.setData({
            content: e.detail.value
        });
    },
    handleSubmit: function() {
        // 移除授权验证，允许游客回复
        var e = this, t = this.data, n = t.questionData, i = t.index, o = t.item, l = t.content, c = t.comment;
        if (!l) return wx.showToast({
            title: "请输入回复内容",
            icon: "error"
        });
        var s = {
            problem_id: n.problem_id,
            reply_content: l,
            reply_type: "1" === i ? 1 : 2,
            answer_id: "2" === i ? o.reply_user_id : "3" === i ? o.userId : null,
            answer_reply_id: "2" === i ? o.reply_id : "3" === i ? c.reply_id : null,
            reply_user_id: "1" === i ? null : (wx.getStorageSync("userInfo") && wx.getStorageSync("userInfo").user_id) || "guest_" + Date.now()
        };
        a(s).then(function(t) {
            2e4 === t.data.code ? (e.handleTopicInfo(n.problem_id), e.setData({
                IP: r.globalData.url,
                index: "1",
                item: {},
                placeholder: "发表回复",
                content: "",
                comment: {}
            })) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    preview: function(e) {
        wx.previewImage({
            current: e.currentTarget.dataset.current,
            urls: e.currentTarget.dataset.url
        });
    }
});