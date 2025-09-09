var t = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
};

function n(t) {
    return !(isNaN(t) || !isFinite(t) || t % 1 || t < 2) && t == function(t) {
        if (isNaN(t) || !isFinite(t)) return NaN;
        if (0 == t) return 0;
        if (t % 1 || t * t < 2) return 1;
        if (t % 2 == 0) return 2;
        if (t % 3 == 0) return 3;
        if (t % 5 == 0) return 5;
        for (var n = Math.sqrt(t), r = 7; r <= n; r += 30) {
            if (t % r == 0) return r;
            if (t % (r + 4) == 0) return r + 4;
            if (t % (r + 6) == 0) return r + 6;
            if (t % (r + 10) == 0) return r + 10;
            if (t % (r + 12) == 0) return r + 12;
            if (t % (r + 16) == 0) return r + 16;
            if (t % (r + 22) == 0) return r + 22;
            if (t % (r + 24) == 0) return r + 24;
        }
        return t;
    }(t);
}

module.exports = {
    getDateString: function(n) {
        var r = n.getFullYear(), e = n.getMonth() + 1, o = n.getDate();
        n.getHours(), n.getMinutes(), n.getSeconds();
        return [ r, e, o ].map(t).join("-");
    },
    getTimeString: function(n) {
        return [ n.getHours(), n.getMinutes() ].map(t).join(":");
    },
    formatTime: function(n) {
        var r = n.getFullYear(), e = n.getMonth() + 1, o = n.getDate(), a = n.getHours(), i = n.getMinutes(), u = n.getSeconds();
        return [ r, e, o ].map(t).join("/") + " " + [ a, i, u ].map(t).join(":");
    },
    formatTimeHM: function(n) {
        var r = n.getFullYear(), e = n.getMonth() + 1, o = n.getDate(), a = n.getHours(), i = n.getMinutes();
        return [ r, e, o ].map(t).join("/") + " " + [ a, i ].map(t).join(":");
    },
    formatDate: function(n) {
        return [ n.getFullYear(), n.getMonth() + 1, n.getDate() ].map(t).join("/");
    },
    formatDateLine: function(n) {
        return [ n.getFullYear(), n.getMonth() + 1, n.getDate() ].map(t).join("-");
    },
    formatYear: function(n) {
        return [ n.getFullYear() ].map(t).join("/");
    },
    formatMonth: function(n) {
        return [ n.getMonth() + 1 ].map(t).join("/");
    },
    formatHM: function(n) {
        return [ n.getHours(), n.getMinutes() ].map(t).join(":");
    },
    showBusy: function(t) {
        return wx.showToast({
            title: t,
            icon: "loading",
            duration: 1e4
        });
    },
    showSuccess: function(t) {
        return wx.showToast({
            title: t,
            icon: "success"
        });
    },
    showModel: function(t, n) {
        wx.hideToast(), wx.showModal({
            title: t,
            content: JSON.stringify(n),
            showCancel: !1
        });
    },
    isPrime: n,
    randomPrime: function() {
        var t = Math.floor(9e7 * Math.random() + 1e7);
        if (n(t)) return t;
        for (var r = 0, e = 10000019; ;) {
            if (n(t + ++r)) {
                e = t + r;
                break;
            }
            if (n(t - r)) {
                e = t - r;
                break;
            }
        }
        return e;
    },
    randomPrime6: function() {
        var t = Math.floor(9e5 * Math.random() + 1e5);
        if (n(t)) return t;
        for (var r = 0, e = 100003; ;) {
            if (n(t + ++r)) {
                e = t + r;
                break;
            }
            if (n(t - r)) {
                e = t - r;
                break;
            }
        }
        return e;
    },
    randomN: function() {
        var t = Math.floor(15 * Math.random() + 4);
        if (n(t)) return t;
        for (var r = 0, e = 3; ;) {
            if (n(t + ++r)) {
                e = t + r;
                break;
            }
            if (n(t - r)) {
                e = t - r;
                break;
            }
        }
        return e;
    },
    ab2hex: function(t) {
        return Array.prototype.map.call(new Uint8Array(t), function(t) {
            return ("00" + t.toString(16)).slice(-2);
        }).join("");
    },
    bytesToHex: function(t) {
        for (var n = [], r = 0; r < t.length; r++) n.push((t[r] >>> 4).toString(16)), n.push((15 & t[r]).toString(16));
        return n.join("");
    },
    hexToBytes: function(t) {
        for (var n = [], r = 0; r < t.length; r += 2) n.push(parseInt(t.substr(r, 2), 16));
        return n;
    },
    macToInt: function(t) {
        var n = t.replace(/:/g, "").substring(4);
        return parseInt(n.substr(0, 4), 16) << 16 | parseInt(n.substr(4, 4), 16);
    },
    hexToInt: function(t) {
        return parseInt(t.substr(0, 4), 16) << 16 | parseInt(t.substr(4, 4), 16);
    },
    getLockModel: function(t) {
        return null == t || null == t ? 0 : 9 == t.length ? 1 : 0 == t.indexOf("WSL_A") ? 1 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_H") ? 10 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_B") ? 21 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_N") ? 30 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_M") ? 40 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_U") ? 50 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_J") ? 60 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_F") ? 70 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_C") ? 80 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_O") ? 90 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSL_D") ? 100 + parseInt(t.substr(5, 6)) : 0 == t.indexOf("WSJ_Q") ? 1e4 + parseInt(t.substr(5, 6)) : 0;
    },
    getLockType: function(t) {
        return t > 0 && t <= 9 ? "蓝牙密码\b锁" : t > 10 && t <= 19 ? "家庭锁系列" : t > 20 && t <= 29 ? "酒店密码锁" : t > 30 && t <= 49 || t > 100 && t <= 109 ? "蓝牙NB锁" : t > 50 && t <= 59 || t > 90 && t <= 99 ? "蓝牙密码锁" : t > 60 && t <= 69 ? "蓝牙NB机柜锁" : t > 70 && t <= 79 ? "蓝牙指纹锁" : t > 80 && t <= 89 ? "NB指纹锁" : t > 1e4 && t <= 10009 ? "取电开关" : void 0;
    },
    getLockName: function(t, n) {
        var r = t.replace(/:/g, "_").slice(t.length - 5, t.length);
        return 1 == n ? "WSL_".concat(r) : n > 1 && n <= 9 ? "WSL_A".concat(n % 10 - 1, "_").concat(r) : n > 20 && n <= 29 ? "WSL_B".concat(n % 10 - 1, "_").concat(r) : n > 10 && n <= 19 ? "WSL_H".concat(n % 10, "_").concat(r) : n > 30 && n <= 39 ? "WSL_N".concat(n % 10, "_").concat(r) : n > 40 && n <= 49 ? "WSL_M".concat(n % 10, "_").concat(r) : n > 50 && n <= 59 ? "WSL_U".concat(n % 10, "_").concat(r) : n > 60 && n <= 69 ? "WSL_J".concat(n % 10, "_").concat(r) : n > 70 && n <= 79 ? "WSL_F".concat(n % 10, "_").concat(r) : n > 80 && n <= 89 ? "WSL_C".concat(n % 10, "_").concat(r) : n > 90 && n <= 99 ? "WSL_O".concat(n % 10, "_").concat(r) : n > 100 && n <= 109 ? "WSL_D".concat(n % 10, "_").concat(r) : n > 1e4 && n <= 10009 ? "WSJ_Q".concat(n % 10, "_").concat(r) : void 0;
    },
    isUxLock: function(t) {
        return t > 30 && t <= 59;
    },
    isNbLock: function(t) {
        return t > 30 && t <= 49;
    },
    isFxLock: function(t) {
        return t > 70 && t <= 79;
    },
    getLocalTime: function(t) {
        if ("number" == typeof t) {
            var n = new Date(), r = n.getTime(), e = 6e4 * n.getTimezoneOffset();
            return new Date(r + e + 36e5 * t);
        }
    }
};