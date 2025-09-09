var t, e, n = require("../@babel/runtime/helpers/typeof"), a = (t = require("./wx-canvas")) && t.__esModule ? t : {
    default: t
}, r = function(t, e) {
    if (!e && t && t.__esModule) return t;
    if (null === t || "object" != typeof t && "function" != typeof t) return {
        default: t
    };
    var n = i(e);
    if (n && n.has(t)) return n.get(t);
    var a = {}, r = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var o in t) if ("default" !== o && Object.prototype.hasOwnProperty.call(t, o)) {
        var c = r ? Object.getOwnPropertyDescriptor(t, o) : null;
        c && (c.get || c.set) ? Object.defineProperty(a, o, c) : a[o] = t[o];
    }
    a.default = t, n && n.set(t, a);
    return a;
}(require("./echarts"));

function i(t) {
    if ("function" != typeof WeakMap) return null;
    var e = new WeakMap(), n = new WeakMap();
    return (i = function(t) {
        return t ? n : e;
    })(t);
}

function o(t, e) {
    t = t.split("."), e = e.split(".");
    for (var n = Math.max(t.length, e.length); t.length < n; ) t.push("0");
    for (;e.length < n; ) e.push("0");
    for (var a = 0; a < n; a++) {
        var r = parseInt(t[a]), i = parseInt(e[a]);
        if (r > i) return 1;
        if (r < i) return -1;
    }
    return 0;
}

function c(t) {
    for (var e = 0; e < t.touches.length; ++e) {
        var n = t.touches[e];
        n.offsetX = n.x, n.offsetY = n.y;
    }
    return t;
}

Component({
    properties: {
        canvasId: {
            type: String,
            value: "ec-canvas"
        },
        ec: {
            type: Object
        },
        forceUseOldCanvas: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        isUseNewCanvas: !1
    },
    ready: function() {
        r.registerPreprocessor(function(t) {
            t && t.series && (t.series.length > 0 ? t.series.forEach(function(t) {
                t.progressive = 0;
            }) : "object" === n(t.series) && (t.series.progressive = 0));
        }), this.data.ec ? this.data.ec.lazyLoad || this.init() : console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
    },
    methods: {
        init: function(t) {
            var e = wx.getSystemInfoSync().SDKVersion, n = o(e, "2.9.0") >= 0, a = this.data.forceUseOldCanvas, r = n && !a;
            if (this.setData({
                isUseNewCanvas: r
            }), a && n && console.warn("开发者强制使用旧canvas,建议关闭"), r) this.initByNewWay(t); else {
                if (!(o(e, "1.9.91") >= 0)) return void console.error("微信基础库版本过低，需大于等于 1.9.91。参见：https://github.com/ecomfe/echarts-for-weixin#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82");
                console.warn("建议将微信基础库调整大于等于2.9.0版本。升级后绘图将有更好性能"), this.initByOldWay(t);
            }
        },
        initByOldWay: function(t) {
            var n = this;
            e = wx.createCanvasContext(this.data.canvasId, this);
            var i = new a.default(e, this.data.canvasId, !1);
            r.setCanvasCreator(function() {
                return i;
            });
            wx.createSelectorQuery().in(this).select(".ec-canvas").boundingClientRect(function(e) {
                "function" == typeof t ? n.chart = t(i, e.width, e.height, 1) : n.data.ec && "function" == typeof n.data.ec.onInit ? n.chart = n.data.ec.onInit(i, e.width, e.height, 1) : n.triggerEvent("init", {
                    canvas: i,
                    width: e.width,
                    height: e.height,
                    canvasDpr: 1
                });
            }).exec();
        },
        initByNewWay: function(t) {
            var e = this;
            wx.createSelectorQuery().in(this).select(".ec-canvas").fields({
                node: !0,
                size: !0
            }).exec(function(n) {
                var i = n[0].node;
                e.canvasNode = i;
                var o = wx.getSystemInfoSync().pixelRatio, c = n[0].width, s = n[0].height, u = i.getContext("2d"), h = new a.default(u, e.data.canvasId, !0, i);
                r.setCanvasCreator(function() {
                    return h;
                }), "function" == typeof t ? e.chart = t(h, c, s, o) : e.data.ec && "function" == typeof e.data.ec.onInit ? e.chart = e.data.ec.onInit(h, c, s, o) : e.triggerEvent("init", {
                    canvas: h,
                    width: c,
                    height: s,
                    dpr: o
                });
            });
        },
        canvasToTempFilePath: function(t) {
            var n = this;
            this.data.isUseNewCanvas ? wx.createSelectorQuery().in(this).select(".ec-canvas").fields({
                node: !0,
                size: !0
            }).exec(function(e) {
                var n = e[0].node;
                t.canvas = n, wx.canvasToTempFilePath(t);
            }) : (t.canvasId || (t.canvasId = this.data.canvasId), e.draw(!0, function() {
                wx.canvasToTempFilePath(t, n);
            }));
        },
        touchStart: function(t) {
            if (this.chart && t.touches.length > 0) {
                var e = t.touches[0], n = this.chart.getZr().handler;
                n.dispatch("mousedown", {
                    zrX: e.x,
                    zrY: e.y,
                    preventDefault: function() {},
                    stopImmediatePropagation: function() {},
                    stopPropagation: function() {}
                }), n.dispatch("mousemove", {
                    zrX: e.x,
                    zrY: e.y,
                    preventDefault: function() {},
                    stopImmediatePropagation: function() {},
                    stopPropagation: function() {}
                }), n.processGesture(c(t), "start");
            }
        },
        touchMove: function(t) {
            if (this.chart && t.touches.length > 0) {
                var e = t.touches[0], n = this.chart.getZr().handler;
                n.dispatch("mousemove", {
                    zrX: e.x,
                    zrY: e.y,
                    preventDefault: function() {},
                    stopImmediatePropagation: function() {},
                    stopPropagation: function() {}
                }), n.processGesture(c(t), "change");
            }
        },
        touchEnd: function(t) {
            if (this.chart) {
                var e = t.changedTouches ? t.changedTouches[0] : {}, n = this.chart.getZr().handler;
                n.dispatch("mouseup", {
                    zrX: e.x,
                    zrY: e.y,
                    preventDefault: function() {},
                    stopImmediatePropagation: function() {},
                    stopPropagation: function() {}
                }), n.dispatch("click", {
                    zrX: e.x,
                    zrY: e.y,
                    preventDefault: function() {},
                    stopImmediatePropagation: function() {},
                    stopPropagation: function() {}
                }), n.processGesture(c(t), "end");
            }
        }
    }
});