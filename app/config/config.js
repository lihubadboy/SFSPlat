/**
 * @author DYTH 2015
 */

var baseOprUrl = "http://47.93.32.53/kzsf-platform"; 
// var baseOprUrl = "http://192.168.1.157:8080/dyth";
var configOptions = {
    "authorInfoKey": "authorInfo",
    "proxyUrl": "app/proxy/proxy.jsp",
    "OprUrls": {
        "news": {
            "queryUrl": baseOprUrl + "/news/search",
            "queryItem": baseOprUrl + "/news/",
            'queryUp' :baseOprUrl  + "/news/query/up/news",
            "queryThumbnail":baseOprUrl + '/file/item/thumbnail/news/',
            "updateUrl": baseOprUrl + "/building/update"
        },
        "notice": {
            "queryUrl": baseOprUrl + "/notice/search",
            "queryItem": baseOprUrl + "/notice/"
        },
        "common": {
            "queryUrl": baseOprUrl + "/common/search"
        },
        "user": {
            "queryUrl": baseOprUrl + "/user/self",
            "updateUrl": baseOprUrl + "/user/update"
        },
        "file": {
            "queryUrl": baseOprUrl + "/film/item/thumbnail/news/",
        },
        "project": {
            "queryUrl": baseOprUrl + "/project/search",
            "queryItem": baseOprUrl + "/project/query/",
            "createUrl": baseOprUrl + "/project/create",
            "download":  baseOprUrl + "/template/pdf/",
            "downloadAccept":  baseOprUrl + "/template/pdf/acceptance/",
        },
        "acceptance": {
            "queryUrl": baseOprUrl + "/acceptance/search",
            "queryItem": baseOprUrl + "/acceptance/query/",
            "createUrl": baseOprUrl + "/acceptance/create",
        },
        "security": {
            "sendCode": baseOprUrl + "/code/sms?mobile=",
            "register": baseOprUrl + "/security/register",
            "login": baseOprUrl + '/authentication/form',
        },
        "statistics":{
            "timeall": baseOprUrl + "/statistics/time/all",
            "timeover": baseOprUrl + "/statistics/time/over",
            "sumover": baseOprUrl + "/statistics/sum/over"
        }
    },
    "enumDatas": {}
};