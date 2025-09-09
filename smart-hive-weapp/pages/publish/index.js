var e = require("../../config/api"), t = e.req_findProblemType, a = e.req_saveProblem, n = getApp();

Page({
    data: {
        typeData: [],
        mediaData: [],
        IP: "",
        interval: "",
        audioUrl: {},
        visible: !1,
        showBowen: !1,
        widths: 72,
        content: ""
    },
    onLoad: function(e) {
        this.handleTopicType(), this.setData({
            IP: n.globalData.url
        });
    },
    onShow: function() {},
    onUnload: function() {
        wx.reLaunch({
            url: "../index/index"
        });
    },
    handleTopicType: function() {
        var e = this;
        t({
            flag: 2
        }).then(function(t) {
            2e4 === t.data.code ? e.setData({
                typeData: t.data.data.map(function(e, t) {
                    return e.checked = !t, e;
                })
            }) : wx.showToast({
                title: t.data.message,
                icon: "error"
            });
        });
    },
    handleChangeType: function(e) {
        var t = this.data.typeData;
        this.setData({
            typeData: t.map(function(t) {
                return t.checked = t.type_id === e.currentTarget.dataset.id, t;
            })
        });
    },
    handleChangeTextArea: function(e) {
        this.setData({
            content: e.detail.value
        });
    },
    handleShowMedia: function() {
        var e = this;
        wx.showActionSheet({
            itemList: [ "上传图片", "上传视频" ],
            success: function(t) {
                0 === t.tapIndex && wx.chooseMedia({
                    count: 1,
                    mediaType: [ "image" ],
                    sourceType: [ "album", "camera" ],
                    success: function(t) {
                        wx.uploadFile({
                            url: n.globalData.url + "/file/uploadImageReply",
                            filePath: t.tempFiles[0].tempFilePath,
                            name: "file",
                            header: {
                                "content-type": "application/json",
                                "x-auth-token": wx.getStorageSync("token")
                            },
                            success: function(t) {
                                var a = JSON.parse(t.data);
                                2e4 === a.code && e.setData({
                                    mediaData: e.data.mediaData.concat([ {
                                        type: "image",
                                        url: a.data
                                    } ])
                                });
                            }
                        });
                    }
                }), 1 === t.tapIndex && wx.chooseMedia({
                    count: 1,
                    mediaType: [ "video" ],
                    sourceType: [ "album", "camera" ],
                    success: function(t) {
                        wx.showLoading({
                            title: "上传中..."
                        }), wx.uploadFile({
                            url: n.globalData.url + "/file/uploadFileReply",
                            filePath: t.tempFiles[0].tempFilePath,
                            name: "file",
                            header: {
                                "content-type": "application/json",
                                "x-auth-token": wx.getStorageSync("token")
                            },
                            success: function(t) {
                                wx.hideLoading();
                                var a = JSON.parse(t.data);
                                2e4 === a.code && e.setData({
                                    mediaData: e.data.mediaData.concat([ {
                                        type: "video",
                                        url: a.data
                                    } ])
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    delMedia: function(e) {
        var t = this.data.mediaData;
        this.setData({
            mediaData: t.filter(function(t) {
                return t.url !== e.currentTarget.dataset.url;
            })
        });
    },
    handleShowVoice: function() {
        this.setData({
            visible: !0
        });
    },
    handleStartRecord: function() {
        var e = this;
        this.setData({
            showBowen: !0
        });
        wx.getRecorderManager().start({
            duration: 6e4,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 192e3,
            format: "wav",
            frameSize: 50
        });
        var t = 0;
        e.data.interval = setInterval(function() {
            ++t > 59 && e.handleEndRecord();
        }, 1e3);
    },
    handleEndRecord: function() {
        var e = this;
        clearInterval(this.data.interval), this.setData({
            showBowen: !1,
            visible: !1
        }), wx.getRecorderManager().onStop(function(t) {
            wx.uploadFile({
                filePath: t.tempFilePath,
                url: n.globalData.url + "/file/uploadVoice",
                name: "file",
                header: {
                    "content-type": "application/json",
                    "x-auth-token": wx.getStorageSync("token")
                },
                success: function(a) {
                    var n = JSON.parse(a.data);
                    2e4 === n.code && e.setData({
                        audioUrl: {
                            video_druction: (t.duration / 1e3).toFixed(0),
                            voice_url: n.data
                        },
                        widths: 72 + 5 * (t.duration / 1e3).toFixed(0)
                    });
                },
                fail: function(e) {
                    console.log(e, "fail");
                }
            });
        }), wx.getRecorderManager().stop();
    },
    handlePlayRecord: function() {
        var e = this.data, t = e.IP, a = e.audioUrl, n = wx.getBackgroundAudioManager();
        n.title = " ", n.epname = "", n.singer = "", n.coverImgUrl = "", n.src = t + a.voice_url, 
        n.play();
    },
    handleSubmit: function() {
        var e = this.data, t = e.typeData, n = e.audioUrl, i = e.content, o = e.mediaData, r = t.length ? t.find(function(e) {
            return e.checked;
        }) : {}, c = o.filter(function(e) {
            return "image" === e.type;
        }).map(function(e) {
            return e.url;
        }), d = o.filter(function(e) {
            return "video" === e.type;
        }).map(function(e) {
            return e.url;
        });
        return r.type_id ? i ? void a({
            problem_content: i,
            problem_images: c.join(","),
            video_url: d.join(","),
            type_id: r.type_id,
            type_name: r.type_name,
            video_druction: n.video_druction ? n.video_druction : "",
            voice_url: n.voice_url ? n.voice_url : ""
        }).then(function(e) {
            2e4 === e.data.code ? (wx.showToast({
                title: "发布成功！",
                icon: "success"
            }), setTimeout(function() {
                wx.reLaunch({
                    url: "../index/index"
                });
            }, 1500)) : wx.showToast({
                title: e.data.message,
                icon: "error"
            });
        }) : wx.showToast({
            title: "请输入话题内容",
            icon: "error"
        }) : wx.showToast({
            title: "请选择话题类型",
            icon: "error"
        });
    }
});