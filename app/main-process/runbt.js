//这是runbt的专用解析文件，对该文件有影响的有渲染进程的“加载更多”和主进程的开始爬取第一页数据（前十个）
const path = require('path');
const url = require("url");
const http = require('http');//封装了一个HTPP服务器和一个简易的HTTP客户端

//注册一个爬虫完成事件，并在主进程监听
var EventEmitter = require('events').EventEmitter;     // 引入事件模块
var event = new EventEmitter();     // 实例化事件模块

//已知一页最多有10个li标签
var runbt_state = {
    "search_text":"",
    "search_page_index":1,
    "search_page_count":0,
}


exports.runbt_get = function(searchText,window,action){
    switch(action){
      case "Next_Search_Text":runbt_state.search_page_index = 1;break;
      case 'Next_Page':runbt_state.search_page_index = runbt_state.search_page_index+1;break;
      default:
    }
    runbt_state.search_text = searchText;//设置需要检索的字符串
    var searchPath = ["/list/",searchText,"/",runbt_state.search_page_index.toString()].join("");
    var searchUrl =encodeURI("http://www.runbt.co" + searchPath);//url传输中不支持汉字，所以需要将汉字转化成utf8带%的编码格式
    console.log(searchUrl);
    var httpByte = "";
    http.get(searchUrl,function(res){

      res.on('data',function(chunk){
        httpByte+=chunk;
      })
      res.on('end',function(){
        console.log(httpByte);
        window.webContents.send('SpliderMsg',httpByte,"runbt");//发送数据
      })
    });
}

