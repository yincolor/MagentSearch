//这是runbt的专用解析文件，对该文件有影响的有渲染进程的“加载更多”和主进程的开始爬取第一页数据（前十个）
const path = require('path');
const url = require("url");
const http = require('http');//封装了一个HTPP服务器和一个简易的HTTP客户端
const https = require('https');

//注册一个爬虫完成事件，并在主进程监听
var EventEmitter = require('events').EventEmitter;     // 引入事件模块
var event = new EventEmitter();     // 实例化事件模块

//已知一页最多有10个li标签
var driver_state = {
    "search_text":"",
    "search_page_index":1,
    "search_page_count":0,
}

exports.get = function(main_searchText,main_searchDriver,main_window,main_action)
{
  //检索行为
  switch(main_action){
    case "Next_Search_Text":driver_state.search_page_index = 1;break;
    case 'Next_Page':driver_state.search_page_index = driver_state.search_page_index+1;break;
    default:
  }
  //判断搜索引擎获取搜索地址和类型，可以任意添加
  console.log("爬取指定网页");
  var req = "";
  switch(main_searchDriver)
  {
    case "runbt":
    {
      req = runbt_geturl(main_searchText);break;
    }
    case "shenmidizhi":
    {
      req = shenmidizhi_geturl(main_searchText);
      break;
    }
    case "btcili":
    {
      req = btcili_geturl(main_searchText);
      break;
    }
    case "btbit":
    {
      req = btbit_geturl(main_searchText);
      break;
    }
    case "bearbt":
    {
      req = bearbt_geturl(main_searchText);
      break;
    }
    case "zhongziso":
    {
      req = zhongzisou_geturl(main_searchText);
      break;
    }
    default:return false;
  }
  //发送并接收http请求，传送给渲染进程
  var httpByte = "";
  if(req.TYPE == "http"){
    http.get(req.URL,function(res){

      res.on('data',function(chunk){
        httpByte+=chunk;
      })
      res.on('end',function(){
        console.log("成功获取网页数据，发送到渲染进程处理。");
        main_window.webContents.send('SpliderMsg',httpByte,main_searchDriver);//发送数据
      })
    });
  }
  else if(req.TYPE == "https")
  {
    https.get(req.URL,function(res){

      res.on('data',function(chunk){
        httpByte+=chunk;
      })
      res.on('end',function(){
        console.log("成功获取网页数据，发送到渲染进程处理。");
        main_window.webContents.send('SpliderMsg',httpByte,main_searchDriver);//发送数据
      })
    });
  }
}

function runbt_geturl(searchText){
    driver_state.search_text = searchText;//设置需要检索的字符串
    var searchPath = ["/list/",searchText,"/",driver_state.search_page_index.toString()].join("");
    var searchUrl =encodeURI("http://www.runbt.co" + searchPath);//url传输中不支持汉字，所以需要将汉字转化成utf8带%的编码格式
    console.log(searchUrl);
    return {URL:searchUrl,TYPE:"http"};
}

function shenmidizhi_geturl(searchText)
{
  //http://www.shenmidizhi.info/list/%E7%8C%8E%E5%9C%BA-hot-desc-1
  driver_state.search_text = searchText;
  var searchPath = ["/list/",searchText,"-hot-desc-",driver_state.search_page_index.toString()].join("");
  var searchUrl = encodeURI("http://www.shenmidizhi.info"+searchPath);
  console.log(searchUrl);
  return {URL:searchUrl,TYPE:"http"};
}

function btbit_geturl(searchText)
{
  //http://hk.btbit.xyz/list/%E6%98%A5%E4%B8%BD/1-0-0.html
  driver_state.search_text = searchText;
  var searchPath = ["/list/",searchText,"/",driver_state.search_page_index.toString(),"-0-0.html"].join("");
  var searchUrl = encodeURI("http://hk.btbit.xyz"+searchPath);
  console.log(searchUrl);
  return {URL:searchUrl,TYPE:"http"};
}
/*electron无法获取https的网页，暂时冻结bt磁力搜索
function btcili_geturl(searchText)
{
  //https://www.btcili.cc/cili/%E6%88%98%E7%8B%BC2/default-1.html
  driver_state.search_text = searchText;
  var searchPath = ["/cili/",searchText,"/default-",driver_state.search_page_index.toString(),".html"].join("");
  var searchUrl = encodeURI("https://www.btcili.cc"+searchPath);
  console.log(searchUrl);
  return searchUrl;
}
*/
function bearbt_geturl(searchText)
{
  //http://bearbt.com/search/%E5%86%B3%E6%88%98%E4%B8%9B%E6%9E%97/1
  driver_state.search_text = searchText;
  var searchPath = ["/search/",searchText,"/",driver_state.search_page_index.toString()].join("");
  var searchUrl = encodeURI("http://bearbt.com"+searchPath);
  console.log(searchUrl);
  return {URL:searchUrl,TYPE:"http"};
}

function zhongzisou_geturl(searchText)
{
  //https://m.zhongziso.com/list/%E7%88%B8%E7%88%B8/1
  driver_state.search_text = searchText;
  var searchPath = ["/list/",searchText,"/",driver_state.search_page_index.toString()].join("");
  var searchUrl = encodeURI("https://m.zhongziso.com"+searchPath);
  console.log(searchUrl);
  return {URL:searchUrl,TYPE:"https"};
}
