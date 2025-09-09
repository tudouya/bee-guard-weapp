var t, e = require("../../@babel/runtime/helpers/objectSpread2"), a = require("../../@babel/runtime/helpers/defineProperty"), o = function(t, e) {
    if (!e && t && t.__esModule) return t;
    if (null === t || "object" != typeof t && "function" != typeof t) return {
        default: t
    };
    var a = r(e);
    if (a && a.has(t)) return a.get(t);
    var o = {}, i = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var n in t) if ("default" !== n && Object.prototype.hasOwnProperty.call(t, n)) {
        var l = i ? Object.getOwnPropertyDescriptor(t, n) : null;
        l && (l.get || l.set) ? Object.defineProperty(o, n, l) : o[n] = t[n];
    }
    o.default = t, a && a.set(t, o);
    return o;
}(require("../../ec-canvas/echarts")), i = (t = require("./mapData.js")) && t.__esModule ? t : {
    default: t
};

function r(t) {
    if ("function" != typeof WeakMap) return null;
    var e = new WeakMap(), a = new WeakMap();
    return (r = function(t) {
        return t ? a : e;
    })(t);
}

var n = require("../../config/myApi"), l = n.req_countHiveData, s = n.req_statisticsType, c = n.req_statisticsAccessNum, f = n.req_statisticsAbnormal, d = n.req_statisticsDistribution, u = require("../../config/api"), h = u.req_findProjectHiveList, m = u.req_statisticsWeight, p = [], y = 0, b = [], x = [], S = [], v = [], g = [], w = [], A = [], L = [], O = [], z = [ {
    colorStart: "#43413d",
    colorEnd: "#68655f"
}, {
    colorStart: "#ff7700",
    colorEnd: "#ff9100"
}, {
    colorStart: "#fccf00",
    colorEnd: "#fbe23d"
}, {
    colorStart: "#51a3ef",
    colorEnd: "#79bff6"
}, {
    colorStart: "#e95283",
    colorEnd: "#f272a1"
}, {
    colorStart: "#00ce72",
    colorEnd: "#00ff8c"
} ], j = null;

Page({
    onShareAppMessage: function(t) {
        return {
            title: "ECharts 可以在微信小程序中使用啦！",
            path: "/pages/index/index",
            success: function() {},
            fail: function() {}
        };
    },
    data: {
        echarts1: {
            onInit: function(t, e, a, i) {
                var r = o.init(t, null, {
                    width: e,
                    height: a,
                    devicePixelRatio: i
                });
                t.setChart(r);
                var n = {
                    backgroundColor: "#f9f9f9",
                    tooltip: {},
                    title: {
                        text: y,
                        subtext: "7天预警总数",
                        left: "center",
                        top: "26%",
                        textStyle: {
                            fontSize: 32,
                            color: "#333",
                            fontWeight: "600",
                            align: "center"
                        },
                        subtextStyle: {
                            fontSize: 14,
                            color: "#999999"
                        }
                    },
                    legend: {
                        icon: "circle",
                        orient: "horizontal",
                        itemWidth: 8,
                        itemHeight: 8,
                        x: "center",
                        y: "bottom",
                        textStyle: {
                            color: "#999",
                            fontSize: "12rpx"
                        }
                    },
                    series: [ {
                        label: {
                            normal: {
                                fontSize: 14
                            }
                        },
                        type: "pie",
                        center: [ "50%", "36%" ],
                        radius: [ "42%", "60%" ],
                        hoverAnimation: !1,
                        labelLine: {
                            normal: {
                                length: 14,
                                length2: 14
                            }
                        },
                        itemStyle: {
                            color: "inherit",
                            normal: {
                                label: {
                                    formatter: function(t) {
                                        return t.percent + "%\n" + t.name;
                                    }
                                },
                                borderWidth: 4,
                                borderColor: "#F9F9F9",
                                color: function(t) {
                                    return new o.graphic.LinearGradient(0, 0, 1, 0, [ {
                                        offset: 0,
                                        color: z[t.dataIndex].colorStart
                                    }, {
                                        offset: 1,
                                        color: z[t.dataIndex].colorEnd
                                    } ]);
                                }
                            }
                        },
                        data: p.map(function(t, e) {
                            return t.label = {
                                color: z[e].colorEnd
                            }, t;
                        })
                    }, {
                        type: "pie",
                        center: [ "50%", "36%" ],
                        radius: [ "42%", "60%" ],
                        hoverAnimation: !1,
                        silent: "ture",
                        data: [ 100 ],
                        color: "rgba(0,0,0,0.08)",
                        itemStyle: {}
                    } ]
                };
                return r.setOption(n), r;
            }
        },
        echarts2: {
            onInit: function(t, e, a, i) {
                j = o.init(t, null, {
                    width: e,
                    height: a,
                    devicePixelRatio: i
                }), t.setChart(j);
                var r = {
                    tooltip: {
                        show: !0,
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        },
                        formatter: function(t) {
                            return t[0].axisValue + "\n" + t[0].marker + t[0].seriesName + "：" + t[0].value;
                        },
                        confine: !0
                    },
                    color: [ {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [ {
                            offset: 0,
                            color: "#ff7700"
                        }, {
                            offset: 1,
                            color: "#ff9100"
                        } ]
                    }, {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [ {
                            offset: 0,
                            color: "#43413d"
                        }, {
                            offset: 1,
                            color: "#68655f"
                        } ]
                    } ],
                    legend: {
                        icon: "circle",
                        data: [ "蜜蜂出入巢" ],
                        orient: "horizontal",
                        itemWidth: 8,
                        itemHeight: 8,
                        x: "center",
                        y: "bottom",
                        textStyle: {
                            color: "#999",
                            fontSize: "14px"
                        }
                    },
                    grid: {
                        left: 0,
                        right: 0,
                        bottom: 30,
                        top: 10,
                        containLabel: !0
                    },
                    xAxis: [ {
                        data: x,
                        type: "category",
                        axisTick: {
                            show: !1
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#e5e5ea",
                                width: 1,
                                type: "solid"
                            }
                        },
                        axisLabel: {
                            show: !0,
                            textStyle: {
                                color: "#999",
                                fontSize: 10
                            }
                        }
                    } ],
                    yAxis: [ {
                        type: "value",
                        minInterval: 1,
                        axisTick: {
                            show: !1
                        },
                        splitLine: {
                            lineStyle: {
                                width: 1,
                                type: "dashed"
                            },
                            show: !0
                        },
                        axisLine: {
                            show: !0,
                            lineStyle: {
                                color: "#e5e5ea",
                                width: 1,
                                type: "solid"
                            }
                        },
                        axisLabel: {
                            show: !0,
                            textStyle: {
                                color: "#999",
                                fontSize: 10
                            }
                        }
                    } ],
                    series: [ {
                        name: "蜜蜂出入巢",
                        type: "bar",
                        stack: "总量",
                        barWidth: 12,
                        label: {
                            normal: {
                                show: !1
                            }
                        },
                        itemStyle: {
                            barBorderRadius: [ 12, 12, 0, 0 ]
                        },
                        data: b
                    } ]
                };
                return j.setOption(r), j;
            }
        },
        echarts3: {
            onInit: function(t, e, i, r) {
                j = o.init(t, null, {
                    width: e,
                    height: i,
                    devicePixelRatio: r
                }), t.setChart(j);
                var n = {
                    title: {
                        text: ""
                    },
                    color: [ "#0e65ff", "#fe7243", "#ff0e52", "#b543fe", "#2ad39e", "#ffcb2c", "#fe4743", "#fe43f3", "#08cde9" ],
                    tooltip: {
                        trigger: "axis"
                    },
                    dataZoom: [ {
                        show: !1,
                        start: 0,
                        end: 100
                    } ],
                    legend: {
                        icon: "circle",
                        orient: "horizontal",
                        itemWidth: 8,
                        itemHeight: 8,
                        x: "center",
                        y: "bottom",
                        textStyle: {
                            color: "#999",
                            fontSize: "14px"
                        }
                    },
                    grid: {
                        left: 0,
                        right: 0,
                        bottom: 30,
                        top: 10,
                        containLabel: !0
                    },
                    xAxis: {
                        data: w,
                        type: "category",
                        boundaryGap: !0,
                        axisTick: {
                            show: !1
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#e5e5ea",
                                width: 1,
                                type: "solid"
                            }
                        },
                        axisLabel: {
                            show: !0,
                            textStyle: {
                                color: "#999",
                                fontSize: 10
                            }
                        }
                    },
                    yAxis: {
                        type: "value",
                        minInterval: 1,
                        axisTick: {
                            show: !1
                        },
                        splitLine: {
                            lineStyle: {
                                width: 1,
                                type: "dashed"
                            },
                            show: !0
                        },
                        axisLine: {
                            show: !0,
                            lineStyle: {
                                color: "#e5e5ea",
                                width: 1,
                                type: "solid"
                            }
                        },
                        axisLabel: {
                            show: !0,
                            textStyle: {
                                color: "#999",
                                fontSize: 10
                            }
                        }
                    },
                    series: [ a({
                        name: "蜂箱温度",
                        type: "line",
                        data: S,
                        hoverAnimation: !1,
                        showSymbol: !0,
                        symbol: "circle",
                        symbolSize: 0,
                        smooth: !0,
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: "#fff"
                            }
                        },
                        areaStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [ {
                                    offset: 0,
                                    color: "rgba(99,112,120,0.2)"
                                }, {
                                    offset: 1,
                                    color: "rgba(99,112,120,0)"
                                } ],
                                global: !1
                            }
                        }
                    }, "itemStyle", {
                        normal: {
                            color: new o.graphic.LinearGradient(0, 0, 0, 1, [ {
                                offset: 0,
                                color: "#596267"
                            }, {
                                offset: 1,
                                color: "#7d97a7"
                            } ])
                        }
                    }), a({
                        name: "蜂箱湿度",
                        type: "line",
                        data: v,
                        hoverAnimation: !1,
                        showSymbol: !0,
                        symbol: "circle",
                        symbolSize: 0,
                        smooth: !0,
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: "#fff"
                            }
                        },
                        areaStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [ {
                                    offset: 0,
                                    color: "rgba(255,199,0,0.2)"
                                }, {
                                    offset: 1,
                                    color: "rgba(255,199,0,0)"
                                } ],
                                global: !1
                            }
                        }
                    }, "itemStyle", {
                        normal: {
                            color: new o.graphic.LinearGradient(0, 0, 0, 1, [ {
                                offset: 0,
                                color: "#ff7700"
                            }, {
                                offset: 1,
                                color: "#ff9100"
                            } ])
                        }
                    }), a({
                        name: "蒸发皿温度",
                        type: "line",
                        data: g,
                        hoverAnimation: !1,
                        showSymbol: !0,
                        symbol: "circle",
                        symbolSize: 0,
                        smooth: !0,
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: "#fff"
                            }
                        },
                        areaStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [ {
                                    offset: 0,
                                    color: "rgba(252,207,0,0.2)"
                                }, {
                                    offset: 1,
                                    color: "rgba(252,207,0,0)"
                                } ],
                                global: !1
                            }
                        }
                    }, "itemStyle", {
                        normal: {
                            color: new o.graphic.LinearGradient(0, 0, 0, 1, [ {
                                offset: 0,
                                color: "#fccf00"
                            }, {
                                offset: 1,
                                color: "#fbe23d"
                            } ])
                        }
                    }) ]
                };
                return j.setOption(n), j;
            }
        },
        echarts4: {
            onInit: function(t, e, a, r) {
                var n = o.init(t, null, {
                    width: e,
                    height: a,
                    devicePixelRatio: r
                });
                t.setChart(n), o.registerMap("china", i.default);
                var l = {
                    tooltip: {
                        trigger: "item"
                    },
                    grid: {
                        right: 0,
                        top: 0,
                        bottom: 0
                    },
                    visualMap: {
                        x: "left",
                        y: "bottom",
                        itemWidth: "9px",
                        itemHeight: "9px",
                        textStyle: {
                            fontSize: "8px",
                            color: "#747474"
                        },
                        splitList: [ {
                            start: 200,
                            color: "#ff7700",
                            label: "≥200"
                        }, {
                            start: 101,
                            end: 200,
                            color: "\t#ff8e2d",
                            label: "101-200"
                        }, {
                            start: 1,
                            end: 100,
                            color: "#ffa253",
                            label: "1-100"
                        }, {
                            start: 0,
                            end: 0,
                            color: "#fff",
                            label: "0"
                        } ]
                    },
                    series: [ {
                        name: "地区人数",
                        type: "map",
                        mapType: "china",
                        scaleLimit: {
                            min: 1.2,
                            max: 2.4
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: .5,
                                borderColor: "#333",
                                areaColor: "#fff",
                                label: {
                                    fontSize: "10px",
                                    show: !0,
                                    textStyle: {
                                        color: "#000"
                                    }
                                }
                            },
                            emphasis: {
                                label: {
                                    show: !0
                                }
                            }
                        },
                        data: O
                    } ]
                };
                return n.setOption(l), n;
            }
        },
        echarts5: {
            onInit: function(t, e, i, r) {
                j = o.init(t, null, {
                    width: e,
                    height: i,
                    devicePixelRatio: r
                }), t.setChart(j);
                var n = {
                    title: {
                        text: ""
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    dataZoom: [ {
                        show: !1,
                        start: 0,
                        end: 100
                    } ],
                    legend: {
                        icon: "circle",
                        orient: "horizontal",
                        itemWidth: 8,
                        itemHeight: 8,
                        x: "center",
                        y: "bottom",
                        textStyle: {
                            color: "#999",
                            fontSize: "14px"
                        }
                    },
                    grid: {
                        left: 0,
                        right: 0,
                        bottom: 30,
                        top: 10,
                        containLabel: !0
                    },
                    xAxis: {
                        data: L,
                        type: "category",
                        boundaryGap: !0,
                        axisTick: {
                            show: !1
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#e5e5ea",
                                width: 1,
                                type: "solid"
                            }
                        },
                        axisLabel: {
                            show: !0,
                            textStyle: {
                                color: "#999",
                                fontSize: 10
                            }
                        }
                    },
                    yAxis: {
                        type: "value",
                        minInterval: 1,
                        axisTick: {
                            show: !1
                        },
                        splitLine: {
                            lineStyle: {
                                width: 1,
                                type: "dashed"
                            },
                            show: !0
                        },
                        axisLine: {
                            show: !0,
                            lineStyle: {
                                color: "#e5e5ea",
                                width: 1,
                                type: "solid"
                            }
                        },
                        axisLabel: {
                            show: !0,
                            textStyle: {
                                color: "#999",
                                fontSize: 10
                            }
                        }
                    },
                    series: [ a({
                        name: "蜂箱超重",
                        type: "line",
                        data: A,
                        hoverAnimation: !1,
                        showSymbol: !0,
                        symbol: "circle",
                        symbolSize: 0,
                        smooth: !0,
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: "#fff"
                            }
                        },
                        areaStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [ {
                                    offset: 0,
                                    color: "rgba(99,112,120,0.2)"
                                }, {
                                    offset: 1,
                                    color: "rgba(99,112,120,0)"
                                } ],
                                global: !1
                            }
                        }
                    }, "itemStyle", {
                        normal: {
                            color: new o.graphic.LinearGradient(0, 0, 0, 1, [ {
                                offset: 0,
                                color: "#596267"
                            }, {
                                offset: 1,
                                color: "#7d97a7"
                            } ])
                        }
                    }) ]
                };
                return j.setOption(n), j;
            }
        },
        hiveData: [],
        typeState: !1,
        numState: !1,
        abnormalState: !1,
        mapState: !1,
        overWeightState: !1,
        zArray: [],
        multiObjArray: [ [], [] ],
        multiIndex: [],
        multiObList: []
    },
    onLoad: function() {
        this.fetchProjectHive(), this.fetchData(), this.findType(), this.findNum(), this.findAbnormal(), 
        this.findOverWeight(), this.findMap();
    },
    fetchProjectHive: function() {
        var t = this;
        h().then(function(e) {
            if (2e4 === e.data.code) {
                var a = e.data.data;
                a = (a = (a = (a = a.map(function(t) {
                    return {
                        name: t.project_name,
                        field1: t.parentId,
                        value: t.project_id
                    };
                })).map(function(t) {
                    return t.list = a.filter(function(e) {
                        return e.field1 == t.value;
                    }), t;
                })).filter(function(t) {
                    return !e.data.data.find(function(e) {
                        return e.project_id == t.field1;
                    });
                })).map(function(t) {
                    return t.list = [ {
                        name: t.name,
                        field1: t.field1,
                        value: t.value
                    } ].concat(t.list), t;
                }), t.setData({
                    zArray: a,
                    "multiObjArray[0]": a,
                    "multiObjArray[1]": a[0].list
                });
            }
        });
    },
    fetchData: function(t) {
        var e = this, a = "", o = "";
        t && (-1 != t.indexOf("A") ? o = t.substr(1, t.length - 1) : a = t), l({
            projectId: a,
            hiveId: o
        }).then(function(t) {
            2e4 === t.data.code ? e.setData({
                hiveData: t.data.data
            }) : wx.showToast({
                title: t.data.message,
                icon: "none"
            });
        });
    },
    findType: function(t) {
        var e = this;
        this.setData({
            typeState: !1,
            numState: !1,
            abnormalState: !1,
            mapState: !1,
            overWeightState: !1
        });
        var a = "", o = "";
        t && (-1 != t.indexOf("A") ? o = t.substr(1, t.length - 1) : a = t), s({
            flag: 1,
            projectId: a,
            hiveId: o
        }).then(function(t) {
            if (2e4 === t.data.code) {
                var a = [ {
                    value: t.data.data.num1,
                    name: "蜂王离巢"
                }, {
                    value: t.data.data.num2,
                    name: "蜂箱温度异常"
                }, {
                    value: t.data.data.num3,
                    name: "蜂箱湿度异常"
                }, {
                    value: t.data.data.num4,
                    name: "蒸发皿温度异常"
                }, {
                    value: t.data.data.num5,
                    name: "设备掉线"
                }, {
                    value: t.data.data.num6,
                    name: "蜂箱超重"
                } ];
                p = a, y = t.data.data.totalNum, e.setData({
                    typeState: !0
                });
            } else wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    findNum: function(t) {
        var a = this, o = "", i = "";
        t && (-1 != t.indexOf("A") ? i = t.substr(1, t.length - 1) : o = t), c({
            flag: 1,
            projectId: o,
            hiveId: i
        }).then(function(t) {
            if (2e4 === t.data.code) {
                var o = t.data.data.map(function(t) {
                    var a = e({}, t);
                    return a.enterNum = t.enterNum ? t.enterNum : 0, a;
                });
                b = o.map(function(t) {
                    return t.enterNum;
                }), o.map(function(t) {
                    return -t.outNum;
                }), x = o.map(function(t) {
                    return Number(t.dayStr.slice(5).replace("-", "."));
                }), a.setData({
                    numState: !0
                });
            } else wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    findAbnormal: function(t) {
        var e = this, a = "", o = "";
        t && (-1 != t.indexOf("A") ? o = t.substr(1, t.length - 1) : a = t), f({
            flag: 1,
            projectId: a,
            hiveId: o
        }).then(function(t) {
            if (2e4 === t.data.code) {
                var a = t.data.data;
                S = a.map(function(t) {
                    return t.num2;
                }), v = a.map(function(t) {
                    return t.num3;
                }), g = a.map(function(t) {
                    return t.num4;
                }), w = a.map(function(t) {
                    return Number(t.dayStr.slice(5).replace("-", "."));
                }), e.setData({
                    abnormalState: !0
                });
            } else wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    findOverWeight: function(t) {
        var e = this, a = "", o = "";
        t && (-1 != t.indexOf("A") ? o = t.substr(1, t.length - 1) : a = t), m({
            projectId: a,
            hiveId: o
        }).then(function(t) {
            if (2e4 === t.data.code) {
                var a = t.data.data;
                A = a.map(function(t) {
                    return t.num;
                }), L = a.map(function(t) {
                    return Number(t.dayStr.slice(5).replace("-", "."));
                }), e.setData({
                    overWeightState: !0
                });
            } else wx.showToast({
                title: t.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    findMap: function() {
        var t = this;
        d({
            flag: 1
        }).then(function(e) {
            if (2e4 === e.data.code) {
                var a = e.data.data;
                O = a.map(function(t) {
                    var e = t.province;
                    return "黑龙江" == e.slice(0, 3) || "哈尔滨" == e.slice(0, 3) ? {
                        name: t.province.slice(0, 3),
                        value: t.num
                    } : {
                        name: t.province.slice(0, 2),
                        value: t.num
                    };
                }), t.setData({
                    mapState: !0
                });
            } else wx.showToast({
                title: e.data.message,
                icon: "none",
                duration: 2e3
            });
        });
    },
    bindMultiPickerChange: function(t) {
        var e = this.data.multiObjArray[1][t.detail.value[1]];
        this.setData({
            multiIndex: t.detail.value
        }), this.fetchData(e.value), this.findType(e.value), this.findNum(e.value), this.findAbnormal(e.value), 
        this.findOverWeight(e.value);
    },
    bindMultiPickerColumnChange: function(t) {
        var e = this.data.zArray;
        0 == t.detail.column && this.setData({
            "multiObjArray[1]": e[t.detail.value].list
        });
    }
});