﻿define('application/newslist', ['utils/ajaxUtil','utils/common'], function(ajaxUtil,common) {
  var Widget = function(options) {
    var _self = this;
    _self.options = options;
    _self.ajaxUtil = new ajaxUtil(_self.options.proxyUrl);
    _self.common = new common();
    _self._init();
  };
  Widget.prototype = {
    _init: function() {
      var _self = this;
      _self.searchCache = {
          currentPage: 0,
          num: 20, //itemPerPage
      };
      _self.q = '1=1';
      var date = _self.common.getQueryStringByKey('d');
      $('.panel-title').html(date);
      var date1 = new Date(date);
      var t = date1.getTime()+1000*60*60*24;
      var date2 = _self.common.formatDate(t);
      if(date){
        _self.q =  "publishdate between '"+ date +"' and '"+ date2 +"'";
      }
      _self._queryNews();
    },
    _queryNews:function(){
      var _self = this;
      _self.ajaxUtil.search(_self.options.OprUrls.news.queryUrl, _self.q,_self.searchCache.currentPage,_self.searchCache.num, function(respons) {
        if (respons.data) {
            var news = respons.data.list;
            if (respons.data.total !== 0) {
               _self._buildNewsDom(news);
                _self._renderPagination("#pagination", _self.searchCache.currentPage == 0 ?  _self.searchCache.currentPage :  _self.searchCache.currentPage-1,respons.data.total, _self.searchCache.num, function(pageIndex) {
                _self.searchCache.currentPage = pageIndex + 1;
                _self._queryNews();
          });
            }else{
              _self._buildNoneDom();
            }
        }
      });
    },
    _buildNoneDom:function(){
        var html = '';
        html += '<li style="text-align:center">无此类信息</li>';
        $('.itemlist').html(html);
    },

    _renderPagination: function(id, pageIndex, total, itemPerPage, callback) {
        //分页控件初始化
        $(id).pagination(total, {
            'items_per_page': itemPerPage,
            'current_page': pageIndex, //默认0，第一页
            'num_display_entries': 5,
            'num_edge_entries': 1,
            'prev_text': "上一页",
            'next_text': "下一页",
            'callback': callback
        });
     },

    _buildNewsDom:function(news){
      var _self = this;
       var html = '';
       news.forEach(function(element,index){
        html += '<li class="col-md-10 padding-0" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">';
        html += '<a class="default" title="'+ element.title +'" href="pageContent.html?id='+ element.id +'&type=news" target="_blank">';
        html += '<span class="color-green" style="font-weight:700;">';
        html += '•';
        html += ' </span>';
        html += ' <span class="color-green">';
        html += '【'+element.source+'】';
        html += ' </span>';
        html += element.title+ '</a>';
        html += ' </li>';
        html += '<li class="col-md-2" style="text-align:right;padding-left:0;">';
        html += _self.common.formatDate(element.publishdate) ;
        html += '</li>';
        if ( index % 5 == 0 && index  != 0) {
             html += '<li class="col-md-12 padding-0">';
             html += '<hr>';
             html += '</li>';
        }
       });
       $('.itemlist').html(html);
    },  
  }
  return Widget;
});