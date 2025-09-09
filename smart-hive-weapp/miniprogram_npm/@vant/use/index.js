var n, e, t = require("../../../@babel/runtime/helpers/createForOfIteratorHelper"), r = require("../../../@babel/runtime/helpers/typeof");

module.exports = (n = {}, e = function(e, t) {
    if (!n[e]) return require(t);
    if (!n[e].status) {
        var u = n[e].m;
        u._exports = u._tempexports;
        var i = Object.getOwnPropertyDescriptor(u, "exports");
        i && i.configurable && Object.defineProperty(u, "exports", {
            set: function(n) {
                "object" === r(n) && n !== u._exports && (u._exports.__proto__ = n.__proto__, Object.keys(n).forEach(function(e) {
                    u._exports[e] = n[e];
                })), u._tempexports = n;
            },
            get: function() {
                return u._tempexports;
            }
        }), n[e].status = 1, n[e].func(n[e].req, u, u.exports);
    }
    return n[e].m.exports;
}, function(e, t, r) {
    n[e] = {
        status: 0,
        func: t,
        req: r,
        m: {
            exports: {},
            _tempexports: {}
        }
    };
}(1660636213236, function(n, e, u) {
    var i, o = Object.defineProperty, a = Object.getOwnPropertyDescriptor, c = Object.getOwnPropertyNames, f = Object.prototype.hasOwnProperty, v = {};
    !function(n, e) {
        for (var t in e) o(n, t, {
            get: e[t],
            enumerable: !0
        });
    }(v, {
        CUSTOM_FIELD_INJECTION_KEY: function() {
            return G;
        },
        cancelRaf: function() {
            return p;
        },
        doubleRaf: function() {
            return h;
        },
        flattenVNodes: function() {
            return C;
        },
        getScrollParent: function() {
            return U;
        },
        inBrowser: function() {
            return l;
        },
        onMountedOrActivated: function() {
            return N;
        },
        raf: function() {
            return d;
        },
        sortChildren: function() {
            return M;
        },
        supportsPassive: function() {
            return s;
        },
        useChildren: function() {
            return j;
        },
        useClickAway: function() {
            return L;
        },
        useCountDown: function() {
            return P;
        },
        useCustomFieldValue: function() {
            return Q;
        },
        useEventListener: function() {
            return A;
        },
        usePageVisibility: function() {
            return J;
        },
        useParent: function() {
            return O;
        },
        useRect: function() {
            return w;
        },
        useScrollParent: function() {
            return W;
        },
        useToggle: function() {
            return x;
        },
        useWindowSize: function() {
            return I;
        }
    }), e.exports = (i = v, function(n, e, u, i) {
        if (e && "object" === r(e) || "function" == typeof e) {
            var v, l = t(c(e));
            try {
                var s = function() {
                    var t = v.value;
                    f.call(n, t) || t === u || o(n, t, {
                        get: function() {
                            return e[t];
                        },
                        enumerable: !(i = a(e, t)) || i.enumerable
                    });
                };
                for (l.s(); !(v = l.n()).done; ) s();
            } catch (n) {
                l.e(n);
            } finally {
                l.f();
            }
        }
        return n;
    }(o({}, "__esModule", {
        value: !0
    }), i));
    var l = "undefined" != typeof window, s = !0;
    function d(n) {
        return l ? requestAnimationFrame(n) : -1;
    }
    function p(n) {
        l && cancelAnimationFrame(n);
    }
    function h(n) {
        d(function() {
            return d(n);
        });
    }
    var m = n("vue"), g = function(n, e) {
        return {
            top: 0,
            left: 0,
            right: n,
            bottom: e,
            width: n,
            height: e
        };
    }, w = function(n) {
        var e = (0, m.unref)(n);
        if (e === window) {
            var t = e.innerWidth, r = e.innerHeight;
            return g(t, r);
        }
        return (null == e ? void 0 : e.getBoundingClientRect) ? e.getBoundingClientRect() : g(0, 0);
    }, b = n("vue");
    function x() {
        var n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], e = (0, 
        b.ref)(n), t = function() {
            var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : !e.value;
            e.value = n;
        };
        return [ e, t ];
    }
    var y = n("vue");
    function O(n) {
        var e = (0, y.inject)(n, null);
        if (e) {
            var t = (0, y.getCurrentInstance)(), r = e.link, u = e.unlink, i = e.internalChildren;
            return r(t), (0, y.onUnmounted)(function() {
                return u(t);
            }), {
                parent: e,
                index: (0, y.computed)(function() {
                    return i.indexOf(t);
                })
            };
        }
        return {
            parent: null,
            index: (0, y.ref)(-1)
        };
    }
    var _ = n("vue");
    function C(n) {
        var e = [], t = function(n) {
            Array.isArray(n) && n.forEach(function(n) {
                var r;
                (0, _.isVNode)(n) && (e.push(n), (null == (r = n.component) ? void 0 : r.subTree) && (e.push(n.component.subTree), 
                t(n.component.subTree.children)), n.children && t(n.children));
            });
        };
        return t(n), e;
    }
    function M(n, e, t) {
        var r = C(n.subTree.children);
        t.sort(function(n, e) {
            return r.indexOf(n.vnode) - r.indexOf(e.vnode);
        });
        var u = t.map(function(n) {
            return n.proxy;
        });
        e.sort(function(n, e) {
            return u.indexOf(n) - u.indexOf(e);
        });
    }
    function j(n) {
        var e = (0, _.reactive)([]), t = (0, _.reactive)([]), r = (0, _.getCurrentInstance)();
        return {
            children: e,
            linkChildren: function(u) {
                (0, _.provide)(n, Object.assign({
                    link: function(n) {
                        n.proxy && (t.push(n), e.push(n.proxy), M(r, e, t));
                    },
                    unlink: function(n) {
                        var r = t.indexOf(n);
                        e.splice(r, 1), t.splice(r, 1);
                    },
                    children: e,
                    internalChildren: t
                }, u));
            }
        };
    }
    var E = n("vue");
    function P(n) {
        var e, t, r, u, i = (0, E.ref)(n.time), o = (0, E.computed)(function() {
            return {
                total: n = i.value,
                days: Math.floor(n / 864e5),
                hours: Math.floor(n % 864e5 / 36e5),
                minutes: Math.floor(n % 36e5 / 6e4),
                seconds: Math.floor(n % 6e4 / 1e3),
                milliseconds: Math.floor(n % 1e3)
            };
            var n;
        }), a = function() {
            r = !1, p(e);
        }, c = function() {
            return Math.max(t - Date.now(), 0);
        }, f = function(e) {
            var t, r;
            i.value = e, null == (t = n.onChange) || t.call(n, o.value), 0 === e && (a(), null == (r = n.onFinish) || r.call(n));
        }, v = function() {
            e = d(function() {
                r && (f(c()), i.value > 0 && v());
            });
        }, s = function() {
            e = d(function() {
                if (r) {
                    var n = c();
                    e = n, t = i.value, (Math.floor(e / 1e3) !== Math.floor(t / 1e3) || 0 === n) && f(n), 
                    i.value > 0 && s();
                }
                var e, t;
            });
        }, h = function() {
            l && (n.millisecond ? v() : s());
        };
        return (0, E.onBeforeUnmount)(a), (0, E.onActivated)(function() {
            u && (r = !0, u = !1, h());
        }), (0, E.onDeactivated)(function() {
            r && (a(), u = !0);
        }), {
            start: function() {
                r || (t = Date.now() + i.value, r = !0, h());
            },
            pause: a,
            reset: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.time;
                a(), i.value = e;
            },
            current: o
        };
    }
    var T = n("vue"), k = n("vue"), D = n("vue");
    function N(n) {
        var e;
        (0, D.onMounted)(function() {
            n(), (0, D.nextTick)(function() {
                e = !0;
            });
        }), (0, D.onActivated)(function() {
            e && n();
        });
    }
    function A(n, e) {
        var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        if (l) {
            var r, u = t.target, i = void 0 === u ? window : u, o = t.passive, a = void 0 !== o && o, c = t.capture, f = void 0 !== c && c, v = function(t) {
                var u = (0, k.unref)(t);
                u && !r && (u.addEventListener(n, e, {
                    capture: f,
                    passive: a
                }), r = !0);
            }, s = function(t) {
                var u = (0, k.unref)(t);
                u && r && (u.removeEventListener(n, e, f), r = !1);
            };
            (0, k.onUnmounted)(function() {
                return s(i);
            }), (0, k.onDeactivated)(function() {
                return s(i);
            }), N(function() {
                return v(i);
            }), (0, k.isRef)(i) && (0, k.watch)(i, function(n, e) {
                s(e), v(n);
            });
        }
    }
    function L(n, e) {
        var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        if (l) {
            var r = t.eventName, u = void 0 === r ? "click" : r, i = function(t) {
                var r = (0, T.unref)(n);
                r && !r.contains(t.target) && e(t);
            };
            A(u, i, {
                target: document
            });
        }
    }
    var V, q, F = n("vue");
    function I() {
        if (!V && (V = (0, F.ref)(0), q = (0, F.ref)(0), l)) {
            var n = function() {
                V.value = window.innerWidth, q.value = window.innerHeight;
            };
            n(), window.addEventListener("resize", n, {
                passive: !0
            }), window.addEventListener("orientationchange", n, {
                passive: !0
            });
        }
        return {
            width: V,
            height: q
        };
    }
    var R = n("vue"), S = /scroll|auto/i, B = l ? window : void 0;
    function H(n) {
        return "HTML" !== n.tagName && "BODY" !== n.tagName && 1 === n.nodeType;
    }
    function U(n) {
        for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : B, t = n; t && t !== e && H(t); ) {
            var r = window.getComputedStyle(t), u = r.overflowY;
            if (S.test(u)) return t;
            t = t.parentNode;
        }
        return e;
    }
    function W(n) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : B, t = (0, 
        R.ref)();
        return (0, R.onMounted)(function() {
            n.value && (t.value = U(n.value, e));
        }), t;
    }
    var Y, z = n("vue");
    function J() {
        if (!Y && (Y = (0, z.ref)("visible"), l)) {
            var n = function() {
                Y.value = document.hidden ? "hidden" : "visible";
            };
            n(), window.addEventListener("visibilitychange", n);
        }
        return Y;
    }
    var K = n("vue"), G = Symbol("van-field");
    function Q(n) {
        var e = (0, K.inject)(G, null);
        e && !e.customValue.value && (e.customValue.value = n, (0, K.watch)(n, function() {
            e.resetValidation(), e.validateWithTrigger("onChange");
        }));
    }
}, function(n) {
    return e({}[n], n);
}), e(1660636213236));