var e = require("../@babel/runtime/helpers/defineProperty"), t = require("./http"), i = t.get, n = t.post, r = t.jsonPost;

module.exports = e(e(e(e(e(e(e(e(e(e({
    req_findMyProject: function(e) {
        return i("/projectinfo/findMyProject", e);
    },
    req_addProjectInfo: function(e) {
        return r("/projectinfo/addProjectInfo", e);
    },
    req_updateProjectInfo: function(e) {
        return r("/projectinfo/updateProjectInfo", e);
    },
    req_findRemoveHive: function(e) {
        return i("/projecthiveinfo/findRemoveHive", e);
    },
    req_addAppHiveInfo: function(e) {
        return r("/projecthiveinfo/addAppHiveInfo", e);
    },
    req_bindingHive: function(e) {
        return r("/projecthiveinfo/bindingHive", e);
    },
    req_findHiveInfoById: function(e) {
        return i("/projecthiveinfo/findHiveInfoById", e);
    },
    req_findProjectDetails: function(e) {
        return i("/projectinfo/findProjectDetails", e);
    },
    req_deleteProject: function(e) {
        return i("/projectinfo/deleteProject", e);
    },
    req_findHiveByProject: function(e) {
        return i("/projecthiveinfo/findHiveByProject", e);
    },
    req_bindHiveInfo: function(e) {
        return n("/projecthiveinfo/bindHiveInfo", e);
    },
    req_findAppProjectInfo: function(e) {
        return i("/projectinfo/findAppProjectInfo", e);
    },
    req_findHiveStateCount: function(e) {
        return i("/projecthiveinfo/findHiveStateCount", e);
    }
}, "req_findProjectDetails", function(e) {
    return i("/projectinfo/findProjectDetails", e);
}), "req_findUserAllHive", function(e) {
    return i("/projecthiveinfo/findUserAllHive", e);
}), "req_deleteHiveInfo", function(e) {
    return i("/projecthiveinfo/deleteHiveInfo", e);
}), "req_updateHiveBindProject", function(e) {
    return i("/projecthiveinfo/updateHiveBindProject", e);
}), "req_findHiveDevice", function(e) {
    return i("/projecthiveinfo/findHiveDevice", e);
}), "req_countHiveData", function(e) {
    return i("/projecthiveinfo/countHiveData", e);
}), "req_statisticsType", function(e) {
    return i("/statistics/statisticsType", e);
}), "req_statisticsAccessNum", function(e) {
    return i("/statistics/statisticsAccessNum", e);
}), "req_statisticsAbnormal", function(e) {
    return i("/statistics/statisticsAbnormal", e);
}), "req_statisticsDistribution", function(e) {
    return i("/statistics/statisticsDistribution", e);
});