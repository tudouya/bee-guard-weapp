Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;

var e = require("../@babel/runtime/helpers/classCallCheck"), t = require("../@babel/runtime/helpers/createClass");

exports.default = function() {
    return t(function t(n, a, i, c) {
        e(this, t), this.ctx = n, this.canvasId = a, this.chart = null, this.isNew = i, 
        i ? this.canvasNode = c : this._initStyle(n), this._initEvent();
    }, [ {
        key: "getContext",
        value: function(e) {
            if ("2d" === e) return this.ctx;
        }
    }, {
        key: "setChart",
        value: function(e) {
            this.chart = e;
        }
    }, {
        key: "addEventListener",
        value: function() {}
    }, {
        key: "attachEvent",
        value: function() {}
    }, {
        key: "detachEvent",
        value: function() {}
    }, {
        key: "_initCanvas",
        value: function(e, t) {
            e.util.getContext = function() {
                return t;
            }, e.util.$override("measureText", function(e, n) {
                return t.font = n || "12px sans-serif", t.measureText(e);
            });
        }
    }, {
        key: "_initStyle",
        value: function(e) {
            var t = arguments;
            e.createRadialGradient = function() {
                return e.createCircularGradient(t);
            };
        }
    }, {
        key: "_initEvent",
        value: function() {
            var e = this;
            this.event = {};
            [ {
                wxName: "touchStart",
                ecName: "mousedown"
            }, {
                wxName: "touchMove",
                ecName: "mousemove"
            }, {
                wxName: "touchEnd",
                ecName: "mouseup"
            }, {
                wxName: "touchEnd",
                ecName: "click"
            } ].forEach(function(t) {
                e.event[t.wxName] = function(n) {
                    var a = n.touches[0];
                    e.chart.getZr().handler.dispatch(t.ecName, {
                        zrX: "tap" === t.wxName ? a.clientX : a.x,
                        zrY: "tap" === t.wxName ? a.clientY : a.y,
                        preventDefault: function() {},
                        stopImmediatePropagation: function() {},
                        stopPropagation: function() {}
                    });
                };
            });
        }
    }, {
        key: "width",
        get: function() {
            return this.canvasNode ? this.canvasNode.width : 0;
        },
        set: function(e) {
            this.canvasNode && (this.canvasNode.width = e);
        }
    }, {
        key: "height",
        get: function() {
            return this.canvasNode ? this.canvasNode.height : 0;
        },
        set: function(e) {
            this.canvasNode && (this.canvasNode.height = e);
        }
    } ]);
}();