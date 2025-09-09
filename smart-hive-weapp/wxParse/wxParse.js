var e = require("../@babel/runtime/helpers/defineProperty"), t = require("../@babel/runtime/helpers/createForOfIteratorHelper"), a = r(require("./showdown.js")), i = r(require("./html2json.js"));

function r(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var n = 0, d = 0;

function o(e) {
    var t = e.target.dataset.src, a = e.target.dataset.from;
    void 0 !== a && a.length > 0 && wx.previewImage({
        current: t,
        urls: this.data[a].imageUrls
    });
}

function s(a) {
    var i = a.target.dataset.from, r = a.target.dataset.idx;
    void 0 !== i && i.length > 0 && function(a, i, r, o) {
        var s = r.data[o];
        if (!s || 0 == s.images.length) return;
        var l, g = s.images, h = function(e, t, a, i) {
            var r, o = 0, s = 0, l = {}, g = a.data[i].view.imagePadding;
            d, e > (r = n - 2 * g) ? (s = (o = r) * t / e, l.imageWidth = o, l.imageheight = s) : (l.imageWidth = e, 
            l.imageheight = t);
            return l;
        }(a.detail.width, a.detail.height, r, o), m = g[i].index, v = "".concat(o), u = t(m.split("."));
        try {
            for (u.s(); !(l = u.n()).done; ) {
                var f = l.value;
                v += ".nodes[".concat(f, "]");
            }
        } catch (e) {
            u.e(e);
        } finally {
            u.f();
        }
        var w = v + ".width", c = v + ".height";
        r.setData(e(e({}, w, h.imageWidth), c, h.imageheight));
    }(a, r, this, i);
}

wx.getSystemInfo({
    success: function(e) {
        n = e.windowWidth, d = e.windowHeight;
    }
}), module.exports = {
    wxParse: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "wxParseData", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "html", r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '<div class="color:red;">数据不能为空</div>', n = arguments.length > 3 ? arguments[3] : void 0, d = arguments.length > 4 ? arguments[4] : void 0, l = n, g = {};
        if ("html" == t) g = i.default.html2json(r, e); else if ("md" == t || "markdown" == t) {
            var h = new a.default.Converter(), m = h.makeHtml(r);
            g = i.default.html2json(m, e);
        }
        g.view = {}, g.view.imagePadding = 0, void 0 !== d && (g.view.imagePadding = d);
        var v = {};
        v[e] = g, l.setData(v), l.wxParseImgLoad = s, l.wxParseImgTap = o;
    },
    wxParseTemArray: function(e, t, a, i) {
        for (var r = [], n = i.data, d = null, o = 0; o < a; o++) {
            var s = n[t + o].nodes;
            r.push(s);
        }
        e = e || "wxParseTemArray", (d = JSON.parse('{"' + e + '":""}'))[e] = r, i.setData(d);
    },
    emojisInit: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", a = arguments.length > 2 ? arguments[2] : void 0;
        i.default.emojisInit(e, t, a);
    }
};