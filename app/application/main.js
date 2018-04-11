define('application/main', ['utils/ajaxUtil','utils/common'], function(ajaxUtil,common) {
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
      //首页 ---热点关注
      //新闻置顶  新闻轮播图 
      // var myChart = echarts.init(document.getElementById('main_total'), 'infographic');
      _self._queryUpNews();
      // 通知公告
      _self._queryNotice();
      // 震防要闻
      _self._queryNews();
      // 办件公示
      _self._queryCommon();
      // 办件搜素
      _self._seachCommon();
      //政策法规
      _self._queryNewsOfPolicy();
      //安居工程
      _self._queryNewsOfProject();
      //政务公开
      _self._queryNewsOfOpen();
      //创建事件
      _self._construcEvent();

      _self._queryTotalApply(0);
      _self._queryTotalOver(0);
       _self._querySumOver(0);

    },
    //创建事件
    _construcEvent:function(){
        $('.applyParam').on('click',function(){
           if(sessionStorage.token){
             window.location.href ="project.html";
           }else{
             window.location.href = 'login.html';
           }
        });
    },

    initLineOrBarChart(name,lineChartData,type,title,subtitle){
      for(var i in lineChartData.series){
        lineChartData.series[i].type = type;
      }

       var myChart = echarts.init(document.getElementById(name));
           var option = {
                title: {
                  text: title,
                  subtext: subtitle,
                  textStyle: {
                    fontWeight: 'normal',
                    fontFamily: 'Microsoft YaHei',
                    fontSize: 18,
                    color: '#666'
                  }
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                legend: {
                  bottom: '0',
                  y: 'bottom',
                  data: lineChartData.legend
                },
                toolbox: {
                  show: true,
                  feature: {
                    magicType: {
                      show: true,
                      type: ['bar', 'line']
                    },
                    restore: {
                      show: true
                    }
                  }
                },
                //calculable: true,
                xAxis: [{
                  type: 'category',
                  data: lineChartData.xaxis,
                  axisLabel: {
                    interval: 0
                  }
                }],
                yAxis: [{
                  type: 'value',
                  splitArea: {
                    show: true
                  },
                  scale: true
                }],
                series: lineChartData.series
              };
          // 为echarts对象加载数据 
          myChart.setOption(option);

    },
    initPieChart(name,pieChartData,title,subtitle){
         var myChart = echarts.init(document.getElementById(name));
           var option = {
              title: {
                  text: title,
                  subtext: subtitle,
                  textStyle: {
                    fontWeight: 'normal',
                    fontFamily: 'Microsoft YaHei',
                    fontSize: 18,
                    color: '#666'
                  }
                },
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              legend: {
                left: 'center',
                bottom: '0',
                data: pieChartData.legend
              },
              calculable: true,
              series: [
                {
                  name: '数量(占比)',
                  type: 'pie',
                  label: {
                      normal: {
                          show: false
                      },
                      emphasis: {
                          show: true
                      }
                  },
                  //roseType: 'radius',
                  radius: [40, 80],
                  //center: ['50%', '55%'],
                  data: pieChartData.data,
                  animationEasing: 'cubicInOut',
                  animationDuration: 2600
                }
              ]
            }
          // 为echarts对象加载数据 
          myChart.setOption(option);

    },

    _queryTotalApply:function(val){
      // 基于准备好的dom，初始化echarts图表
      var _self = this;
      var lineChartData = {
        xaxis:[],
        legend:['总申请量','参数确定申请量','竣工验收申请量'],
         series:[{
           name: '总申请量', itemStyle: {
             normal: {
               color: '#FF005A',
               lineStyle: {
                 color: '#FF005A',
                 width: 2
               }
             }
           },
           smooth: true,
           data: [],
           animationDuration: 2800,
           animationEasing: 'cubicInOut'
         },
         {
           name: '参数确定申请量',
           smooth: true,
           itemStyle: {
             normal: {
               color: 'orange',
               lineStyle: {
                 color: 'orange',
                 width: 2
               },
             }
           },
           data: [],
           animationDuration: 2800,
           animationEasing: 'quadraticOut'
         },
         {
           name: '竣工验收申请量',
           smooth: true,
           itemStyle: {
             normal: {
               color: 'green',
               lineStyle: {
                 color: 'green',
                 width: 2
               },
             }
           },
           data: [],
           animationDuration: 2800,
           animationEasing: 'quadraticOut'
         }]
      };

      var startTime,endTime,type;
      switch(val){
         case 0:{
            startTime = Date.now() - 7 * 24 * 3600 * 1000;
            endTime = Date.now();
            type = "day";
            break;
         }
         case 1 :{
           startTime = Date.now() - 30 * 24 * 3600 * 1000;
           endTime = Date.now();
           type = "day";
           break;
         }
         case 2 :{
           startTime = Date.now() - 365 * 24 * 3600 * 1000;
           endTime = Date.now();
           type = "month";
           break;
         }
      }

      var date1 = _self.common.formatDate(startTime);
      var date2 = _self.common.formatDate(endTime);

      _self.ajaxUtil.staticsDate(_self.options.OprUrls.statistics.timeall, date1,date2,type,function(respons) {
        if (respons.data) {

          for(var i in respons.data){
           var v = respons.data[i];

           lineChartData.xaxis.push(v.name);
           lineChartData.series[0].data.push(v.count1);
           lineChartData.series[1].data.push(v.count2);
           lineChartData.series[2].data.push(v.count3);
        }

        _self.initLineOrBarChart("main1",lineChartData,"line","抗震设防项目提交申请量","最近一周");
        _self.initLineOrBarChart("main2",lineChartData,"bar","抗震设防项目提交申请量","最近一周");
        //_self.initPieChart("main3");

         
        }
      });        
    },


    _queryTotalOver:function(val){
      // 基于准备好的dom，初始化echarts图表
      var _self = this;
      var lineChartData = {
        xaxis:[],
        legend:['参数确定发证量','竣工验收发证量'],
         series:[
         {
           name: '参数确定发证量',
           smooth: true,
           itemStyle: {
             normal: {
               color: 'orange',
               lineStyle: {
                 color: 'orange',
                 width: 2
               },
             }
           },
           data: [],
           animationDuration: 2800,
           animationEasing: 'quadraticOut'
         },
         {
           name: '竣工验收发证量',
           smooth: true,
           itemStyle: {
             normal: {
               color: 'green',
               lineStyle: {
                 color: 'green',
                 width: 2
               },
             }
           },
           data: [],
           animationDuration: 2800,
           animationEasing: 'quadraticOut'
         }]
      };

      var startTime,endTime,type;
      switch(val){
         case 0:{
            startTime = Date.now() - 7 * 24 * 3600 * 1000;
            endTime = Date.now();
            type = "day";
            break;
         }
         case 1 :{
           startTime = Date.now() - 30 * 24 * 3600 * 1000;
           endTime = Date.now();
           type = "day";
           break;
         }
         case 2 :{
           startTime = Date.now() - 365 * 24 * 3600 * 1000;
           endTime = Date.now();
           type = "month";
           break;
         }
      }

      var date1 = _self.common.formatDate(startTime);
      var date2 = _self.common.formatDate(endTime);

      _self.ajaxUtil.staticsDate(_self.options.OprUrls.statistics.timeover, date1,date2,type,function(respons) {
        if (respons.data) {

          for(var i in respons.data){
           var v = respons.data[i];

           lineChartData.xaxis.push(v.name);
           lineChartData.series[0].data.push(v.count1);
           lineChartData.series[1].data.push(v.count2);
        }

        _self.initLineOrBarChart("main3",lineChartData,"line","抗震设防项目已发证量","最近一周");
        _self.initLineOrBarChart("main4",lineChartData,"bar","抗震设防项目已发证量","最近一周");
        //_self.initPieChart("main3");

         
        }
      });        
    },

    _querySumOver:function(val){
      // 基于准备好的dom，初始化echarts图表
      var _self = this;
    
      var pieChartData= {
        title:'抗震设防审批已发证数量',
        subtitle:'最近一周',
        legend:['参数确定','竣工验收'],
        data:[]
      }

      var startTime,endTime,type;
      switch(val){
         case 0:{
            startTime = Date.now() - 7 * 24 * 3600 * 1000;
            endTime = Date.now();
            type = "day";
            break;
         }
         case 1 :{
           startTime = Date.now() - 30 * 24 * 3600 * 1000;
           endTime = Date.now();
           type = "day";
           break;
         }
         case 2 :{
           startTime = Date.now() - 365 * 24 * 3600 * 1000;
           endTime = Date.now();
           type = "month";
           break;
         }
      }

      var date1 = _self.common.formatDate(startTime);
      var date2 = _self.common.formatDate(endTime);

      _self.ajaxUtil.staticsDate(_self.options.OprUrls.statistics.sumover, date1,date2,type,function(respons) {
        if (respons.data) {

          pieChartData.data=[
            {
              value: respons.data["参数确定"],
              name:'参数确定'
            },{
              value: respons.data["竣工验收"],
              name:'竣工验收'
            }
          ];

        _self.initPieChart("main5",pieChartData,"抗震设防项目发证类型占比","最近一周");

         
        }
      });        
    },

    //新闻轮播图
    _queryUpNews:function(){
      var _self = this;
      _self.ajaxUtil.search(_self.options.OprUrls.news.queryUp, '1=1',1,9, function(respons) {
        if (respons.data) {
            var upNews = respons.data.list;
            _self._buildUpNewsDom(upNews);
        }
      });
    },
    // 新闻轮播 dom
    _buildUpNewsDom:function(upNews){
      var _self = this;
      var html = '';
      // html += '<ol class="carousel-indicators">';
      // for(var i = 0 ; i < upNews.length;i++){
      //    if(i== 0){
      //     html += '<li class="rounded-x active" data-target="#portfolio-carousel" data-slide-to="'+ i +'">';
      //     html += '</li>';
      //    }else{
      //     html += '<li class="rounded-x" data-target="#portfolio-carousel" data-slide-to="'+ i +'">';
      //     html += '</li>';
      //    }
      // };
      // html += '</ol>';
  
      html += ' <div class="carousel-inner divT1">';
      upNews.forEach(function(element,index){
        if(index == 0){
          html += '<div class="item active">';
        }else{
          html += '<div class="item">';
        }
        html += '<a target="_blank" href="pageContent.html?id='+element.id+'&type=news">';
        html += ' <img class="img-responsive full-width" src="'+ _self.options.OprUrls.news.queryThumbnail + element.thumbnail+'" alt="'+ element.title +'"';
        html += ' title="'+ element.title +'" style="opacity: 1; height: 280px;" />';
        html += '</a>';
        html += ' </div>';
      });
      html += '</div>';
      html += ' <a class="left carousel-control rounded-x" href="#portfolio-carousel" role="button" data-slide="prev">';
      html += ' <i class="fa fa-angle-left arrow-prev">';
      html += '</i>';
      html += '</a>';
      html += '<a class="right carousel-control rounded-x" href="#portfolio-carousel" role="button" data-slide="next">';
      html += '<i class="fa fa-angle-right arrow-next">';
      html += '</i>';
      html += '</a>';
      $('#portfolio-carousel').html(html);
    },
    // 通知公告
    _queryNotice:function(){
      var _self = this;
      _self.ajaxUtil.search(_self.options.OprUrls.notice.queryUrl, '1=1',1,9, function(respons) {
        if (respons.data) {
          var notice = respons.data.list;
          _self._buildNoticeDom(notice);
          _self._buildNoticeBar(notice);
          _self._buildNoticeTips(notice);
        }
      });
    },
    // 通知dom
    _buildNoticeDom:function(notice){
      var html = '';
      html += '<ul style="list-style: none; line-height: 2; margin:0 10px;" class="padding-0">';
      notice.forEach(element => {
       html += '<li>';
       html += '<div class="col-xs-12 col-md-12 padding-0" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">';
       html += '<span class="color-green" style="font-weight: 700;">';
       html += '&bull;';
       html += '</span>';
       html += '<span>';
       html += '<a target="_blank" class="color-green" href="#">';
       html += '【'+ element.type +'】';
       html += '</a> ';   
       html += ' </span>';
       html += '<span class="font-color6">';
       html += '<a href="pageContent.html?id='+ element.id +'&type=notice" target="blank"';
       html += 'title="'+ element.title +'">';
       html += element.title;
       html += '</a>';
       html += '</span>';
       html += '</div>';
       html += '</li>';
      });
      html += '</ul>';
      $('.notice').html(html);
   },
   //通知滚动条
  _buildNoticeBar:function(notice){
     var html = '';
     html += '<marquee onmouseover=stop() onmouseout=start()>';
     notice.forEach(function(element,index){
       if(index < 3){
         html += '<span style="margin:0px;padding:0px;height:14px;padding-right:30px;overflow:hidden;max-width:500px;">';
         html += '<a class="color-green" title="'+ element.title +'" href="pageContent.html?id='+ element.id +'&type=notice"  target="_blank" >';
         html += '<i class="fa fa-volume-up color-green">';
         html += '</i>';
         html += '&nbsp;&nbsp;';
         html += element.type + '：'+ element.title +'</a>';
         html += '</span>';
       }
     });
     html += '</marquee>';
     $('.noticeBar').html(html);
  },
  //通知的栏目
  _buildNoticeTips:function(notice){
    var htmltop = '';
    var htmllist = '';
    notice.forEach(function(element,index){
      if(index == 0){
        htmltop +='<h4 style="font-weight:700;">';
        htmltop +='<a title="'+element.title+'" class="color-green" style="text-decoration:none;" href="ptl/def/def/index_1121_6774.jsp?trid=2514479" target="_blank" >';
        htmltop += element.title+'</a>';
        htmltop +='</h4>';
        htmltop +='<p style="text-align: left; text-indent: 2em; line-height: 2;">';
        htmltop +='<div id="str" style="text-indent:2em;line-height:2;height:56px;overflow:hidden;text-align: left;">';
        htmltop += '<p>在国务院和省级人民政府领导下，各市（地、州、盟）和县（市、区、旗）人民政府及其地震工作主管部门依法承担着防震减灾的重要职能。市县地震工作主管部门是防震减灾工作面向社会最直接、最有效的力量，是发挥政府职能、强化社会管理和公共服务的重要基础</p>';
        htmltop +='</div>';
        htmltop +='</p>';
        htmltop +=' <a class="btn-u btn-u-xs pull-right" href="pageContent.html?id='+ element.id +'&type=notice" target="_blank"> 详细信息 +</a>';
        htmltop +='<div style="clear: both;">';
        htmltop +='</div>';
      }else if(index <5){
        htmllist +='<li>';
        htmllist +='<div class="col-xs-12 col-md-12 padding-0 " style="overflow:hidden;height:2em;">';
        htmllist +='<span class="color-green" style="margin: auto 5px;">';
        htmllist +='&bull;';
        htmllist +='</span>';
        htmllist +='<a href="list.html" target="_blank"';
        htmllist +='title="'+element.title+'" class="padding-0">';
        htmllist +=element.title;
        htmllist +='</a>';
        htmllist +='</div>';
        htmllist +='</li>';
      }
    });
    $('.topnews').html(htmltop);
    $('.topnewslist').html(htmllist);
  },
  // 震防要闻
  _queryNews:function(){
    var _self = this;
    _self.ajaxUtil.search(_self.options.OprUrls.news.queryUrl, "summary='防震减灾'",1,9, function(respons) {
      if (respons.data) {
          var news = respons.data.list;
          _self._buildNewsDom(news,'.news');
      }
    });
  },
  // 震防要闻 dom
  _buildNewsDom:function(news,domClass){
    var html = '';
    html += '<ul style="list-style: none; line-height: 2; margin:0 10px;" class="padding-0">';
    news.forEach(function(element,index){
      if(index < 9){
        html += '<li>';
        html += '<div class="col-xs-12 col-md-12 padding-0" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">';
        html += '<span class="color-green" style="font-weight: 700;">';
        html += '&bull;';
        html += '</span>';
        html += '<span class="font-color6">';
        html += '<a href="pageContent.html?id='+ element.id +'&type=news" target="blank" style="padding:0px;"';
        html += 'title="'+ element.title +'"> ';
        html += element.title;
        html += ' </a>';
        html += '</span>';
        html += '</div>';
        html += '</li>';
      }
    });
    html += '</ul>';
    $(domClass).html(html);
  },
    // 震防要闻
    _queryNewsOfPolicy:function(){
      var _self = this;
      _self.ajaxUtil.search(_self.options.OprUrls.news.queryUrl, "code='500004'",1,100, function(respons) {
        if (respons.data) {
            var news = respons.data.list;
            var policy1 = [];
            var policy2 = [];
            var policy3 = [];
            var policy4 = [];
            news.forEach(element => {
              if(element.summary == '法律'){
                policy1.push(element);
              }else if(element.summary == '行政法规'){
                policy2.push(element);
              }else if(element.summary == '部门规章'){
                policy3.push(element);
              }else if(element.summary == '地方性法规'){
                policy4.push(element);
              }
            });
            _self._buildNewsDom(policy1,'.policy1');
            _self._buildNewsDom(policy2,'.policy2');
            _self._buildNewsDom(policy3,'.policy3');
            _self._buildNewsDom(policy4,'.policy4');
        }
      });
    },
    // 安居工程
    _queryNewsOfProject:function(){
      var _self = this;
      _self.ajaxUtil.search(_self.options.OprUrls.news.queryUrl, "code='500003'",1,100, function(respons) {
        if (respons.data) {
            var news = respons.data.list;
            var project1 = [];
            var project2 = [];
            news.forEach(element => {
              if(element.summary == '校安工程'){
                project1.push(element);
              }else if(element.summary == '农居工程'){
                project2.push(element);
              }
            });
            _self._buildNewsDom(project1,'.project1');
            _self._buildNewsDom(project2,'.project2');
        }
      });
    },
    // 政务公开
    _queryNewsOfOpen:function(){
      var _self = this;
      _self.ajaxUtil.search(_self.options.OprUrls.news.queryUrl, "code='500002'",1,100, function(respons) {
        if (respons.data) {
            var news = respons.data.list;
            var open1 = [];
            var open2 = [];
            var open3 = [];
            var open4 = [];
            news.forEach(element => {
              if(element.summary == '规划计划'){
                open1.push(element);
              }else if(element.summary == '财政资金'){
                open2.push(element);
              }else if (element.summary == '招标采购'){
                open3.push(element);
              }else if(element.summary == '行政审批'){
                open4.push(element);
              }
            });
            _self._buildNewsDom(open1,'.open1');
            _self._buildNewsDom(open2,'.open2');
            _self._buildNewsDom(open3,'.open3');
            _self._buildNewsDom(open4,'.open4');
        }
      });
    },
    _queryCommon:function(){
      var _self = this;
      _self.ajaxUtil.search(_self.options.OprUrls.common.queryUrl, '1=1',1,9, function(respons) {
        if (respons.data) {
            var common = respons.data.list;
            _self._buildCommonDom(common);
        }
      });
    },
    _seachCommon:function(){
       $('.searchBtn').on('click',function(){
          var applyman = $('#applyman').val();
          var typename = $('#typename').val();
          if(applyman != '' || typename != ''){
            window.location.href ='apply.html?applyman='+ applyman+'&typename='+ typename;
          }
       });
       $('.resetBtn').on('click',function(){
        $('#applyman').val('');
        $('#typename').val('00');
     });
    },
    _buildCommonDom:function(items){
      var _self = this;
      var html = '';
      html += '<li style="margin-bottom: 0px;">';
      items.forEach(function(item,index){
        if(item.projectname.length > 16){
          item.projectname = item.projectname.substring(0,16) + '...'
        }
        html += '<div style="margin-bottom: 0px;">';
        html += '<table class="table" style="border-collapse: collapse; width:100%;line-height:42px;text-align:left;">';
        html += '<tbody>';
        html += '<tr style="color:#666666; font-size:14px;">';
        html += '<td style="width:15%;overflow:hidden;line-height:2.4;" title="'+item.applyman+'">'+item.applyman+'</td>';
        html += '<td style="width:15%;overflow:hidden;line-height:2.4;" title="抗震设防参数确定">'+item.typename+'</td>';
        html += '<td style="width:30%;overflow:hidden;line-height:2.4;">'+ item.projectname+'</td>';
        html += '<td style="width:20%;overflow:hidden;line-height:2.4;">'+ _self.common.formatDate(item.applydate)+'</td>';
        html += '<td style="width:10%;overflow:hidden;vertical-align: middle;" class="text-center">';
        html += '<span class="label label-blue">'+item.statusname+'</span>';
        html += '</td>';
        html += '</tr>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
      });                        
      html += '</li>';
      $('.Mqlist').html(html);
      $('#Marquee').jcMarquee({
        'marquee': 'y',
        'margin_bottom': '0',
        'margin_right': '0px',
        'speed': 20
    });
   },
    
    
  }
  return Widget;
});