var e = require("./http"), n = e.get, r = e.post, t = e.jsonPost;

module.exports = {
    req_wxLogin: function(e) {
        return r("/syslogin/wxLogin", e);
    },
    req_updateAppUser: function(e) {
        return t("/sysuser/updateAppUser", e);
    },
    req_findHotProblem: function(e) {
        return n("/problem/findHotProblem", e);
    },
    req_findAppConsultInfo: function(e) {
        return n("/consultinfo/findAppConsultInfo", e);
    },
    req_findConsultType: function(e) {
        return n("/consulttype/findConsultType", e);
    },
    req_findConsultById: function(e) {
        return n("/consultinfo/findConsultById", e);
    },
    req_findKnowledgeType: function(e) {
        return n("/knowledgetype/findKnowledgeType", e);
    },
    req_findAppKnowledgeInfo: function(e) {
        return n("/konwledgeinfo/findAppKnowledgeInfo", e);
    },
    req_findKnowledgeById: function(e) {
        return n("/konwledgeinfo/findKnowledgeById", e);
    },
    req_findProblemType: function(e) {
        return n("/problemtype/findProblemType", e);
    },
    req_findPcRply: function(e) {
        return n("/problemreply/findPcRply", e);
    },
    req_saveProblem: function(e) {
        return t("/problem/saveProblem", e);
    },
    req_saveReply: function(e) {
        return t("/problemreply/saveReply", e);
    },
    req_findUserReply: function(e) {
        return n("/problemreply/findUserReply", e);
    },
    req_seeReply: function(e) {
        return n("/problemreply/seeReply", e);
    },
    req_countHiveData: function(e) {
        return n("/projecthiveinfo/countHiveData", e);
    },
    req_userProejctCount: function(e) {
        return n("/projectinfo/userProejctCount", e);
    },
    req_userProejctHiveCount: function(e) {
        return n("/projecthiveinfo/userProejctHiveCount", e);
    },
    req_userProblemCount: function(e) {
        return n("/problem/userProblemCount", e);
    },
    req_userProblemList: function(e) {
        return n("/problem/userProblemList", e);
    },
    req_userProblemRplyList: function(e) {
        return n("/problemreply/userProblemRplyList", e);
    },
    req_findWarning: function(e) {
        return n("/warningconfig/findWarning", e);
    },
    req_saveWarning: function(e) {
        return t("/warningconfig/saveWarning", e);
    },
    req_findHiveDevice: function(e) {
        return n("/projecthiveinfo/findHiveDevice", e);
    },
    req_findMyWarningRecord: function(e) {
        return n("/warningrecord/findMyWarningRecord", e);
    },
    req_findWarningRecordById: function(e) {
        return n("/warningrecord/findWarningRecordById", e);
    },
    req_updateWarningRecord: function(e) {
        return r("/warningrecord/updateWarningRecord", e);
    },
    req_issueDeviceCmd: function(e) {
        return n("/device/issueDeviceCmd", e);
    },
    req_uthenticationaUser: function(e) {
        return t("/sysuser/uthenticationaUser", e);
    },
    req_setEnterOut: function(e) {
        return r("/device/setEnterOut", e);
    },
    req_setZaiChao: function(e) {
        return r("/device/setZaiChao", e);
    },
    req_setRunModel: function(e) {
        return r("/device/setRunModel", e);
    },
    req_findProjectHiveList: function(e) {
        return n("/projectinfo/findProjectHiveList", e);
    },
    req_statisticsWeight: function(e) {
        return n("/statistics/statisticsWeight", e);
    }
};