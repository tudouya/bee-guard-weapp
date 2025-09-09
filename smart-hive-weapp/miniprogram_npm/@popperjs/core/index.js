var e, t, n = require("../../../@babel/runtime/helpers/typeof");

module.exports = (e = {}, t = function(t, r) {
    if (!e[t]) return require(r);
    if (!e[t].status) {
        var o = e[t].m;
        o._exports = o._tempexports;
        var i = Object.getOwnPropertyDescriptor(o, "exports");
        i && i.configurable && Object.defineProperty(o, "exports", {
            set: function(e) {
                "object" === n(e) && e !== o._exports && (o._exports.__proto__ = e.__proto__, Object.keys(e).forEach(function(t) {
                    o._exports[t] = e[t];
                })), o._tempexports = e;
            },
            get: function() {
                return o._tempexports;
            }
        }), e[t].status = 1, e[t].func(e[t].req, o, o.exports);
    }
    return e[t].m.exports;
}, function(t, n, r) {
    e[t] = {
        status: 0,
        func: n,
        req: r,
        m: {
            exports: {},
            _tempexports: {}
        }
    };
}(1660636213233, function(e, t, n) {
    function r(e) {
        if (null == e) return window;
        if ("[object Window]" !== e.toString()) {
            var t = e.ownerDocument;
            return t && t.defaultView || window;
        }
        return e;
    }
    function o(e) {
        return e instanceof r(e).Element || e instanceof Element;
    }
    function i(e) {
        return e instanceof r(e).HTMLElement || e instanceof HTMLElement;
    }
    function a(e) {
        return "undefined" != typeof ShadowRoot && (e instanceof r(e).ShadowRoot || e instanceof ShadowRoot);
    }
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var s = Math.max, f = Math.min, p = Math.round;
    function c() {
        var e = navigator.userAgentData;
        return null != e && e.brands ? e.brands.map(function(e) {
            return e.brand + "/" + e.version;
        }).join(" ") : navigator.userAgent;
    }
    function u() {
        return !/^((?!chrome|android).)*safari/i.test(c());
    }
    function l(e, t, n) {
        void 0 === t && (t = !1), void 0 === n && (n = !1);
        var a = e.getBoundingClientRect(), s = 1, f = 1;
        t && i(e) && (s = e.offsetWidth > 0 && p(a.width) / e.offsetWidth || 1, f = e.offsetHeight > 0 && p(a.height) / e.offsetHeight || 1);
        var c = (o(e) ? r(e) : window).visualViewport, l = !u() && n, d = (a.left + (l && c ? c.offsetLeft : 0)) / s, m = (a.top + (l && c ? c.offsetTop : 0)) / f, h = a.width / s, v = a.height / f;
        return {
            width: h,
            height: v,
            top: m,
            right: d + h,
            bottom: m + v,
            left: d,
            x: d,
            y: m
        };
    }
    function d(e) {
        var t = r(e);
        return {
            scrollLeft: t.pageXOffset,
            scrollTop: t.pageYOffset
        };
    }
    function m(e) {
        return e ? (e.nodeName || "").toLowerCase() : null;
    }
    function h(e) {
        return ((o(e) ? e.ownerDocument : e.document) || window.document).documentElement;
    }
    function v(e) {
        return l(h(e)).left + d(e).scrollLeft;
    }
    function g(e) {
        return r(e).getComputedStyle(e);
    }
    function y(e) {
        var t = g(e), n = t.overflow, r = t.overflowX, o = t.overflowY;
        return /auto|scroll|overlay|hidden/.test(n + o + r);
    }
    function b(e, t, n) {
        void 0 === n && (n = !1);
        var o, a, s = i(t), f = i(t) && function(e) {
            var t = e.getBoundingClientRect(), n = p(t.width) / e.offsetWidth || 1, r = p(t.height) / e.offsetHeight || 1;
            return 1 !== n || 1 !== r;
        }(t), c = h(t), u = l(e, f, n), g = {
            scrollLeft: 0,
            scrollTop: 0
        }, b = {
            x: 0,
            y: 0
        };
        return (s || !s && !n) && (("body" !== m(t) || y(c)) && (g = (o = t) !== r(o) && i(o) ? {
            scrollLeft: (a = o).scrollLeft,
            scrollTop: a.scrollTop
        } : d(o)), i(t) ? ((b = l(t, !0)).x += t.clientLeft, b.y += t.clientTop) : c && (b.x = v(c))), 
        {
            x: u.left + g.scrollLeft - b.x,
            y: u.top + g.scrollTop - b.y,
            width: u.width,
            height: u.height
        };
    }
    function w(e) {
        var t = l(e), n = e.offsetWidth, r = e.offsetHeight;
        return Math.abs(t.width - n) <= 1 && (n = t.width), Math.abs(t.height - r) <= 1 && (r = t.height), 
        {
            x: e.offsetLeft,
            y: e.offsetTop,
            width: n,
            height: r
        };
    }
    function x(e) {
        return "html" === m(e) ? e : e.assignedSlot || e.parentNode || (a(e) ? e.host : null) || h(e);
    }
    function O(e, t) {
        var n;
        void 0 === t && (t = []);
        var o = function e(t) {
            return [ "html", "body", "#document" ].indexOf(m(t)) >= 0 ? t.ownerDocument.body : i(t) && y(t) ? t : e(x(t));
        }(e), a = o === (null == (n = e.ownerDocument) ? void 0 : n.body), s = r(o), f = a ? [ s ].concat(s.visualViewport || [], y(o) ? o : []) : o, p = t.concat(f);
        return a ? p : p.concat(O(x(f)));
    }
    function E(e) {
        return [ "table", "td", "th" ].indexOf(m(e)) >= 0;
    }
    function j(e) {
        return i(e) && "fixed" !== g(e).position ? e.offsetParent : null;
    }
    function D(e) {
        for (var t = r(e), n = j(e); n && E(n) && "static" === g(n).position; ) n = j(n);
        return n && ("html" === m(n) || "body" === m(n) && "static" === g(n).position) ? t : n || function(e) {
            var t = /firefox/i.test(c());
            if (/Trident/i.test(c()) && i(e) && "fixed" === g(e).position) return null;
            var n = x(e);
            for (a(n) && (n = n.host); i(n) && [ "html", "body" ].indexOf(m(n)) < 0; ) {
                var r = g(n);
                if ("none" !== r.transform || "none" !== r.perspective || "paint" === r.contain || -1 !== [ "transform", "perspective" ].indexOf(r.willChange) || t && "filter" === r.willChange || t && r.filter && "none" !== r.filter) return n;
                n = n.parentNode;
            }
            return null;
        }(e) || t;
    }
    var S = "top", P = "bottom", k = "right", A = "left", _ = [ S, P, k, A ], q = _.reduce(function(e, t) {
        return e.concat([ t + "-start", t + "-end" ]);
    }, []), L = [].concat(_, [ "auto" ]).reduce(function(e, t) {
        return e.concat([ t, t + "-start", t + "-end" ]);
    }, []), M = [ "beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite" ];
    function N(e) {
        var t = new Map(), n = new Set(), r = [];
        return e.forEach(function(e) {
            t.set(e.name, e);
        }), e.forEach(function(e) {
            n.has(e.name) || function e(o) {
                n.add(o.name), [].concat(o.requires || [], o.requiresIfExists || []).forEach(function(r) {
                    if (!n.has(r)) {
                        var o = t.get(r);
                        o && e(o);
                    }
                }), r.push(o);
            }(e);
        }), r;
    }
    function T(e) {
        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
        return [].concat(n).reduce(function(e, t) {
            return e.replace(/%s/, t);
        }, e);
    }
    var V = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s', W = [ "name", "enabled", "phase", "fn", "effect", "requires", "options" ];
    function H(e) {
        return e.split("-")[0];
    }
    function B(e, t) {
        var n = t.getRootNode && t.getRootNode();
        if (e.contains(t)) return !0;
        if (n && a(n)) {
            var r = t;
            do {
                if (r && e.isSameNode(r)) return !0;
                r = r.parentNode || r.host;
            } while (r);
        }
        return !1;
    }
    function R(e) {
        return Object.assign({}, e, {
            left: e.x,
            top: e.y,
            right: e.x + e.width,
            bottom: e.y + e.height
        });
    }
    function C(e, t, n) {
        return "viewport" === t ? R(function(e, t) {
            var n = r(e), o = h(e), i = n.visualViewport, a = o.clientWidth, s = o.clientHeight, f = 0, p = 0;
            if (i) {
                a = i.width, s = i.height;
                var c = u();
                (c || !c && "fixed" === t) && (f = i.offsetLeft, p = i.offsetTop);
            }
            return {
                width: a,
                height: s,
                x: f + v(e),
                y: p
            };
        }(e, n)) : o(t) ? function(e, t) {
            var n = l(e, !1, "fixed" === t);
            return n.top = n.top + e.clientTop, n.left = n.left + e.clientLeft, n.bottom = n.top + e.clientHeight, 
            n.right = n.left + e.clientWidth, n.width = e.clientWidth, n.height = e.clientHeight, 
            n.x = n.left, n.y = n.top, n;
        }(t, n) : R(function(e) {
            var t, n = h(e), r = d(e), o = null == (t = e.ownerDocument) ? void 0 : t.body, i = s(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0), a = s(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0), f = -r.scrollLeft + v(e), p = -r.scrollTop;
            return "rtl" === g(o || n).direction && (f += s(n.clientWidth, o ? o.clientWidth : 0) - i), 
            {
                width: i,
                height: a,
                x: f,
                y: p
            };
        }(h(e)));
    }
    function I(e, t, n, r) {
        var a = "clippingParents" === t ? function(e) {
            var t = O(x(e)), n = [ "absolute", "fixed" ].indexOf(g(e).position) >= 0 && i(e) ? D(e) : e;
            return o(n) ? t.filter(function(e) {
                return o(e) && B(e, n) && "body" !== m(e);
            }) : [];
        }(e) : [].concat(t), p = [].concat(a, [ n ]), c = p[0], u = p.reduce(function(t, n) {
            var o = C(e, n, r);
            return t.top = s(o.top, t.top), t.right = f(o.right, t.right), t.bottom = f(o.bottom, t.bottom), 
            t.left = s(o.left, t.left), t;
        }, C(e, c, r));
        return u.width = u.right - u.left, u.height = u.bottom - u.top, u.x = u.left, u.y = u.top, 
        u;
    }
    function F(e) {
        return e.split("-")[1];
    }
    function U(e) {
        return [ "top", "bottom" ].indexOf(e) >= 0 ? "x" : "y";
    }
    function z(e) {
        var t, n = e.reference, r = e.element, o = e.placement, i = o ? H(o) : null, a = o ? F(o) : null, s = n.x + n.width / 2 - r.width / 2, f = n.y + n.height / 2 - r.height / 2;
        switch (i) {
          case S:
            t = {
                x: s,
                y: n.y - r.height
            };
            break;

          case P:
            t = {
                x: s,
                y: n.y + n.height
            };
            break;

          case k:
            t = {
                x: n.x + n.width,
                y: f
            };
            break;

          case A:
            t = {
                x: n.x - r.width,
                y: f
            };
            break;

          default:
            t = {
                x: n.x,
                y: n.y
            };
        }
        var p = i ? U(i) : null;
        if (null != p) {
            var c = "y" === p ? "height" : "width";
            switch (a) {
              case "start":
                t[p] = t[p] - (n[c] / 2 - r[c] / 2);
                break;

              case "end":
                t[p] = t[p] + (n[c] / 2 - r[c] / 2);
            }
        }
        return t;
    }
    function G(e) {
        return Object.assign({}, {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }, e);
    }
    function X(e, t) {
        return t.reduce(function(t, n) {
            return t[n] = e, t;
        }, {});
    }
    function Y(e, t) {
        void 0 === t && (t = {});
        var n = t, r = n.placement, i = void 0 === r ? e.placement : r, a = n.strategy, s = void 0 === a ? e.strategy : a, f = n.boundary, p = void 0 === f ? "clippingParents" : f, c = n.rootBoundary, u = void 0 === c ? "viewport" : c, d = n.elementContext, m = void 0 === d ? "popper" : d, v = n.altBoundary, g = void 0 !== v && v, y = n.padding, b = void 0 === y ? 0 : y, w = G("number" != typeof b ? b : X(b, _)), x = "popper" === m ? "reference" : "popper", O = e.rects.popper, E = e.elements[g ? x : m], j = I(o(E) ? E : E.contextElement || h(e.elements.popper), p, u, s), D = l(e.elements.reference), A = z({
            reference: D,
            element: O,
            strategy: "absolute",
            placement: i
        }), q = R(Object.assign({}, O, A)), L = "popper" === m ? q : D, M = {
            top: j.top - L.top + w.top,
            bottom: L.bottom - j.bottom + w.bottom,
            left: j.left - L.left + w.left,
            right: L.right - j.right + w.right
        }, N = e.modifiersData.offset;
        if ("popper" === m && N) {
            var T = N[i];
            Object.keys(M).forEach(function(e) {
                var t = [ k, P ].indexOf(e) >= 0 ? 1 : -1, n = [ S, P ].indexOf(e) >= 0 ? "y" : "x";
                M[e] += T[n] * t;
            });
        }
        return M;
    }
    var J = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.", K = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
    };
    function Q() {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
        return !t.some(function(e) {
            return !(e && "function" == typeof e.getBoundingClientRect);
        });
    }
    function Z(e) {
        void 0 === e && (e = {});
        var t = e, n = t.defaultModifiers, r = void 0 === n ? [] : n, i = t.defaultOptions, a = void 0 === i ? K : i;
        return function(e, t, n) {
            void 0 === n && (n = a);
            var i, s, f = {
                placement: "bottom",
                orderedModifiers: [],
                options: Object.assign({}, K, a),
                modifiersData: {},
                elements: {
                    reference: e,
                    popper: t
                },
                attributes: {},
                styles: {}
            }, p = [], c = !1, u = {
                state: f,
                setOptions: function(n) {
                    var i = "function" == typeof n ? n(f.options) : n;
                    l(), f.options = Object.assign({}, a, f.options, i), f.scrollParents = {
                        reference: o(e) ? O(e) : e.contextElement ? O(e.contextElement) : [],
                        popper: O(t)
                    };
                    var s, c, d, m = function(e) {
                        var t = N(e);
                        return M.reduce(function(e, n) {
                            return e.concat(t.filter(function(e) {
                                return e.phase === n;
                            }));
                        }, []);
                    }(function(e) {
                        var t = e.reduce(function(e, t) {
                            var n = e[t.name];
                            return e[t.name] = n ? Object.assign({}, n, t, {
                                options: Object.assign({}, n.options, t.options),
                                data: Object.assign({}, n.data, t.data)
                            }) : t, e;
                        }, {});
                        return Object.keys(t).map(function(e) {
                            return t[e];
                        });
                    }([].concat(r, f.options.modifiers)));
                    if (f.orderedModifiers = m.filter(function(e) {
                        return e.enabled;
                    }), "production" !== process.env.NODE_ENV) {
                        (function(e) {
                            e.forEach(function(t) {
                                [].concat(Object.keys(t), W).filter(function(e, t, n) {
                                    return n.indexOf(e) === t;
                                }).forEach(function(n) {
                                    switch (n) {
                                      case "name":
                                        "string" != typeof t.name && console.error(T(V, String(t.name), '"name"', '"string"', '"' + String(t.name) + '"'));
                                        break;

                                      case "enabled":
                                        "boolean" != typeof t.enabled && console.error(T(V, t.name, '"enabled"', '"boolean"', '"' + String(t.enabled) + '"'));
                                        break;

                                      case "phase":
                                        M.indexOf(t.phase) < 0 && console.error(T(V, t.name, '"phase"', "either " + M.join(", "), '"' + String(t.phase) + '"'));
                                        break;

                                      case "fn":
                                        "function" != typeof t.fn && console.error(T(V, t.name, '"fn"', '"function"', '"' + String(t.fn) + '"'));
                                        break;

                                      case "effect":
                                        null != t.effect && "function" != typeof t.effect && console.error(T(V, t.name, '"effect"', '"function"', '"' + String(t.fn) + '"'));
                                        break;

                                      case "requires":
                                        null == t.requires || Array.isArray(t.requires) || console.error(T(V, t.name, '"requires"', '"array"', '"' + String(t.requires) + '"'));
                                        break;

                                      case "requiresIfExists":
                                        Array.isArray(t.requiresIfExists) || console.error(T(V, t.name, '"requiresIfExists"', '"array"', '"' + String(t.requiresIfExists) + '"'));
                                        break;

                                      case "options":
                                      case "data":
                                        break;

                                      default:
                                        console.error('PopperJS: an invalid property has been provided to the "' + t.name + '" modifier, valid properties are ' + W.map(function(e) {
                                            return '"' + e + '"';
                                        }).join(", ") + '; but "' + n + '" was provided.');
                                    }
                                    t.requires && t.requires.forEach(function(n) {
                                        null == e.find(function(e) {
                                            return e.name === n;
                                        }) && console.error(T('Popper: modifier "%s" requires "%s", but "%s" modifier is not available', String(t.name), n, n));
                                    });
                                });
                            });
                        })((s = [].concat(m, f.options.modifiers), c = function(e) {
                            return e.name;
                        }, d = new Set(), s.filter(function(e) {
                            var t = c(e);
                            if (!d.has(t)) return d.add(t), !0;
                        }))), "auto" === H(f.options.placement) && (f.orderedModifiers.find(function(e) {
                            return "flip" === e.name;
                        }) || console.error([ 'Popper: "auto" placements require the "flip" modifier be', "present and enabled to work." ].join(" ")));
                        var h = g(t);
                        [ h.marginTop, h.marginRight, h.marginBottom, h.marginLeft ].some(function(e) {
                            return parseFloat(e);
                        }) && console.warn([ 'Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers." ].join(" "));
                    }
                    return f.orderedModifiers.forEach(function(e) {
                        var t = e.name, n = e.options, r = void 0 === n ? {} : n, o = e.effect;
                        if ("function" == typeof o) {
                            var i = o({
                                state: f,
                                name: t,
                                instance: u,
                                options: r
                            });
                            p.push(i || function() {});
                        }
                    }), u.update();
                },
                forceUpdate: function() {
                    if (!c) {
                        var e = f.elements, t = e.reference, n = e.popper;
                        if (Q(t, n)) {
                            f.rects = {
                                reference: b(t, D(n), "fixed" === f.options.strategy),
                                popper: w(n)
                            }, f.reset = !1, f.placement = f.options.placement, f.orderedModifiers.forEach(function(e) {
                                return f.modifiersData[e.name] = Object.assign({}, e.data);
                            });
                            for (var r = 0, o = 0; o < f.orderedModifiers.length; o++) {
                                if ("production" !== process.env.NODE_ENV && (r += 1) > 100) {
                                    console.error("Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.");
                                    break;
                                }
                                if (!0 !== f.reset) {
                                    var i = f.orderedModifiers[o], a = i.fn, s = i.options, p = void 0 === s ? {} : s, l = i.name;
                                    "function" == typeof a && (f = a({
                                        state: f,
                                        options: p,
                                        name: l,
                                        instance: u
                                    }) || f);
                                } else f.reset = !1, o = -1;
                            }
                        } else "production" !== process.env.NODE_ENV && console.error(J);
                    }
                },
                update: (i = function() {
                    return new Promise(function(e) {
                        u.forceUpdate(), e(f);
                    });
                }, function() {
                    return s || (s = new Promise(function(e) {
                        Promise.resolve().then(function() {
                            s = void 0, e(i());
                        });
                    })), s;
                }),
                destroy: function() {
                    l(), c = !0;
                }
            };
            if (!Q(e, t)) return "production" !== process.env.NODE_ENV && console.error(J), 
            u;
            function l() {
                p.forEach(function(e) {
                    return e();
                }), p = [];
            }
            return u.setOptions(n).then(function(e) {
                !c && n.onFirstUpdate && n.onFirstUpdate(e);
            }), u;
        };
    }
    var $ = {
        passive: !0
    }, ee = {
        name: "eventListeners",
        enabled: !0,
        phase: "write",
        fn: function() {},
        effect: function(e) {
            var t = e.state, n = e.instance, o = e.options, i = o.scroll, a = void 0 === i || i, s = o.resize, f = void 0 === s || s, p = r(t.elements.popper), c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
            return a && c.forEach(function(e) {
                e.addEventListener("scroll", n.update, $);
            }), f && p.addEventListener("resize", n.update, $), function() {
                a && c.forEach(function(e) {
                    e.removeEventListener("scroll", n.update, $);
                }), f && p.removeEventListener("resize", n.update, $);
            };
        },
        data: {}
    }, te = {
        name: "popperOffsets",
        enabled: !0,
        phase: "read",
        fn: function(e) {
            var t = e.state, n = e.name;
            t.modifiersData[n] = z({
                reference: t.rects.reference,
                element: t.rects.popper,
                strategy: "absolute",
                placement: t.placement
            });
        },
        data: {}
    }, ne = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
    };
    function re(e) {
        var t, n = e.popper, o = e.popperRect, i = e.placement, a = e.variation, s = e.offsets, f = e.position, c = e.gpuAcceleration, u = e.adaptive, l = e.roundOffsets, d = e.isFixed, m = s.x, v = void 0 === m ? 0 : m, y = s.y, b = void 0 === y ? 0 : y, w = "function" == typeof l ? l({
            x: v,
            y: b
        }) : {
            x: v,
            y: b
        };
        v = w.x, b = w.y;
        var x = s.hasOwnProperty("x"), O = s.hasOwnProperty("y"), E = A, j = S, _ = window;
        if (u) {
            var q = D(n), L = "clientHeight", M = "clientWidth";
            q === r(n) && "static" !== g(q = h(n)).position && "absolute" === f && (L = "scrollHeight", 
            M = "scrollWidth"), q = q, (i === S || (i === A || i === k) && "end" === a) && (j = P, 
            b -= (d && q === _ && _.visualViewport ? _.visualViewport.height : q[L]) - o.height, 
            b *= c ? 1 : -1), i !== A && (i !== S && i !== P || "end" !== a) || (E = k, v -= (d && q === _ && _.visualViewport ? _.visualViewport.width : q[M]) - o.width, 
            v *= c ? 1 : -1);
        }
        var N, T = Object.assign({
            position: f
        }, u && ne), V = !0 === l ? function(e) {
            var t = e.x, n = e.y, r = window.devicePixelRatio || 1;
            return {
                x: p(t * r) / r || 0,
                y: p(n * r) / r || 0
            };
        }({
            x: v,
            y: b
        }) : {
            x: v,
            y: b
        };
        return v = V.x, b = V.y, c ? Object.assign({}, T, ((N = {})[j] = O ? "0" : "", N[E] = x ? "0" : "", 
        N.transform = (_.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + b + "px)" : "translate3d(" + v + "px, " + b + "px, 0)", 
        N)) : Object.assign({}, T, ((t = {})[j] = O ? b + "px" : "", t[E] = x ? v + "px" : "", 
        t.transform = "", t));
    }
    var oe = {
        name: "computeStyles",
        enabled: !0,
        phase: "beforeWrite",
        fn: function(e) {
            var t = e.state, n = e.options, r = n.gpuAcceleration, o = void 0 === r || r, i = n.adaptive, a = void 0 === i || i, s = n.roundOffsets, f = void 0 === s || s;
            if ("production" !== process.env.NODE_ENV) {
                var p = g(t.elements.popper).transitionProperty || "";
                a && [ "transform", "top", "right", "bottom", "left" ].some(function(e) {
                    return p.indexOf(e) >= 0;
                }) && console.warn([ "Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', "\n\n", 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", "\n\n", "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations." ].join(" "));
            }
            var c = {
                placement: H(t.placement),
                variation: F(t.placement),
                popper: t.elements.popper,
                popperRect: t.rects.popper,
                gpuAcceleration: o,
                isFixed: "fixed" === t.options.strategy
            };
            null != t.modifiersData.popperOffsets && (t.styles.popper = Object.assign({}, t.styles.popper, re(Object.assign({}, c, {
                offsets: t.modifiersData.popperOffsets,
                position: t.options.strategy,
                adaptive: a,
                roundOffsets: f
            })))), null != t.modifiersData.arrow && (t.styles.arrow = Object.assign({}, t.styles.arrow, re(Object.assign({}, c, {
                offsets: t.modifiersData.arrow,
                position: "absolute",
                adaptive: !1,
                roundOffsets: f
            })))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
                "data-popper-placement": t.placement
            });
        },
        data: {}
    }, ie = {
        name: "applyStyles",
        enabled: !0,
        phase: "write",
        fn: function(e) {
            var t = e.state;
            Object.keys(t.elements).forEach(function(e) {
                var n = t.styles[e] || {}, r = t.attributes[e] || {}, o = t.elements[e];
                i(o) && m(o) && (Object.assign(o.style, n), Object.keys(r).forEach(function(e) {
                    var t = r[e];
                    !1 === t ? o.removeAttribute(e) : o.setAttribute(e, !0 === t ? "" : t);
                }));
            });
        },
        effect: function(e) {
            var t = e.state, n = {
                popper: {
                    position: t.options.strategy,
                    left: "0",
                    top: "0",
                    margin: "0"
                },
                arrow: {
                    position: "absolute"
                },
                reference: {}
            };
            return Object.assign(t.elements.popper.style, n.popper), t.styles = n, t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow), 
            function() {
                Object.keys(t.elements).forEach(function(e) {
                    var r = t.elements[e], o = t.attributes[e] || {}, a = Object.keys(t.styles.hasOwnProperty(e) ? t.styles[e] : n[e]).reduce(function(e, t) {
                        return e[t] = "", e;
                    }, {});
                    i(r) && m(r) && (Object.assign(r.style, a), Object.keys(o).forEach(function(e) {
                        r.removeAttribute(e);
                    }));
                });
            };
        },
        requires: [ "computeStyles" ]
    }, ae = {
        name: "offset",
        enabled: !0,
        phase: "main",
        requires: [ "popperOffsets" ],
        fn: function(e) {
            var t = e.state, n = e.options, r = e.name, o = n.offset, i = void 0 === o ? [ 0, 0 ] : o, a = L.reduce(function(e, n) {
                return e[n] = function(e, t, n) {
                    var r = H(e), o = [ A, S ].indexOf(r) >= 0 ? -1 : 1, i = "function" == typeof n ? n(Object.assign({}, t, {
                        placement: e
                    })) : n, a = i[0], s = i[1];
                    return a = a || 0, s = (s || 0) * o, [ A, k ].indexOf(r) >= 0 ? {
                        x: s,
                        y: a
                    } : {
                        x: a,
                        y: s
                    };
                }(n, t.rects, i), e;
            }, {}), s = a[t.placement], f = s.x, p = s.y;
            null != t.modifiersData.popperOffsets && (t.modifiersData.popperOffsets.x += f, 
            t.modifiersData.popperOffsets.y += p), t.modifiersData[r] = a;
        }
    }, se = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
    };
    function fe(e) {
        return e.replace(/left|right|bottom|top/g, function(e) {
            return se[e];
        });
    }
    var pe = {
        start: "end",
        end: "start"
    };
    function ce(e) {
        return e.replace(/start|end/g, function(e) {
            return pe[e];
        });
    }
    function ue(e, t) {
        void 0 === t && (t = {});
        var n = t, r = n.placement, o = n.boundary, i = n.rootBoundary, a = n.padding, s = n.flipVariations, f = n.allowedAutoPlacements, p = void 0 === f ? L : f, c = F(r), u = c ? s ? q : q.filter(function(e) {
            return F(e) === c;
        }) : _, l = u.filter(function(e) {
            return p.indexOf(e) >= 0;
        });
        0 === l.length && (l = u, "production" !== process.env.NODE_ENV && console.error([ "Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.' ].join(" ")));
        var d = l.reduce(function(t, n) {
            return t[n] = Y(e, {
                placement: n,
                boundary: o,
                rootBoundary: i,
                padding: a
            })[H(n)], t;
        }, {});
        return Object.keys(d).sort(function(e, t) {
            return d[e] - d[t];
        });
    }
    var le = {
        name: "flip",
        enabled: !0,
        phase: "main",
        fn: function(e) {
            var t = e.state, n = e.options, r = e.name;
            if (!t.modifiersData[r]._skip) {
                for (var o = n.mainAxis, i = void 0 === o || o, a = n.altAxis, s = void 0 === a || a, f = n.fallbackPlacements, p = n.padding, c = n.boundary, u = n.rootBoundary, l = n.altBoundary, d = n.flipVariations, m = void 0 === d || d, h = n.allowedAutoPlacements, v = t.options.placement, g = H(v), y = f || (g !== v && m ? function(e) {
                    if ("auto" === H(e)) return [];
                    var t = fe(e);
                    return [ ce(e), t, ce(t) ];
                }(v) : [ fe(v) ]), b = [ v ].concat(y).reduce(function(e, n) {
                    return e.concat("auto" === H(n) ? ue(t, {
                        placement: n,
                        boundary: c,
                        rootBoundary: u,
                        padding: p,
                        flipVariations: m,
                        allowedAutoPlacements: h
                    }) : n);
                }, []), w = t.rects.reference, x = t.rects.popper, O = new Map(), E = !0, j = b[0], D = 0; D < b.length; D++) {
                    var _ = b[D], q = H(_), L = "start" === F(_), M = [ S, P ].indexOf(q) >= 0, N = M ? "width" : "height", T = Y(t, {
                        placement: _,
                        boundary: c,
                        rootBoundary: u,
                        altBoundary: l,
                        padding: p
                    }), V = M ? L ? k : A : L ? P : S;
                    w[N] > x[N] && (V = fe(V));
                    var W = fe(V), B = [];
                    if (i && B.push(T[q] <= 0), s && B.push(T[V] <= 0, T[W] <= 0), B.every(function(e) {
                        return e;
                    })) {
                        j = _, E = !1;
                        break;
                    }
                    O.set(_, B);
                }
                if (E) for (var R = function(e) {
                    var t = b.find(function(t) {
                        var n = O.get(t);
                        if (n) return n.slice(0, e).every(function(e) {
                            return e;
                        });
                    });
                    if (t) return j = t, "break";
                }, C = m ? 3 : 1; C > 0 && "break" !== R(C); C--) ;
                t.placement !== j && (t.modifiersData[r]._skip = !0, t.placement = j, t.reset = !0);
            }
        },
        requiresIfExists: [ "offset" ],
        data: {
            _skip: !1
        }
    };
    function de(e, t, n) {
        return s(e, f(t, n));
    }
    var me = {
        name: "preventOverflow",
        enabled: !0,
        phase: "main",
        fn: function(e) {
            var t = e.state, n = e.options, r = e.name, o = n.mainAxis, i = void 0 === o || o, a = n.altAxis, p = void 0 !== a && a, c = n.boundary, u = n.rootBoundary, l = n.altBoundary, d = n.padding, m = n.tether, h = void 0 === m || m, v = n.tetherOffset, g = void 0 === v ? 0 : v, y = Y(t, {
                boundary: c,
                rootBoundary: u,
                padding: d,
                altBoundary: l
            }), b = H(t.placement), x = F(t.placement), O = !x, E = U(b), j = "x" === E ? "y" : "x", _ = t.modifiersData.popperOffsets, q = t.rects.reference, L = t.rects.popper, M = "function" == typeof g ? g(Object.assign({}, t.rects, {
                placement: t.placement
            })) : g, N = "number" == typeof M ? {
                mainAxis: M,
                altAxis: M
            } : Object.assign({
                mainAxis: 0,
                altAxis: 0
            }, M), T = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null, V = {
                x: 0,
                y: 0
            };
            if (_) {
                if (i) {
                    var W, B = "y" === E ? S : A, R = "y" === E ? P : k, C = "y" === E ? "height" : "width", I = _[E], z = I + y[B], G = I - y[R], X = h ? -L[C] / 2 : 0, J = "start" === x ? q[C] : L[C], K = "start" === x ? -L[C] : -q[C], Q = t.elements.arrow, Z = h && Q ? w(Q) : {
                        width: 0,
                        height: 0
                    }, $ = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }, ee = $[B], te = $[R], ne = de(0, q[C], Z[C]), re = O ? q[C] / 2 - X - ne - ee - N.mainAxis : J - ne - ee - N.mainAxis, oe = O ? -q[C] / 2 + X + ne + te + N.mainAxis : K + ne + te + N.mainAxis, ie = t.elements.arrow && D(t.elements.arrow), ae = ie ? "y" === E ? ie.clientTop || 0 : ie.clientLeft || 0 : 0, se = null != (W = null == T ? void 0 : T[E]) ? W : 0, fe = I + oe - se, pe = de(h ? f(z, I + re - se - ae) : z, I, h ? s(G, fe) : G);
                    _[E] = pe, V[E] = pe - I;
                }
                if (p) {
                    var ce, ue = "x" === E ? S : A, le = "x" === E ? P : k, me = _[j], he = "y" === j ? "height" : "width", ve = me + y[ue], ge = me - y[le], ye = -1 !== [ S, A ].indexOf(b), be = null != (ce = null == T ? void 0 : T[j]) ? ce : 0, we = ye ? ve : me - q[he] - L[he] - be + N.altAxis, xe = ye ? me + q[he] + L[he] - be - N.altAxis : ge, Oe = h && ye ? function(e, t, n) {
                        var r = de(e, t, n);
                        return r > n ? n : r;
                    }(we, me, xe) : de(h ? we : ve, me, h ? xe : ge);
                    _[j] = Oe, V[j] = Oe - me;
                }
                t.modifiersData[r] = V;
            }
        },
        requiresIfExists: [ "offset" ]
    }, he = {
        name: "arrow",
        enabled: !0,
        phase: "main",
        fn: function(e) {
            var t, n = e.state, r = e.name, o = e.options, i = n.elements.arrow, a = n.modifiersData.popperOffsets, s = H(n.placement), f = U(s), p = [ A, k ].indexOf(s) >= 0 ? "height" : "width";
            if (i && a) {
                var c = function(e, t) {
                    return G("number" != typeof (e = "function" == typeof e ? e(Object.assign({}, t.rects, {
                        placement: t.placement
                    })) : e) ? e : X(e, _));
                }(o.padding, n), u = w(i), l = "y" === f ? S : A, d = "y" === f ? P : k, m = n.rects.reference[p] + n.rects.reference[f] - a[f] - n.rects.popper[p], h = a[f] - n.rects.reference[f], v = D(i), g = v ? "y" === f ? v.clientHeight || 0 : v.clientWidth || 0 : 0, y = m / 2 - h / 2, b = c[l], x = g - u[p] - c[d], O = g / 2 - u[p] / 2 + y, E = de(b, O, x), j = f;
                n.modifiersData[r] = ((t = {})[j] = E, t.centerOffset = E - O, t);
            }
        },
        effect: function(e) {
            var t = e.state, n = e.options.element, r = void 0 === n ? "[data-popper-arrow]" : n;
            null != r && ("string" != typeof r || (r = t.elements.popper.querySelector(r))) && ("production" !== process.env.NODE_ENV && (i(r) || console.error([ 'Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow." ].join(" "))), 
            B(t.elements.popper, r) ? t.elements.arrow = r : "production" !== process.env.NODE_ENV && console.error([ 'Popper: "arrow" modifier\'s `element` must be a child of the popper', "element." ].join(" ")));
        },
        requires: [ "popperOffsets" ],
        requiresIfExists: [ "preventOverflow" ]
    };
    function ve(e, t, n) {
        return void 0 === n && (n = {
            x: 0,
            y: 0
        }), {
            top: e.top - t.height - n.y,
            right: e.right - t.width + n.x,
            bottom: e.bottom - t.height + n.y,
            left: e.left - t.width - n.x
        };
    }
    function ge(e) {
        return [ S, k, P, A ].some(function(t) {
            return e[t] >= 0;
        });
    }
    var ye = {
        name: "hide",
        enabled: !0,
        phase: "main",
        requiresIfExists: [ "preventOverflow" ],
        fn: function(e) {
            var t = e.state, n = e.name, r = t.rects.reference, o = t.rects.popper, i = t.modifiersData.preventOverflow, a = Y(t, {
                elementContext: "reference"
            }), s = Y(t, {
                altBoundary: !0
            }), f = ve(a, r), p = ve(s, o, i), c = ge(f), u = ge(p);
            t.modifiersData[n] = {
                referenceClippingOffsets: f,
                popperEscapeOffsets: p,
                isReferenceHidden: c,
                hasPopperEscaped: u
            }, t.attributes.popper = Object.assign({}, t.attributes.popper, {
                "data-popper-reference-hidden": c,
                "data-popper-escaped": u
            });
        }
    }, be = Z({
        defaultModifiers: [ ee, te, oe, ie ]
    }), we = [ ee, te, oe, ie, ae, le, me, he, ye ], xe = Z({
        defaultModifiers: we
    });
    n.applyStyles = ie, n.arrow = he, n.computeStyles = oe, n.createPopper = xe, n.createPopperLite = be, 
    n.defaultModifiers = we, n.detectOverflow = Y, n.eventListeners = ee, n.flip = le, 
    n.hide = ye, n.offset = ae, n.popperGenerator = Z, n.popperOffsets = te, n.preventOverflow = me;
}, function(e) {
    return t({}[e], e);
}), t(1660636213233));