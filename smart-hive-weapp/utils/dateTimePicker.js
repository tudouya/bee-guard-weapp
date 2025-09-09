var e = require("../@babel/runtime/helpers/toConsumableArray");

function t(e) {
    return e < 10 ? "0" + e : "" + e;
}

function a(e, a) {
    a = a || 1;
    for (var r = [], s = e = e || 0; s <= a; s++) r.push(t(s));
    return r;
}

function r(e, t) {
    var r = e % 400 == 0 || e % 4 == 0 && e % 100 != 0, s = null;
    switch (t) {
      case "01":
      case "03":
      case "05":
      case "07":
      case "08":
      case "10":
      case "12":
        s = a(1, 31);
        break;

      case "04":
      case "06":
      case "09":
      case "11":
        s = a(1, 30);
        break;

      case "02":
        s = a(1, r ? 29 : 28);
        break;

      default:
        s = "月份格式不正确，请重新输入！";
    }
    return s;
}

module.exports = {
    dateTimePicker: function(s, c, n) {
        var u, i = [], o = [ [], [], [], [], [], [] ], l = s || 1978, f = c || 2100, p = n ? [].concat(e(n.split(" ")[0].split("-")), e(n.split(" ")[1].split(":"))) : [ t((u = new Date()).getFullYear()), t(u.getMonth() + 1), t(u.getDate()), t(u.getHours()), t(u.getMinutes()), t(u.getSeconds()) ];
        return o[0] = a(l, f), o[1] = a(1, 12), o[2] = r(p[0], p[1]), o[3] = a(0, 23), o[4] = a(0, 59), 
        o[5] = a(0, 59), o.forEach(function(e, t) {
            i.push(e.indexOf(p[t]));
        }), {
            dateTimeArray: o,
            dateTime: i
        };
    },
    getMonthDay: r
};